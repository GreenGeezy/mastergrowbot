
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import SubscriptionSection from '@/components/settings/SubscriptionSection';
import AuthSection from '@/components/settings/AuthSection';
import ProfileSection from '@/components/settings/ProfileSection';
import AccountSection from '@/components/settings/AccountSection';
import { StreakRewardsSection } from '@/components/rewards/StreakRewardsSection';
import { MilestoneHistory } from '@/components/milestones/MilestoneHistory';
import SupportDialog from '@/components/support/SupportDialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Settings = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const handleSignOut = () => {
    // Refresh the page to update auth state
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20 page-fade-in">
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFeedbackDialog(true)}
            className="hover:bg-gray-100 text-gray-700 hover:text-green-600 transition-colors"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Feedback
          </Button>
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

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Authentication Section - Always visible */}
          <AuthSection onSignOut={handleSignOut} />
          
          {/* Collapsible sections for authenticated users */}
          {session && (
            <Accordion type="multiple" defaultValue={["profile", "rewards", "milestones", "account", "subscription"]} className="space-y-4">
              <AccordionItem value="profile" className="border-none">
                <AccordionTrigger className="hover:no-underline p-0">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-lg font-medium text-gray-900">Profile Settings</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-0">
                  <ProfileSection />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rewards" className="border-none">
                <AccordionTrigger className="hover:no-underline p-0">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-lg font-medium text-gray-900">Bud Boost Streak Rewards</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-0">
                  <StreakRewardsSection />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="milestones" className="border-none">
                <AccordionTrigger className="hover:no-underline p-0">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-lg font-medium text-gray-900">Milestone Achievements</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-0">
                  <MilestoneHistory />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="account" className="border-none">
                <AccordionTrigger className="hover:no-underline p-0">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-lg font-medium text-gray-900">Account Settings</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-0">
                  <AccountSection />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="subscription" className="border-none">
                <AccordionTrigger className="hover:no-underline p-0">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-lg font-medium text-gray-900">Subscription</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-0">
                  <SubscriptionSection />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </main>

      <BottomNavigation />
      
      <SupportDialog 
        isOpen={showFeedbackDialog} 
        onOpenChange={setShowFeedbackDialog} 
      />
    </div>
  );
};

export default Settings;