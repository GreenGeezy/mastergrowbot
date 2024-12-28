import { useState, useEffect, useRef } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { User, Moon, Sun, Bell, BellOff, Key, LogOut } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

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
  const dropdownRef = useRef<HTMLDivElement>(null)
  const session = useSession()
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!session?.user?.id) return
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('username, grow_experience_level, email')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfileData(data || {})
    }

    fetchProfileData()
  }, [session?.user?.id, supabase])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
          <span className="text-sm font-medium">
            {getInitials(profileData.username)}
          </span>
        </div>
        <span className="text-sm text-white">Profile Settings</span>
      </button>

      <div
        className={cn(
          "absolute bottom-full left-0 mb-2 w-72 rounded-lg bg-card border border-border shadow-lg",
          "transform transition-all duration-200 ease-out",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {profileData.username || 'Anonymous User'}
              </p>
              <p className="text-xs text-gray-400">
                {profileData.grow_experience_level || 'Beginner'}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {session?.user?.email}
          </p>
        </div>

        <div className="p-2 space-y-1">
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
    </div>
  )
}