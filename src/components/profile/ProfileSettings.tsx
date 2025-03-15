
import { Key, Bell, BellOff, Moon, Sun, LogOut } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { getRedirectUrl } from '@/utils/urlUtils'

interface ProfileSettingsProps {
  notifications: boolean
  setNotifications: (value: boolean) => void
  isDarkMode: boolean
  toggleTheme: () => void
  handleSignOut: () => Promise<void>
  isLoading?: boolean
}

export function ProfileSettings({ 
  notifications, 
  setNotifications, 
  isDarkMode, 
  toggleTheme,
  handleSignOut,
  isLoading = false
}: ProfileSettingsProps) {
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false)
  const supabase = useSupabaseClient()

  const handleResetPassword = async () => {
    const { data } = await supabase.auth.getUser();
    const email = data.user?.email;
    
    if (!email) {
      toast({
        title: "Error",
        description: "Could not retrieve your email address",
        variant: "destructive",
      })
      return;
    }

    try {
      setIsPasswordResetLoading(true);
      
      // Get the correct redirect URL based on the current domain
      const redirectUrl = getRedirectUrl().replace('/auth/v1/callback', '/reset-password');
      console.log('[ProfileSettings] Password reset redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('[ProfileSettings] Password reset error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Password reset email sent",
        description: "Check your inbox for a password reset link",
      });
    } catch (error) {
      console.error("[ProfileSettings] Password reset error:", error);
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setIsPasswordResetLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleResetPassword}
        className="flex items-center w-full px-3 py-2 text-sm text-gray-200 rounded-md hover:bg-primary/10"
        disabled={isPasswordResetLoading}
      >
        <Key className="w-4 h-4 mr-3" />
        {isPasswordResetLoading ? "Sending Email..." : "Change Password"}
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
        disabled={isLoading}
      >
        <LogOut className="w-4 h-4 mr-3" />
        {isLoading ? "Signing Out..." : "Sign Out"}
      </button>
    </div>
  )
}
