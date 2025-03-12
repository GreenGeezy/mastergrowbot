
import { User } from 'lucide-react'
import { ProfileData } from './types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface ProfileInfoProps {
  profileData: ProfileData
  updateExperienceLevel: (level: string) => Promise<void>
  updateGrowingMethod: (method: string) => Promise<void>
  updateMonitoringMethod: (method: string) => Promise<void>
  updateNutrientType: (type: string) => Promise<void>
  updateChallenges: (challenges: string[]) => Promise<void>
  updateGoals: (goals: string[]) => Promise<void>
}

export function ProfileInfo({ 
  profileData, 
  updateExperienceLevel,
  updateGrowingMethod,
  updateMonitoringMethod,
  updateNutrientType,
  updateChallenges,
  updateGoals
}: ProfileInfoProps) {
  return (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Experience Level</span>
          <Select 
            value={profileData.grow_experience_level} 
            onValueChange={updateExperienceLevel}
          >
            <SelectTrigger className="w-[140px] text-white bg-transparent border-gray-600">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Growing Method</span>
          <Select 
            value={profileData.growing_method} 
            onValueChange={updateGrowingMethod}
          >
            <SelectTrigger className="w-[140px] text-white bg-transparent border-gray-600">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="indoor">Indoor</SelectItem>
              <SelectItem value="outdoor">Outdoor</SelectItem>
              <SelectItem value="greenhouse">Greenhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Monitoring Method</span>
          <Select 
            value={profileData.monitoring_method} 
            onValueChange={updateMonitoringMethod}
          >
            <SelectTrigger className="w-[140px] text-white bg-transparent border-gray-600">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual checks</SelectItem>
              <SelectItem value="basic_sensors">Basic sensors</SelectItem>
              <SelectItem value="advanced_systems">Advanced systems</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Nutrient Type</span>
          <Select 
            value={profileData.nutrient_type} 
            onValueChange={updateNutrientType}
          >
            <SelectTrigger className="w-[140px] text-white bg-transparent border-gray-600">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organic">Organic</SelectItem>
              <SelectItem value="synthetic">Synthetic</SelectItem>
              <SelectItem value="both">Both</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <span className="text-sm text-white">Growing Challenges</span>
          <div className="flex flex-wrap gap-2">
            {profileData.challenges?.map((challenge) => (
              <Badge key={challenge} variant="outline" className="text-white border-gray-600">
                {challenge}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm text-white">Growing Goals</span>
          <div className="flex flex-wrap gap-2">
            {profileData.goals?.map((goal) => (
              <Badge key={goal} variant="outline" className="text-white border-gray-600">
                {goal}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
