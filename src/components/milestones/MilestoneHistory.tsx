import React, { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Calendar, Share2, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface UserMilestone {
  id: string;
  milestone_id: string;
  celebrated_at: string;
  is_shared: boolean;
  milestones_catalog: {
    title: string;
    fun_fact: string;
    streak_requirement: number;
  } | null;
}

/**
 * Component to display user's milestone achievement history
 * Shows personal achievements without exposing other users' data
 */
export const MilestoneHistory: React.FC = () => {
  const session = useSession();
  const [milestones, setMilestones] = useState<UserMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's milestone history
  useEffect(() => {
    const fetchMilestones = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_milestones')
          .select(`
            id,
            milestone_id,
            celebrated_at,
            is_shared,
            milestones_catalog (
              title,
              fun_fact,
              streak_requirement
            )
          `)
          .eq('user_id', session.user.id)
          .order('celebrated_at', { ascending: false });

        if (error) {
          console.error('Error fetching milestone history:', error);
          setError('Failed to load milestone history');
          return;
        }

        const processedData = data?.map(item => ({
          ...item,
          milestones_catalog: Array.isArray(item.milestones_catalog) 
            ? item.milestones_catalog[0] || null 
            : item.milestones_catalog
        })) || [];
        
        setMilestones(processedData as UserMilestone[]);
      } catch (err) {
        console.error('Unexpected error fetching milestones:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilestones();
  }, [session?.user?.id]);

  // Handle sharing a milestone from history
  const handleShare = async (milestone: UserMilestone) => {
    if (!milestone.milestones_catalog) return;
    
    try {
      const shareText = `🎉 ${milestone.milestones_catalog.title}\n\n${milestone.milestones_catalog.fun_fact}\n\nAchieved in MasterGrowbot AI! 🌿\n\n#BudBoostRun #CannabisGrowing #MasterGrowbot`;
      
      if (navigator.share && navigator.canShare({ text: shareText })) {
        await navigator.share({
          title: milestone.milestones_catalog.title,
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Milestone copied to clipboard! 📋');
      }

      // Mark as shared if not already
      if (!milestone.is_shared) {
        const { error } = await supabase.rpc(
          'mark_milestone_shared',
          { milestone_achievement_id: milestone.id }
        );

        if (!error) {
          setMilestones(prev => 
            prev.map(m => 
              m.id === milestone.id 
                ? { ...m, is_shared: true }
                : m
            )
          );
        }
      }
    } catch (err) {
      console.error('Error sharing milestone:', err);
      toast.error('Failed to share milestone');
    }
  };

  if (!session?.user?.id) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Sign in to view your milestone achievements</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading achievements...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-muted/30 border-destructive/20">
        <CardContent className="p-6 text-center">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <CardTitle>Your Achievements</CardTitle>
        </div>
        <CardDescription>
          Personal milestones you've unlocked on your Bud Boost journey
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {milestones.length === 0 ? (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No milestones achieved yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Keep building your Bud Boost streak to unlock achievements!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone) => {
              if (!milestone.milestones_catalog) return null;
              
              return (
                <div
                  key={milestone.id}
                  className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {milestone.milestones_catalog.streak_requirement} Day Streak
                      </Badge>
                      {milestone.is_shared && (
                        <Badge variant="secondary" className="text-xs">
                          <Share2 className="h-3 w-3 mr-1" />
                          Shared
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-1">
                      {milestone.milestones_catalog.title}
                    </h4>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {milestone.milestones_catalog.fun_fact}
                    </p>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(milestone.celebrated_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(milestone)}
                    className="ml-4"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};