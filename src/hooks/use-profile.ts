
import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ProfileData } from '@/components/profile/types';
import { toast } from '@/hooks/use-toast';

export function useProfile() {
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!session?.user?.id) {
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);
        
        // Try to get the profile data
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        // If no profile exists, create one with default values
        if (!profileData) {
          console.log('No profile found, creating default profile');
          const defaultProfile = {
            id: session.user.id,
            username: session.user.email,
            grow_experience_level: 'new',
            email: session.user.email
          };

          const { error: createError } = await supabase
            .from('user_profiles')
            .insert(defaultProfile);

          if (createError) {
            console.error('Error creating default profile:', createError);
            throw createError;
          }

          setProfileData(defaultProfile);
          return;
        }

        // Set the profile data
        setProfileData({
          email: session.user.email,
          ...profileData
        });
      } catch (error) {
        console.error('Error in fetchProfileData:', error);
        setHasError(true);
        toast({
          title: "Error loading profile",
          description: "Please try signing out and back in.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchProfileData();
    } else {
      // Reset profile data when user is not logged in
      setProfileData({});
      setHasError(false);
    }
  }, [session?.user?.id, session?.user?.email, supabase, toast]);

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
      console.error('Error updating profile:', error);
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

  return {
    profileData,
    isLoading,
    hasError,
    updateProfile
  };
}
