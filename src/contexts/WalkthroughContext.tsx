import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';

export type WalkthroughStep = 
  | 'bottomNav' 
  | 'aiChatInput' 
  | 'plantHealthUpload' 
  | 'guideSearch' 
  | 'settingsSub' 
  | 'homeQuickActions' 
  | 'completed' 
  | null;

interface WalkthroughContextType {
  currentStep: WalkthroughStep;
  isWalkthroughActive: boolean;
  nextStep: () => void;
  skipWalkthrough: () => void;
  completeWalkthrough: () => void;
  startWalkthrough: () => void;
}

const WalkthroughContext = createContext<WalkthroughContextType | undefined>(undefined);

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  'bottomNav',
  'aiChatInput', 
  'plantHealthUpload',
  'guideSearch',
  'settingsSub',
  'homeQuickActions',
  'completed'
];

const STORAGE_KEY = 'mastergrowbot-walkthrough-completed';

interface WalkthroughProviderProps {
  children: ReactNode;
}

export function WalkthroughProvider({ children }: WalkthroughProviderProps) {
  const session = useSession();
  const { hasAccess, isLoading, subscriptionType } = useSubscriptionStatus();
  const [currentStep, setCurrentStep] = useState<WalkthroughStep>(null);
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);

  // Check if user has completed walkthrough before
  const hasCompletedWalkthrough = () => {
    if (!session?.user?.id) return true;
    const completed = localStorage.getItem(`${STORAGE_KEY}-${session.user.id}`);
    return completed === 'true';
  };

  // Mark walkthrough as completed
  const markWalkthroughCompleted = () => {
    if (session?.user?.id) {
      localStorage.setItem(`${STORAGE_KEY}-${session.user.id}`, 'true');
    }
  };

  // Initialize walkthrough on auth/subscription status change
  useEffect(() => {
    if (isLoading || !session?.user) {
      setIsWalkthroughActive(false);
      setCurrentStep(null);
      return;
    }

    // Only show walkthrough for users with active subscription/trial
    const shouldShowWalkthrough = hasAccess && 
                                  subscriptionType && 
                                  !hasCompletedWalkthrough();

    if (shouldShowWalkthrough) {
      setCurrentStep('bottomNav');
      setIsWalkthroughActive(true);
    } else {
      setIsWalkthroughActive(false);
      setCurrentStep(null);
    }
  }, [hasAccess, subscriptionType, isLoading, session]);

  const nextStep = () => {
    if (!currentStep) return;
    
    const currentIndex = WALKTHROUGH_STEPS.indexOf(currentStep);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= WALKTHROUGH_STEPS.length - 1) {
      completeWalkthrough();
    } else {
      setCurrentStep(WALKTHROUGH_STEPS[nextIndex]);
    }
  };

  const skipWalkthrough = () => {
    completeWalkthrough();
  };

  const completeWalkthrough = () => {
    setCurrentStep('completed');
    setIsWalkthroughActive(false);
    markWalkthroughCompleted();
  };

  const startWalkthrough = () => {
    setCurrentStep('bottomNav');
    setIsWalkthroughActive(true);
  };

  const contextValue: WalkthroughContextType = {
    currentStep,
    isWalkthroughActive,
    nextStep,
    skipWalkthrough,
    completeWalkthrough,
    startWalkthrough
  };

  return (
    <WalkthroughContext.Provider value={contextValue}>
      {children}
    </WalkthroughContext.Provider>
  );
}

export function useWalkthrough() {
  const context = useContext(WalkthroughContext);
  if (context === undefined) {
    throw new Error('useWalkthrough must be used within a WalkthroughProvider');
  }
  return context;
}