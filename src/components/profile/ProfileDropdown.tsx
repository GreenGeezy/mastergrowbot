
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
      
      try {
        // First try to get data from user_profiles
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('username, grow_experience_level, growing_method, monitoring_method, nutrient_type, challenges, goals')
          .eq('id', session.user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Error fetching profile:', profileError)
          toast({
            title: "Error loading profile",
            description: "There was a problem loading your profile data.",
            variant: "destructive"
          })
          return
        }

        // If no profile data exists, try to get from quiz_responses
        if (!profileData) {
          const { data: quizData, error: quizError } = await supabase
            .from('quiz_responses')
            .select('experience_level, growing_method, monitoring_method, nutrient_type, challenges, goals')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          if (quizError && quizError.code !== 'PGRST116') {
            console.error('Error fetching quiz responses:', quizError)
            return
          }

          if (quizData) {
            // If we found quiz data but no profile, create the profile
            const { error: updateError } = await supabase
              .from('user_profiles')
              .upsert({
                id: session.user.id,
                grow_experience_level: quizData.experience_level,
                growing_method: quizData.growing_method,
                monitoring_method: quizData.monitoring_method,
                nutrient_type: quizData.nutrient_type,
                challenges: quizData.challenges,
                goals: quizData.goals
              })

            if (updateError) {
              console.error('Error updating profile from quiz:', updateError)
              return
            }

            setProfileData({
              email: session.user.email,
              grow_experience_level: quizData.experience_level,
              growing_method: quizData.growing_method,
              monitoring_method: quizData.monitoring_method,
              nutrient_type: quizData.nutrient_type,
              challenges: quizData.challenges,
              goals: quizData.goals
            })
          }
        } else {
          // We found profile data, use it
          setProfileData({
            ...profileData,
            email: session.user.email
          })
        }
      } catch (error) {
        console.error('Error in fetchProfileData:', error)
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading your profile.",
          variant: "destructive"
        })
      }
    }

    fetchProfileData()
  }, [session?.user?.id, supabase, toast])

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

    toast({
      title: "Experience level updated",
      description: `Your growing experience level has been set to ${level}`,
    })
  }

  const updateGrowingMethod = async (method: string) => {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('quiz_responses')
      .update({ growing_method: method })
      .eq('user_id', session.user.id)

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

    toast({
      title: "Growing method updated",
      description: `Your growing method has been set to ${method}`,
    })
  }

  const updateMonitoringMethod = async (method: string) => {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('quiz_responses')
      .update({ monitoring_method: method })
      .eq('user_id', session.user.id)

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

    toast({
      title: "Monitoring method updated",
      description: `Your monitoring method has been set to ${method}`,
    })
  }

  const updateNutrientType = async (type: string) => {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('quiz_responses')
      .update({ nutrient_type: type })
      .eq('user_id', session.user.id)

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

    toast({
      title: "Nutrient type updated",
      description: `Your nutrient type has been set to ${type}`,
    })
  }

  const updateChallenges = async (challenges: string[]) => {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('quiz_responses')
      .update({ challenges })
      .eq('user_id', session.user.id)

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

    toast({
      title: "Challenges updated",
      description: "Your growing challenges have been updated",
    })
  }

  const updateGoals = async (goals: string[]) => {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('quiz_responses')
      .update({ goals })
      .eq('user_id', session.user.id)

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

    toast({
      title: "Goals updated",
      description: "Your growing goals have been updated",
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
