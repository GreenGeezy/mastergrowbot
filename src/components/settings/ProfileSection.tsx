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
import LeaderboardModal from '@/components/guide/LeaderboardModal';
import { getLeaderboardProfile, upsertLeaderboardProfile } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AvatarUpload from '@/components/profile/AvatarUpload';

interface ProfileData {
  username: string;
  email: string;
  grow_experience_level: string;
  growing_method: string;
  monitoring_method: string;
  nutrient_type: string;
  challenges: string[];
  goals: string[];
  avatar_url?: string | null;
}

const ProfileSection: React.FC = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    email: '',
    grow_experience_level: 'new',
    growing_method: 'outdoor',
    monitoring_method: 'manual',
    nutrient_type: 'organic',
    challenges: [],
    goals: [],
    avatar_url: null
  });
  const [lbModalOpen, setLbModalOpen] = useState(false);
  const [isOptIn, setIsOptIn] = useState(false);
  const [lbName, setLbName] = useState('');

  useEffect(() => {
    if (session?.user) {
      loadProfileData();
    }
  }, [session]);

  const loadProfileData = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      
      // Load user profile with safer query methods
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile load error:', profileError);
        toast.error('Failed to load profile data');
        return;
      }

      // Load quiz responses with safer query methods
      const { data: quizData, error: quizError } = await supabase
        .from('quiz_responses')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (quizError && quizError.code !== 'PGRST116') {
        console.error('Quiz data load error:', quizError);
      }

      // Check for auth session validity
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !currentSession) {
        toast.error('Session expired. Please sign in again.');
        return;
      }

      setProfileData({
        username: profile?.username || '',
        email: currentSession.user.email || '',
        grow_experience_level: profile?.grow_experience_level || quizData?.experience_level || 'new',
        growing_method: profile?.growing_method || quizData?.growing_method || 'outdoor',
        monitoring_method: profile?.monitoring_method || quizData?.monitoring_method || 'manual',
        nutrient_type: profile?.nutrient_type || quizData?.nutrient_type || 'organic',
        challenges: profile?.challenges || quizData?.challenges || [],
        goals: profile?.goals || quizData?.goals || [],
        avatar_url: profile?.avatar_url || null
      });
    } catch (error: any) {
      console.error('Error loading profile:', error);
      if (error.message?.includes('JWT')) {
        toast.error('Authentication error. Please sign in again.');
      } else {
        toast.error('Failed to load profile data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load leaderboard profile (opt-in and name)
  const loadLeaderboard = async () => {
    if (!session?.user) return;
    try {
      const profile = await getLeaderboardProfile();
      setIsOptIn(!!profile?.is_opt_in);
      setLbName(profile?.leaderboard_name || '');
    } catch (e) {
      console.warn('Failed to load leaderboard profile', e);
    }
  };

  useEffect(() => {
    if (session?.user) {
      loadLeaderboard();
    }
  }, [session]);

  const openLeaderboardModal = () => {
    if (!session) {
      navigate('/settings#auth');
      toast.error('Sign in to manage your leaderboard settings.');
      return;
    }
    const defaultName = (profileData.username?.trim()) || `Grower #${session.user.id.slice(-4)}`;
    setLbName(lbName || defaultName);
    setLbModalOpen(true);
  };

  const handleLeaveLeaderboard = async () => {
    if (!session) {
      navigate('/settings#auth');
      toast.error('Sign in to manage your leaderboard settings.');
      return;
    }
    try {
      const saved = await upsertLeaderboardProfile({
        leaderboard_name: lbName || (profileData.username?.trim() || `Grower #${session.user.id.slice(-4)}`),
        is_opt_in: false,
      });
      if (saved) {
        toast.success('You left the leaderboard.');
        await loadLeaderboard();
      } else {
        throw new Error('Update failed');
      }
    } catch (e) {
      console.error('Leave leaderboard error', e);
      toast.error("Couldn't update your leaderboard settings. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    if (!session?.user) {
      toast.error('Please sign in to save changes');
      return;
    }

    // Validate required fields
    if (!profileData.username.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);
    try {
      // Check current session validity before saving
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !currentSession) {
        toast.error('Session expired. Please sign in again.');
        setLoading(false);
        return;
      }

      // Create retry logic for database operations
      const retryOperation = async (operation: () => Promise<any>, maxRetries = 3) => {
        for (let i = 0; i < maxRetries; i++) {
          try {
            return await operation();
          } catch (error: any) {
            if (i === maxRetries - 1) throw error;
            if (error.message?.includes('JWT') || error.code === '401') {
              // Force session refresh and retry
              await supabase.auth.refreshSession();
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Progressive delay
          }
        }
      };

      // Update user profile with retry logic
      await retryOperation(async () => {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: currentSession.user.id,
            username: profileData.username.trim(),
            grow_experience_level: profileData.grow_experience_level,
            growing_method: profileData.growing_method,
            monitoring_method: profileData.monitoring_method,
            nutrient_type: profileData.nutrient_type,
            challenges: profileData.challenges.filter(c => c.trim()),
            goals: profileData.goals.filter(g => g.trim())
          }, {
            onConflict: 'id'
          });

        if (profileError) throw profileError;
      });

      // Update quiz responses with retry logic (optional sync)
      try {
        await retryOperation(async () => {
          const { error: quizError } = await supabase
            .from('quiz_responses')
            .upsert({
              user_id: currentSession.user.id,
              experience_level: profileData.grow_experience_level as any,
              growing_method: profileData.growing_method as any,
              monitoring_method: profileData.monitoring_method as any,
              nutrient_type: profileData.nutrient_type as any,
              challenges: profileData.challenges.filter(c => c.trim()),
              goals: profileData.goals.filter(g => g.trim())
            }, {
              onConflict: 'user_id'
            });

          if (quizError) throw quizError;
        });
      } catch (quizSyncError) {
        console.warn('Quiz sync failed, profile still saved:', quizSyncError);
        // Don't throw - profile save succeeded
      }

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      
      if (error.message?.includes('JWT') || error.code === '401') {
        toast.error('Authentication error. Please sign in again.');
      } else if (error.message?.includes('violates row-level security')) {
        toast.error('Permission denied. Please sign in again.');
      } else if (error.message?.includes('duplicate key')) {
        toast.error('Profile already exists. Refreshing page...');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error('Failed to save profile changes. Please try again.');
      }
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
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <AvatarUpload
                userId={session.user.id}
                currentAvatarUrl={profileData.avatar_url}
                onAvatarUpdate={(url) => handleInputChange('avatar_url', url)}
              />
            </div>
            
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

        {/* Leaderboard */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Leaderboard</h3>
              <p className="text-xs text-gray-600">Control how you appear on the Bud Boost Run board.</p>
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            {!isOptIn ? (
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={openLeaderboardModal}>
                Join the leaderboard
              </Button>
            ) : (
              <>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={openLeaderboardModal}>
                  Edit leaderboard name
                </Button>
                <Button variant="outline" onClick={handleLeaveLeaderboard}>
                  Leave leaderboard
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-2">We only show your Leaderboard Name. You can leave anytime.</p>
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

        <LeaderboardModal
          isOpen={lbModalOpen}
          onClose={async () => {
            setLbModalOpen(false);
            await loadLeaderboard();
          }}
          initialName={profileData.username?.trim() || `Grower #${session?.user?.id?.slice(-4) || '0000'}`}
          initialOptIn={isOptIn}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileSection;