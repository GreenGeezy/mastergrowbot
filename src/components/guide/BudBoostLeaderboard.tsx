import React, { useEffect, useMemo, useState } from 'react';
import { Flame, ChevronRight, Crown, RefreshCw, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { getLeaderboardProfile, upsertLeaderboardProfile } from '@/integrations/supabase/client';
import type { LeaderboardRow } from '@/integrations/supabase/client';
import { formatDistanceToNowStrict } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const RowSkeleton: React.FC = () => (
  <div className="flex items-center justify-between py-3">
    <Skeleton className="h-5 w-10 rounded-full" />
    <Skeleton className="h-5 w-40" />
    <Skeleton className="h-5 w-20" />
  </div>
);

const EmptyState: React.FC<{ onRetry: () => void }>
  = ({ onRetry }) => (
  <div className="text-center py-6">
    <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
      <Crown className="w-5 h-5" />
    </div>
    <p className="text-sm text-muted-foreground mb-3">Be the first to join the leaderboard</p>
    <Button variant="outline" onClick={onRetry} className="border-gold/30 text-gold hover:bg-gold/10">Refresh</Button>
  </div>
);

const ErrorState: React.FC<{ onRetry: () => void }>
  = ({ onRetry }) => (
  <div className="text-center py-6">
    <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
      <RefreshCw className="w-5 h-5" />
    </div>
    <p className="text-sm text-muted-foreground mb-3">We couldn’t load the leaderboard. Please try again.</p>
    <Button onClick={onRetry} className="bg-gold text-white hover:bg-gold/90">Retry</Button>
  </div>
);

const formatRelative = (d: string) => {
  // Ensure UTC date parsing for YYYY-MM-DD
  const parsed = new Date(`${d}T00:00:00Z`);
  try {
    return formatDistanceToNowStrict(parsed, { addSuffix: true });
  } catch {
    return 'recently';
  }
};

const BudBoostLeaderboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [isOptedIn, setIsOptedIn] = useState<boolean>(false);
  const [leaderboardName, setLeaderboardName] = useState<string>('');
  const [joinOpen, setJoinOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();

  const fetchAll = async (opts?: { fresh?: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      // Check auth state
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthed(!!user);

      // Profile (to know opt-in)
      const profile = await getLeaderboardProfile();
      setIsOptedIn(!!profile?.is_opt_in);
      if (profile?.leaderboard_name) setLeaderboardName(profile.leaderboard_name);

      // Leaderboard via RPC for better error awareness
      const { data, error } = await supabase.rpc('get_bud_boost_leaderboard', { max_rows: opts?.fresh ? 20 : limit });
      if (error) {
        console.error('Leaderboard RPC error:', error);
        setError('rpc');
        setRows([]);
      } else {
        setRows(Array.isArray(data) ? (data as LeaderboardRow[]) : []);
      }
    } catch (e) {
      console.error('Unexpected leaderboard load error', e);
      setError('unexpected');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const handleViewMore = () => setLimit((n) => n + 20);

  const handleJoin = async () => {
    const saved = await upsertLeaderboardProfile({
      leaderboard_name: leaderboardName?.trim() || 'Grower',
      is_opt_in: true,
    });
    if (saved) {
      setIsOptedIn(true);
      setJoinOpen(false);
      fetchAll({ fresh: true });
    }
  };

  const header = (
    <div className="flex items-start gap-3">
      <div className="mt-1 w-9 h-9 rounded-full bg-gold/10 text-gold flex items-center justify-center shadow-subtle">
        <Flame className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">Bud Boost Run — Top Growers</h3>
        <p className="text-xs text-muted-foreground">Runs reset if you miss two days. Keep boosting!</p>
      </div>
    </div>
  );

  const content = useMemo(() => {
    if (!isAuthed) {
      return (
        <div className="py-4">
          <Button className="w-full bg-gold text-white hover:bg-gold/90" onClick={() => navigate('/settings')}>
            <LogIn className="w-4 h-4 mr-2" /> Sign in to view the leaderboard
          </Button>
        </div>
      );
    }

    if (!isOptedIn) {
      return (
        <div className="py-4">
          <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gold text-white hover:bg-gold/90">Join the leaderboard</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Join the Bud Boost Leaderboard</DialogTitle>
                <DialogDescription>Choose a public display name and opt in.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="leaderboard_name">Display name</Label>
                  <Input id="leaderboard_name" value={leaderboardName} onChange={(e) => setLeaderboardName(e.target.value)} placeholder="e.g. GreenThumb" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="optin">Opt in</Label>
                    <p className="text-xs text-muted-foreground">Your name and streak will appear on the leaderboard.</p>
                  </div>
                  <Switch id="optin" checked={true} onCheckedChange={() => {}} aria-readonly />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleJoin} className="bg-gold text-white hover:bg-gold/90">Join</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    if (error) return <ErrorState onRetry={() => fetchAll({ fresh: true })} />;

    if (loading) {
      return (
        <div className="space-y-2 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (!rows.length) return <EmptyState onRetry={() => fetchAll({ fresh: true })} />;

    return (
      <div className="mt-2">
        <ul className="divide-y divide-muted/60">
          {rows.map((row) => (
            <li
              key={row.rank}
              className="flex items-center justify-between py-3 focus:outline-none"
              tabIndex={0}
              aria-label={`Rank ${row.rank}, ${row.leaderboard_name}, ${row.run} days`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold font-semibold">
                  {row.rank}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{row.leaderboard_name}</p>
                  <p className="text-xs text-muted-foreground truncate">last boosted {formatRelative(row.last_action)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {row.run} days
              </div>
            </li>
          ))}
        </ul>
        <div className="pt-3">
          <Button variant="ghost" className="w-full text-gold hover:bg-gold/10" onClick={handleViewMore}>
            View more <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }, [isAuthed, isOptedIn, error, loading, rows, leaderboardName]);

  return (
    <section aria-labelledby="leaderboard-title" className="max-w-2xl mx-auto -mt-6 mb-10">
      <Card className="rounded-2xl shadow-card border border-gold/20 bg-card">
        <CardContent className="p-4 sm:p-5">
          {header}
          {content}
        </CardContent>
      </Card>
    </section>
  );
};

export default BudBoostLeaderboard;
