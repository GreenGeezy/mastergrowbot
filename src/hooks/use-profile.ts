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
      console.log('[useProfile] No user session found');
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
        
        // For OAuth users, extract name from user metadata if available
        let username = session.user.email?.split('@')[0] || 'User';
        if (session.user.user_metadata?.full_name) {
          username = session.user.user_metadata.full_name;
        } else if (session.user.user_metadata?.name) {
          username = session.user.user_metadata.name;
        }
        
        const defaultProfile = {
          id: session.user.id,
          username: username,
          grow_experience_level: 'new',
          growing_method: 'indoor',
          monitoring_method: 'manual',
          nutrient_type: 'organic',
          challenges: ['none'],
          goals: ['learn'],
          email: session.user.email,
          has_completed_quiz: true  // Always set to true to avoid quiz requirement
        };

        console.log('[useProfile] Creating profile with data:', defaultProfile);

        const { error: createError } = await supabase
          .from('user_profiles')
          .insert(defaultProfile);

        if (createError) {
          console.error('[useProfile] Error creating default profile:', createError);
          throw createError;
        }

        // Set the profile data in the state
        setProfileData(defaultProfile);
        console.log('[useProfile] Created default profile successfully', defaultProfile);
        setIsLoading(false);
        return { success: true, data: defaultProfile, created: true };
      }

      // Set the profile data
      const completeProfileData = {
        email: session.user.email,
        ...profileData
      };
      
      // Always ensure quiz is marked as completed
      if (!profileData.has_completed_quiz) {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ has_completed_quiz: true })
          .eq('id', session.user.id);
        
        if (updateError) {
          console.warn('[useProfile] Error updating quiz completion status:', updateError);
        } else {
          completeProfileData.has_completed_quiz = true;
          console.log('[useProfile] Updated profile to mark quiz as completed');
        }
      }
      
      console.log('[useProfile] Profile data loaded successfully', completeProfileData);
      setProfileData(completeProfileData);
      setIsLoading(false);
      return { success: true, data: completeProfileData, created: false };
    } catch (error) {
      console.error('[useProfile] Error in fetchProfileData:', error);
      setHasError(true);
      setProfileData({});
      setIsLoading(false);
      return { success: false, reason: 'error', error };
    }
  }, [session?.user?.id, session?.user?.email, session?.user?.user_metadata, supabase]);

  // Effect to load profile data when session changes
  useEffect(() => {
    if (session?.user?.id) {
      console.log('[useProfile] Session changed, loading profile data');
      fetchProfileData();
    } else {
      // Reset profile data when user is not logged in
      console.log('[useProfile] No active session, clearing profile data');
      setProfileData({});
      setHasError(false);
    }
  }, [session?.user?.id, fetchProfileData]);

  // Listen for auth state changes to refresh profile
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log(`[useProfile] Auth event ${event}, refreshing profile`);
        fetchProfileData();
      } else if (event === 'SIGNED_OUT') {
        console.log(`[useProfile] Auth event ${event}, clearing profile`);
        setProfileData({});
        setHasError(false);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfileData, supabase.auth]);

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!session?.user?.id) return false;

    try {
      setIsLoading(true);
      console.log('[useProfile] Updating profile with:', updates);
      
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
      
      console.log('[useProfile] Profile updated successfully');
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
    console.log('[useProfile] Manually refreshing profile');
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
