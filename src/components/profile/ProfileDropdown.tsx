import { useState, useEffect } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProfileInfo } from './ProfileInfo'
import { ProfileSettings } from './ProfileSettings'
import { ProfileData } from './types'

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData>({})
  const session = useSession()
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!session?.user?.id) {
        console.log('No user session found');
        return;
      }

      try {
        console.log('Starting profile data fetch for user:', session.user.id);
        console.log('User email:', session.user.email);
        
        // First try to get the profile data
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        console.log('Raw profile data from user_profiles:', profileData);

        // If no profile exists, create one with default values
        if (!profileData) {
          console.log('No profile found, creating default profile');
          const defaultProfile = {
            id: session.user.id,
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
        toast({
          title: "Error loading profile",
          description: "Please try signing out and back in.",
          variant: "destructive"
        });
      }
    };

    fetchProfileData();
  }, [session?.user?.id, session?.user?.email, supabase, toast]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const updateExperienceLevel = async (level: string) => {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: session.user.id,
        grow_experience_level: level
      })

    if (error) {
      toast({
        title: "Error updating experience level",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    setProfileData(prev => ({
      ...prev,
      grow_experience_level: level
    }))
  }

  const updateGrowingMethod = async (method: string) => {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: session.user.id,
        growing_method: method
      })

    if (error) {
      toast({
        title: "Error updating growing method",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    setProfileData(prev => ({
      ...prev,
      growing_method: method
    }))
  }

  const updateMonitoringMethod = async (method: string) => {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: session.user.id,
        monitoring_method: method
      })

    if (error) {
      toast({
        title: "Error updating monitoring method",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    setProfileData(prev => ({
      ...prev,
      monitoring_method: method
    }))
  }

  const updateNutrientType = async (type: string) => {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: session.user.id,
        nutrient_type: type
      })

    if (error) {
      toast({
        title: "Error updating nutrient type",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    setProfileData(prev => ({
      ...prev,
      nutrient_type: type
    }))
  }

  const updateChallenges = async (challenges: string[]) => {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: session.user.id,
        challenges
      })

    if (error) {
      toast({
        title: "Error updating challenges",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    setProfileData(prev => ({
      ...prev,
      challenges
    }))
  }

  const updateGoals = async (goals: string[]) => {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: session.user.id,
        goals
      })

    if (error) {
      toast({
        title: "Error updating goals",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    setProfileData(prev => ({
      ...prev,
      goals
    }))
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors bg-transparent"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
          <span className="text-sm font-medium">
            {getInitials(profileData.username)}
          </span>
        </div>
        <span className="text-sm font-medium text-white">Profile Settings</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">Profile Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <ProfileInfo 
              profileData={profileData}
              updateExperienceLevel={updateExperienceLevel}
              updateGrowingMethod={updateGrowingMethod}
              updateMonitoringMethod={updateMonitoringMethod}
              updateNutrientType={updateNutrientType}
              updateChallenges={updateChallenges}
              updateGoals={updateGoals}
            />
            <ProfileSettings 
              notifications={notifications}
              setNotifications={setNotifications}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              handleSignOut={handleSignOut}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
