
import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProfileInfo } from './ProfileInfo'
import { ProfileSettings } from './ProfileSettings'
import { useProfile } from '@/hooks/use-profile'

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const supabase = useSupabaseClient()
  const { toast } = useToast()
  
  // Use the centralized profile hook instead of duplicating profile loading logic
  const { 
    profileData, 
    isLoading, 
    hasError, 
    updateProfile,
    refreshProfile
  } = useProfile();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error during sign out:', error);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const updateExperienceLevel = async (level: string) => {
    await updateProfile({ grow_experience_level: level });
  }

  const updateGrowingMethod = async (method: string) => {
    await updateProfile({ growing_method: method });
  }

  const updateMonitoringMethod = async (method: string) => {
    await updateProfile({ monitoring_method: method });
  }

  const updateNutrientType = async (type: string) => {
    await updateProfile({ nutrient_type: type });
  }

  const updateChallenges = async (challenges: string[]) => {
    await updateProfile({ challenges });
  }

  const updateGoals = async (goals: string[]) => {
    await updateProfile({ goals });
  }

  const getInitials = (name?: string) => {
    if (!name) return profileData?.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors bg-transparent"
        disabled={isLoading}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
          <span className="text-sm font-medium">
            {getInitials(profileData?.username)}
          </span>
        </div>
        <span className="text-sm font-medium text-white">
          {isLoading ? "Loading..." : "Profile Settings"}
        </span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">Profile Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : hasError ? (
              <div className="p-4 text-center">
                <p className="text-red-400 mb-4">Error loading profile data</p>
                <button
                  onClick={() => refreshProfile()}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors mb-4"
                >
                  Retry
                </button>
                <ProfileSettings 
                  notifications={notifications}
                  setNotifications={setNotifications}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  handleSignOut={handleSignOut}
                  isLoading={isLoading}
                />
              </div>
            ) : (
              <>
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
                  isLoading={isLoading}
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
