
import React, { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface ProfileSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileSettingsDialog: React.FC<ProfileSettingsDialogProps> = ({ isOpen, onOpenChange }) => {
  const session = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
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

  const handleSaveChanges = async () => {
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
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile changes');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      onOpenChange(false);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg bg-gray-50 text-gray-900 border-gray-200">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-gray-200 px-6 py-4 text-base text-gray-900 flex items-center gap-3">
            <User className="w-5 h-5 text-green-600" />
            Profile Settings
          </DialogTitle>
        </DialogHeader>
        
        <DialogDescription className="sr-only">
          Edit your profile settings and growing preferences
        </DialogDescription>

        <div className="overflow-y-auto max-h-[70vh]">
          <div className="px-6 pb-6 pt-4">
            <form className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-900">Name</Label>
                  <Input
                    id="username"
                    placeholder="Enter your name"
                    value={profileData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900">Email</Label>
                  <Input
                    id="email"
                    value={profileData.email}
                    disabled
                    className="bg-gray-100 border-gray-200 text-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-gray-900">Experience Level</Label>
                  <Select value={profileData.grow_experience_level} onValueChange={(value) => handleInputChange('grow_experience_level', value)}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Growing Preferences */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Growing Preferences</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="growing-method" className="text-gray-900">Growing Method</Label>
                  <Select value={profileData.growing_method} onValueChange={(value) => handleInputChange('growing_method', value)}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="greenhouse">Greenhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monitoring-method" className="text-gray-900">Monitoring Method</Label>
                  <Select value={profileData.monitoring_method} onValueChange={(value) => handleInputChange('monitoring_method', value)}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual checks</SelectItem>
                      <SelectItem value="basic_sensors">Basic sensors</SelectItem>
                      <SelectItem value="advanced_systems">Advanced systems</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nutrient-type" className="text-gray-900">Nutrient Type</Label>
                  <Select value={profileData.nutrient_type} onValueChange={(value) => handleInputChange('nutrient_type', value)}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="synthetic">Synthetic</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Growing Challenges & Goals */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="challenges" className="text-gray-900">Growing Challenges</Label>
                  <Input
                    id="challenges"
                    placeholder="e.g., pests, diseases, climate (comma separated)"
                    value={profileData.challenges.join(', ')}
                    onChange={(e) => handleArrayChange('challenges', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goals" className="text-gray-900">Growing Goals</Label>
                  <Input
                    id="goals"
                    placeholder="e.g., learn, harvest, experiment (comma separated)"
                    value={profileData.goals.join(', ')}
                    onChange={(e) => handleArrayChange('goals', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-600"
                  />
                </div>
              </div>

              {/* Account Settings */}
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900">Account Settings</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-gray-900">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="text-gray-900">Dark Mode</Label>
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                  />
                </div>
                
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleSignOut}
                  className="w-full justify-start bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </form>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-200 px-6 py-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSaveChanges}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;
