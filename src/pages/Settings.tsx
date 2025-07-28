
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import SubscriptionSection from '@/components/settings/SubscriptionSection';
import AuthSection from '@/components/settings/AuthSection';
import ProfileSection from '@/components/settings/ProfileSection';
import AccountSection from '@/components/settings/AccountSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Settings = () => {
  const navigate = useNavigate();
  const session = useSession();

  // Redirect to auth if not logged in (optional - can be enabled for better UX)
  useEffect(() => {
    // Uncomment to enable auth redirect
    // if (!session) {
    //   navigate('/', { replace: true });
    // }
  }, [session, navigate]);

  const handleSignOut = () => {
    // Refresh the page to update auth state
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-radial from-gray-50 via-white to-white -z-10" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100 text-gray-900 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img
                src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png"
                alt="Master Growbot Logo"
                className="w-8 h-8 transition-transform duration-200 hover:scale-105"
              />
              <h1 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
                Settings
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 
            className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight"
            style={{ 
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
              fontSize: '24pt',
              fontWeight: '700',
              color: '#111827'
            }}
          >
            Account Settings
          </h1>
          <p 
            className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
            style={{ 
              fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
              fontSize: '16pt',
              fontWeight: '400',
              color: '#4b5563'
            }}
          >
            Manage your profile and growing preferences
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Authentication Section - Always visible */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <AuthSection onSignOut={handleSignOut} />
          </div>
          
          {/* Collapsible sections for authenticated users */}
          {session && (
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Accordion 
                type="multiple" 
                defaultValue={["profile", "account", "subscription"]} 
                className="space-y-6"
              >
                <AccordionItem value="profile" className="border-none">
                  <AccordionTrigger className="hover:no-underline p-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    <div className="flex items-center gap-4 text-left w-full">
                      <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                      <span 
                        className="text-lg font-bold text-gray-900"
                        style={{ 
                          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                          fontSize: '20pt',
                          fontWeight: '700',
                          color: '#111827'
                        }}
                      >
                        Profile Settings
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-6 pb-0 pl-7">
                    <ProfileSection />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="account" className="border-none">
                  <AccordionTrigger className="hover:no-underline p-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    <div className="flex items-center gap-4 text-left w-full">
                      <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                      <span 
                        className="text-lg font-bold text-gray-900"
                        style={{ 
                          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                          fontSize: '20pt',
                          fontWeight: '700',
                          color: '#111827'
                        }}
                      >
                        Account Settings
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-6 pb-0 pl-7">
                    <AccountSection />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="subscription" className="border-none">
                  <AccordionTrigger className="hover:no-underline p-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    <div className="flex items-center gap-4 text-left w-full">
                      <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                      <span 
                        className="text-lg font-bold text-gray-900"
                        style={{ 
                          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                          fontSize: '20pt',
                          fontWeight: '700',
                          color: '#111827'
                        }}
                      >
                        Subscription
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-6 pb-0 pl-7">
                    <SubscriptionSection />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Settings;