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
      if (!session?.user?.id) return
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('username, grow_experience_level')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfileData({
        ...data,
        email: session.user.email
      })
    }

    fetchProfileData()
  }, [session?.user?.id, supabase])

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
      .update({ grow_experience_level: level })
      .eq('id', session.user.id)

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

    toast({
      title: "Experience level updated",
      description: `Your growing experience level has been set to ${level}`,
    })
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
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