import { Key, Bell, BellOff, Moon, Sun, LogOut } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface ProfileSettingsProps {
  notifications: boolean
  setNotifications: (value: boolean) => void
  isDarkMode: boolean
  toggleTheme: () => void
  handleSignOut: () => Promise<void>
}

export function ProfileSettings({ 
  notifications, 
  setNotifications, 
  isDarkMode, 
  toggleTheme,
  handleSignOut 
}: ProfileSettingsProps) {
  return (
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
  )
}