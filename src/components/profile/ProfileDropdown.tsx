import { useState, useEffect } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { User, Moon, Sun, Bell, BellOff, Key, LogOut } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProfileData {
  username?: string
  grow_experience_level?: string
  email?: string
}

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
        <span className="text-sm text-white">Profile Settings</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">Profile Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {profileData.username || 'Anonymous User'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {session?.user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-200">Experience Level</span>
                </div>
                <Select 
                  value={profileData.grow_experience_level} 
                  onValueChange={updateExperienceLevel}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <button
                className="flex items-center w-full px-3 py-2 text-sm text-gray-200 rounded-md hover:bg-primary/10"
              >
                <Key className="w-4 h-4 mr-3" />
                Change Password
              </button>

              <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-200 rounded-md hover:bg-primary/10">
                <div className="flex items-center">
                  {notifications ? (
                    <Bell className="w-4 h-4 mr-3" />
                  ) : (
                    <BellOff className="w-4 h-4 mr-3" />
                  )}
                  Email Notifications
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-200 rounded-md hover:bg-primary/10">
                <div className="flex items-center">
                  {isDarkMode ? (
                    <Moon className="w-4 h-4 mr-3" />
                  ) : (
                    <Sun className="w-4 h-4 mr-3" />
                  )}
                  Dark Mode
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                />
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-sm text-red-400 rounded-md hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}