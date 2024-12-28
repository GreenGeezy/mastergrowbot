import { User } from 'lucide-react'
import { ProfileData } from './types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProfileInfoProps {
  profileData: ProfileData
  updateExperienceLevel: (level: string) => Promise<void>
}

export function ProfileInfo({ profileData, updateExperienceLevel }: ProfileInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <User className="w-5 h-5 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium text-white">
            {profileData.username || 'Anonymous User'}
          </p>
          <p className="text-xs text-gray-400">
            {profileData.email}
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
  )
}