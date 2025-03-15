
import { useState, useEffect, useCallback } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ProfileData } from '@/components/profile/types';
import { toast } from '@/hooks/use-toast';

export function useProfile() {
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();

  // Create a more robust fetch function that we can also call manually
  const fetchProfileData = useCallback(async () => {
    if (!session?.user?.id) {
      return { success: false, reason: 'no-session' };
    }

    try {
      setIsLoading(true);
      setHasError(false);
      console.log('[useProfile] Fetching profile for user:', session.user.id);
      
      // Try to get the profile data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('[useProfile] Error fetching profile:', profileError);
        throw profileError;
      }

      // If no profile exists, create one with default values
      if (!profileData) {
        console.log('[useProfile] No profile found, creating default profile');
        const defaultProfile = {
          id: session.user.id,
          username: session.user.email?.split('@')[0] || 'User',
          grow_experience_level: 'new',
          email: session.user.email,
          has_completed_quiz: false
        };

        const { error: createError } = await supabase
          .from('user_profiles')
          .insert(defaultProfile);

        if (createError) {
          console.error('[useProfile] Error creating default profile:', createError);
          throw createError;
        }

        setProfileData(defaultProfile);
        return { success: true, data: defaultProfile, created: true };
      }

      // Set the profile data
      const completeProfileData = {
        email: session.user.email,
        ...profileData
      };
      
      setProfileData(completeProfileData);
      return { success: true, data: completeProfileData, created: false };
    } catch (error) {
      console.error('[useProfile] Error in fetchProfileData:', error);
      setHasError(true);
      setProfileData({});
      
      // Only show toast in UI, not on initial load
      toast({
        title: "Error loading profile",
        description: "Please try signing out and back in.",
        variant: "destructive"
      });
      
      return { success: false, reason: 'error', error };
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, session?.user?.email, supabase, toast]);

  // Effect to load profile data when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchProfileData();
    } else {
      // Reset profile data when user is not logged in
      setProfileData({});
      setHasError(false);
    }
  }, [session?.user?.id, fetchProfileData]);

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!session?.user?.id) return false;

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: session.user.id,
          ...updates
        });

      if (error) {
        console.error('[useProfile] Error updating profile:', error);
        toast({
          title: "Error updating profile",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setProfileData(prev => ({
        ...prev,
        ...updates
      }));
      
      return true;
    } catch (error) {
      console.error('[useProfile] Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = () => {
    return fetchProfileData();
  };

  return {
    profileData,
    isLoading,
    hasError,
    updateProfile,
    refreshProfile
  };
}
