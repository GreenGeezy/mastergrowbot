
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileSettingsDialog from '@/components/profile/ProfileSettingsDialog';
import Header from '@/components/Header';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import SubscriptionSection from '@/components/settings/SubscriptionSection';

const Settings = () => {
  const navigate = useNavigate();
  const [showProfileDialog, setShowProfileDialog] = useState(true);

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      <div className="absolute inset-0 bg-gradient-radial from-gray-50 via-white to-white -z-10" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100 text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img
                src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png"
                alt="Master Growbot Logo"
                className="w-8 h-8"
              />
              <h1 className="text-xl font-medium text-gray-900">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            Account Settings
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your profile and growing preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Subscription Section */}
          <div className="max-w-2xl mx-auto">
            <SubscriptionSection />
          </div>
          
          {/* Profile Settings */}
          <div className="flex justify-center">
            <ProfileSettingsDialog 
              isOpen={showProfileDialog} 
              onOpenChange={setShowProfileDialog}
            />
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
