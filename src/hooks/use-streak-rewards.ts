import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Badge {
  id: string;
  name: string;
  icon_url: string | null;
  description: string;
  unlock_requirement: number;
  unlocked_at?: string;
  is_active?: boolean;
}

export interface AvatarCustomization {
  id: string;
  name: string;
  image_url: string | null;
  description: string;
  unlock_requirement: number;
  applied_at?: string;
  is_active?: boolean;
}

export interface NewlyUnlockedRewards {
  badges: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  avatars: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export function useStreakRewards() {
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [userAvatars, setUserAvatars] = useState<AvatarCustomization[]>([]);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [availableAvatars, setAvailableAvatars] = useState<AvatarCustomization[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const { toast } = useToast();

  // Fetch user's current badges and avatars
  const fetchUserRewards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user badges with catalog info
      const { data: badges, error: badgesError } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge_id,
          badges_catalog!inner(
            id,
            name,
            icon_url,
            description,
            unlock_requirement
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (badgesError) {
        console.error('Error fetching user badges:', badgesError);
      } else {
        const formattedBadges: Badge[] = badges?.map(b => ({
          id: b.badges_catalog.id,
          name: b.badges_catalog.name,
          icon_url: b.badges_catalog.icon_url,
          description: b.badges_catalog.description,
          unlock_requirement: b.badges_catalog.unlock_requirement,
          unlocked_at: b.unlocked_at,
          is_active: b.is_active
        })) || [];
        setUserBadges(formattedBadges);
      }

      // Fetch user avatars with catalog info
      const { data: avatars, error: avatarsError } = await supabase
        .from('user_avatars')
        .select(`
          *,
          avatar_customization_id,
          avatar_customizations_catalog!inner(
            id,
            name,
            image_url,
            description,
            unlock_requirement
          )
        `)
        .eq('user_id', user.id);

      if (avatarsError) {
        console.error('Error fetching user avatars:', avatarsError);
      } else {
        const formattedAvatars: AvatarCustomization[] = avatars?.map(a => ({
          id: a.avatar_customizations_catalog.id,
          name: a.avatar_customizations_catalog.name,
          image_url: a.avatar_customizations_catalog.image_url,
          description: a.avatar_customizations_catalog.description,
          unlock_requirement: a.avatar_customizations_catalog.unlock_requirement,
          applied_at: a.applied_at,
          is_active: a.is_active
        })) || [];
        setUserAvatars(formattedAvatars);
      }

    } catch (error) {
      console.error('Error fetching user rewards:', error);
    }
  };

  // Fetch all available badges and avatars from catalogs
  const fetchAvailableRewards = async () => {
    try {
      // Fetch badges catalog
      const { data: badges, error: badgesError } = await supabase
        .from('badges_catalog')
        .select('*')
        .order('unlock_requirement', { ascending: true });

      if (badgesError) {
        console.error('Error fetching badges catalog:', badgesError);
      } else {
        setAvailableBadges(badges || []);
      }

      // Fetch avatars catalog
      const { data: avatars, error: avatarsError } = await supabase
        .from('avatar_customizations_catalog')
        .select('*')
        .order('unlock_requirement', { ascending: true });

      if (avatarsError) {
        console.error('Error fetching avatars catalog:', avatarsError);
      } else {
        setAvailableAvatars(avatars || []);
      }

    } catch (error) {
      console.error('Error fetching available rewards:', error);
    }
  };

  // Check for new rewards based on current streak
  const checkStreakRewards = async (currentStreak: number): Promise<NewlyUnlockedRewards | null> => {
    if (checking) return null;
    
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-streak-rewards', {
        body: { current_streak: currentStreak }
      });

      if (error) {
        console.error('Error checking streak rewards:', error);
        toast({
          title: "Error checking rewards",
          description: "Failed to check for new streak rewards. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      const newlyUnlocked = data.newly_unlocked as NewlyUnlockedRewards;
      
      // Show success notification if new rewards were unlocked
      if (newlyUnlocked.badges.length > 0 || newlyUnlocked.avatars.length > 0) {
        const rewardCount = newlyUnlocked.badges.length + newlyUnlocked.avatars.length;
        toast({
          title: "🎉 New Bud Boost Streak Rewards!",
          description: `Congratulations! You've unlocked ${rewardCount} new reward${rewardCount > 1 ? 's' : ''} for your ${currentStreak}-day streak!`,
        });

        // Refresh user rewards to show newly unlocked items
        await fetchUserRewards();
      }

      return newlyUnlocked;

    } catch (error) {
      console.error('Error in checkStreakRewards:', error);
      toast({
        title: "Error checking rewards",
        description: "An unexpected error occurred while checking for rewards.",
        variant: "destructive"
      });
      return null;
    } finally {
      setChecking(false);
    }
  };

  // Apply an avatar customization
  const applyAvatarCustomization = async (customizationId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // First, deactivate all current avatars for this user
      await supabase
        .from('user_avatars')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Then activate the selected one
      const { error } = await supabase
        .from('user_avatars')
        .update({ is_active: true, applied_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('avatar_customization_id', customizationId);

      if (error) {
        console.error('Error applying avatar customization:', error);
        toast({
          title: "Error applying avatar",
          description: "Failed to apply avatar customization. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Avatar updated!",
        description: "Your avatar customization has been applied successfully.",
      });

      // Refresh user avatars
      await fetchUserRewards();
      return true;

    } catch (error) {
      console.error('Error in applyAvatarCustomization:', error);
      return false;
    }
  };

  // Initial load
  useEffect(() => {
    const loadRewards = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserRewards(),
        fetchAvailableRewards()
      ]);
      setLoading(false);
    };

    loadRewards();
  }, []);

  return {
    userBadges,
    userAvatars,
    availableBadges,
    availableAvatars,
    loading,
    checking,
    checkStreakRewards,
    applyAvatarCustomization,
    refreshRewards: fetchUserRewards
  };
}