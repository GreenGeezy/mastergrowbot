import React, { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProfileData {
  username: string;
  email: string;
  grow_experience_level: string;
  growing_method: string;
  monitoring_method: string;
  nutrient_type: string;
  challenges: string[];
  goals: string[];
}

const ProfileSection: React.FC = () => {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    email: '',
    grow_experience_level: 'new',
    growing_method: 'outdoor',
    monitoring_method: 'manual',
    nutrient_type: 'organic',
    challenges: [],
    goals: []
  });

  useEffect(() => {
    if (session?.user) {
      loadProfileData();
    }
  }, [session]);

  const loadProfileData = async () => {
    if (!session?.user) return;

    try {
      // Load user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      // Load quiz responses
      const { data: quizData } = await supabase
        .from('quiz_responses')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      setProfileData({
        username: profile?.username || '',
        email: session.user.email || '',
        grow_experience_level: profile?.grow_experience_level || quizData?.experience_level || 'new',
        growing_method: profile?.growing_method || quizData?.growing_method || 'outdoor',
        monitoring_method: profile?.monitoring_method || quizData?.monitoring_method || 'manual',
        nutrient_type: profile?.nutrient_type || quizData?.nutrient_type || 'organic',
        challenges: profile?.challenges || quizData?.challenges || [],
        goals: profile?.goals || quizData?.goals || []
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!session?.user) return;

    setLoading(true);
    try {
      // Update user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: session.user.id,
          username: profileData.username,
          grow_experience_level: profileData.grow_experience_level,
          growing_method: profileData.growing_method,
          monitoring_method: profileData.monitoring_method,
          nutrient_type: profileData.nutrient_type,
          challenges: profileData.challenges,
          goals: profileData.goals
        });

      if (profileError) throw profileError;

      // Update quiz responses
      const { error: quizError } = await supabase
        .from('quiz_responses')
        .upsert({
          user_id: session.user.id,
          experience_level: profileData.grow_experience_level as any,
          growing_method: profileData.growing_method as any,
          monitoring_method: profileData.monitoring_method as any,
          nutrient_type: profileData.nutrient_type as any,
          challenges: profileData.challenges,
          goals: profileData.goals
        });

      if (quizError) throw quizError;

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile changes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'challenges' | 'goals', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    handleInputChange(field, items);
  };

  if (!session) {
    return null;
  }

  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-green-600" />
          <div>
            <CardTitle className="text-gray-900">Profile Settings</CardTitle>
            <CardDescription className="text-gray-600">
              Update your growing details for personalized AI advice
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name" className="text-gray-900">Name</Label>
              <Input
                id="profile-name"
                placeholder="Enter your name"
                value={profileData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-email" className="text-gray-900">Email</Label>
              <Input
                id="profile-email"
                value={profileData.email}
                disabled
                className="bg-gray-100 border-gray-200 text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="experience" className="text-gray-900 flex items-center gap-2">
                      Experience Level
                      <Info className="h-4 w-4 text-gray-500" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your growing experience helps us customize advice</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Select value={profileData.grow_experience_level} onValueChange={(value) => handleInputChange('grow_experience_level', value)}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 z-50">
                  <SelectItem value="new">🌱 New</SelectItem>
                  <SelectItem value="intermediate">🌿 Intermediate</SelectItem>
                  <SelectItem value="advanced">🌳 Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Growing Method */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Growing Setup</h3>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="growing-method" className="text-gray-900">Growing Method</Label>
              <Select value={profileData.growing_method} onValueChange={(value) => handleInputChange('growing_method', value)}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 z-50">
                  <SelectItem value="outdoor">🌞 Outdoor</SelectItem>
                  <SelectItem value="indoor">🏠 Indoor</SelectItem>
                  <SelectItem value="greenhouse">🏡 Greenhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monitoring-method" className="text-gray-900">Monitoring Method</Label>
              <Select value={profileData.monitoring_method} onValueChange={(value) => handleInputChange('monitoring_method', value)}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 z-50">
                  <SelectItem value="manual">👀 Manual checks</SelectItem>
                  <SelectItem value="basic_sensors">📊 Basic sensors</SelectItem>
                  <SelectItem value="advanced_systems">🤖 Advanced systems</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nutrient-type" className="text-gray-900">Nutrient Type</Label>
              <Select value={profileData.nutrient_type} onValueChange={(value) => handleInputChange('nutrient_type', value)}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 z-50">
                  <SelectItem value="organic">🌿 Organic</SelectItem>
                  <SelectItem value="synthetic">⚗️ Synthetic</SelectItem>
                  <SelectItem value="both">🔄 Both</SelectItem>
                  <SelectItem value="none">🚫 None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Growing Preferences */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Growing Preferences</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="challenges" className="text-gray-900">Growing Challenges</Label>
              <Textarea
                id="challenges"
                placeholder="e.g., pests, diseases, climate (comma separated)"
                value={profileData.challenges.join(', ')}
                onChange={(e) => handleArrayChange('challenges', e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-600 min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goals" className="text-gray-900">Growing Goals</Label>
              <Textarea
                id="goals"
                placeholder="e.g., learn, harvest, experiment (comma separated)"
                value={profileData.goals.join(', ')}
                onChange={(e) => handleArrayChange('goals', e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-600 min-h-[80px]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Button 
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
          >
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;