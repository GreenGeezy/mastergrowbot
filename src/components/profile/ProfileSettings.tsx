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
        className="flex items-center w-full px-3 py-2 text-sm text-gray-900 rounded-md hover:bg-green-50"
      >
        <Key className="w-4 h-4 mr-3 text-green-600" />
        Change Password
      </button>

      <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-900 rounded-md hover:bg-green-50">
        <div className="flex items-center">
          {notifications ? (
            <Bell className="w-4 h-4 mr-3 text-green-600" />
          ) : (
            <BellOff className="w-4 h-4 mr-3 text-gray-600" />
          )}
          Email Notifications
        </div>
        <Switch
          checked={notifications}
          onCheckedChange={setNotifications}
        />
      </div>

      <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-900 rounded-md hover:bg-green-50">
        <div className="flex items-center">
          {isDarkMode ? (
            <Moon className="w-4 h-4 mr-3 text-green-600" />
          ) : (
            <Sun className="w-4 h-4 mr-3 text-green-600" />
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
        className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
      >
        <LogOut className="w-4 h-4 mr-3" />
        Sign Out
      </button>
    </div>
  )
}