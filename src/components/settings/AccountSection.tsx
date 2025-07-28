import React, { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Moon, MessageSquare } from 'lucide-react';
import SupportDialog from '@/components/support/SupportDialog';

const AccountSection: React.FC = () => {
  const session = useSession();
  const [notifications, setNotifications] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  if (!session) {
    return null;
  }

  return (
    <>
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-green-600" />
            <div>
              <CardTitle className="text-gray-900">Account Settings</CardTitle>
              <CardDescription className="text-gray-600">
                Manage your app preferences and feedback
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Bell className={`h-4 w-4 ${notifications ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <Label htmlFor="email-notifications" className="text-gray-900 font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600">Receive updates about your plants</p>
                  </div>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Moon className={`h-4 w-4 ${isDarkMode ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <Label htmlFor="dark-mode" className="text-gray-900 font-medium">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-gray-600">Switch to dark theme</p>
                  </div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Support</h3>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start gap-3 mb-3">
                <MessageSquare className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Share Your Feedback</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Help us improve Master Growbot by sharing your thoughts and suggestions.
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => setShowFeedbackDialog(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl h-12 flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Share Feedback
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <SupportDialog 
        isOpen={showFeedbackDialog} 
        onOpenChange={setShowFeedbackDialog} 
      />
    </>
  );
};

export default AccountSection;