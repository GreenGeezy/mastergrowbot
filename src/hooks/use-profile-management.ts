import { useState, useEffect } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useToast } from '@/hooks/use-toast'
import { ProfileData } from '@/components/profile/types'

export function useProfileManagement() {
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

  return {
    isDarkMode,
    notifications,
    profileData,
    setNotifications,
    handleSignOut,
    toggleTheme,
    updateExperienceLevel
  }
}