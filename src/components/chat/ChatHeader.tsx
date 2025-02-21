
import React, { useState } from 'react';
import { MessageSquare, MessageCircle, Camera, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SupportDialog from '@/components/support/SupportDialog';
import FeatureCard from '@/components/FeatureCard';
import { supabase } from '@/integrations/supabase/client';

export const ChatHeader = () => {
  const [showSupport, setShowSupport] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-[#333333] bg-[#1A1A1A]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
              alt="Master Growbot Logo" 
              className="w-10 h-10 rounded-full"
            />
            <h1 className="text-xl font-semibold text-white">Master Growbot</h1>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <FeatureCard
              icon={MessageCircle}
              title="Growing Assistant"
              subtitle="Get expert growing advice"
              to="/chat"
            />
            <FeatureCard
              icon={Camera}
              title="Plant Health Check"
              subtitle="Diagnose plant issues"
              to="/plant-health"
            />
            <FeatureCard
              icon={BookOpen}
              title="Growing Guide"
              subtitle="Quick answers to FAQs"
              to="/grow-guide"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/auth/v1/callback`
              }
            })}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow inline-flex items-center"
          >
            <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>
          <Button 
            variant="secondary" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setShowSupport(true)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Share Feedback
          </Button>
        </div>
      </div>
      <SupportDialog isOpen={showSupport} onOpenChange={setShowSupport} />
    </>
  );
};

