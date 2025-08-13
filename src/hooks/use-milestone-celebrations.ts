import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

interface Milestone {
  id: string;
  title: string;
  fun_fact: string;
  streak_requirement: number;
}

interface MilestoneCelebration {
  milestones: Milestone[];
}

interface UseMilestoneCelebrationsReturn {
  newMilestones: Milestone[];
  isChecking: boolean;
  error: string | null;
  checkForMilestones: (currentStreak: number) => Promise<void>;
  clearMilestones: () => void;
  markMilestoneShared: (milestoneId: string) => Promise<boolean>;
}

/**
 * Hook for managing personal milestone celebrations
 * This is completely isolated from auth/payment flows and only works post-authentication
 */
export const useMilestoneCelebrations = (): UseMilestoneCelebrationsReturn => {
  const session = useSession();
  const [newMilestones, setNewMilestones] = useState<Milestone[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for new milestone achievements based on current streak
  const checkForMilestones = async (currentStreak: number) => {
    // Only check if user is authenticated (post-auth safety)
    if (!session?.user?.id) {
      console.log('Milestone check skipped: User not authenticated');
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc(
        'check_personal_milestone_achievements',
        { current_user_streak: currentStreak }
      );

      if (error) {
        console.error('Error checking milestones:', error);
        setError('Failed to check milestone achievements');
        return;
      }

      if (data?.milestones && Array.isArray(data.milestones)) {
        const achievedMilestones = data.milestones as Milestone[];
        
        if (achievedMilestones.length > 0) {
          console.log(`🎉 New milestones achieved:`, achievedMilestones);
          setNewMilestones(achievedMilestones);
        }
      }
    } catch (err) {
      console.error('Unexpected error checking milestones:', err);
      setError('An unexpected error occurred while checking achievements');
    } finally {
      setIsChecking(false);
    }
  };

  // Clear displayed milestones (after user has seen them)
  const clearMilestones = () => {
    setNewMilestones([]);
    setError(null);
  };

  // Mark a milestone as shared for viral tracking
  const markMilestoneShared = async (milestoneId: string): Promise<boolean> => {
    if (!session?.user?.id) {
      console.warn('Cannot mark milestone as shared: User not authenticated');
      return false;
    }

    try {
      // Find the user's milestone record first
      const { data: userMilestone, error: fetchError } = await supabase
        .from('user_milestones')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('milestone_id', milestoneId)
        .single();

      if (fetchError || !userMilestone) {
        console.error('Error finding milestone record:', fetchError);
        return false;
      }

      const { data, error } = await supabase.rpc(
        'mark_milestone_shared',
        { milestone_achievement_id: userMilestone.id }
      );

      if (error) {
        console.error('Error marking milestone as shared:', error);
        return false;
      }

      return data === true;
    } catch (err) {
      console.error('Unexpected error marking milestone as shared:', err);
      return false;
    }
  };

  // Reset state when user logs out
  useEffect(() => {
    if (!session?.user?.id) {
      setNewMilestones([]);
      setError(null);
    }
  }, [session?.user?.id]);

  return {
    newMilestones,
    isChecking,
    error,
    checkForMilestones,
    clearMilestones,
    markMilestoneShared
  };
};