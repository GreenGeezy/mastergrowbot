import React, { useEffect, useMemo, useState } from 'react';
import { Flame, ChevronRight, Crown, RefreshCw, LogIn, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { getLeaderboardProfile, getBudBoostLeaderboard } from '@/integrations/supabase/client';
import type { LeaderboardRow } from '@/integrations/supabase/client';
import { formatDistanceToNowStrict } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import LeaderboardModal from '@/components/guide/LeaderboardModal';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialName, setModalInitialName] = useState('');
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

      // Leaderboard via helper
      const data = await getBudBoostLeaderboard(opts?.fresh ? 20 : limit);
      setRows(Array.isArray(data) ? data : []);
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

  const openModal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/settings');
        return;
      }
      // Try to load profile name, else pseudonym from user id
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();

      const last4 = user.id.slice(-4);
      const fallback = `Grower #${last4}`;
      const initialName = (profile?.username && profile.username.trim()) || fallback;
      setModalInitialName(initialName);
      setModalOpen(true);
    } catch (e) {
      console.warn('Could not prepare leaderboard modal', e);
      setModalInitialName('Grower');
      setModalOpen(true);
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
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={openModal}>
            Join the leaderboard
          </Button>
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
        <div className="pt-3 space-y-2">
          <Button variant="ghost" className="w-full text-gold hover:bg-gold/10" onClick={handleViewMore}>
            View more <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="outline" className="w-full" onClick={openModal}>
            <Settings className="w-4 h-4 mr-2" /> Edit leaderboard settings
          </Button>
        </div>
      </div>
    );
  }, [isAuthed, isOptedIn, error, loading, rows, navigate]);

  return (
    <section aria-labelledby="leaderboard-title" className="max-w-2xl mx-auto -mt-6 mb-10">
      <Card className="rounded-2xl shadow-card border border-gold/20 bg-card">
        <CardContent className="p-4 sm:p-5">
          {header}
          {content}
        </CardContent>
      </Card>

      {/* Modal lives at root to avoid focus-trap issues */}
      <LeaderboardModal
        isOpen={modalOpen}
        onClose={async () => {
          setModalOpen(false);
          await fetchAll({ fresh: true });
        }}
        initialName={modalInitialName}
      />
    </section>
  );
};

export default BudBoostLeaderboard;
