import React, { createContext, useContext, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useMilestoneCelebrations } from '@/hooks/use-milestone-celebrations';
import { getUserBudBoostRun } from '@/integrations/supabase/client';
import { MilestoneCelebrationModal } from './MilestoneCelebrationModal';

interface MilestoneContextType {
  checkMilestones: () => Promise<void>;
  isCheckingMilestones: boolean;
}

const MilestoneContext = createContext<MilestoneContextType>({
  checkMilestones: async () => {},
  isCheckingMilestones: false
});

export const useMilestoneContext = () => useContext(MilestoneContext);

interface MilestoneProviderProps {
  children: React.ReactNode;
}

/**
 * Provider for milestone celebrations throughout the app
 * Automatically checks for milestones on app load and provides context for manual checks
 * Completely isolated from auth/payment flows - only works post-authentication
 */
export const MilestoneProvider: React.FC<MilestoneProviderProps> = ({ children }) => {
  const session = useSession();
  const {
    newMilestones,
    isChecking,
    checkForMilestones,
    clearMilestones,
    markMilestoneShared
  } = useMilestoneCelebrations();

  // Manual milestone check function for external triggers
  const checkMilestones = async () => {
    if (!session?.user?.id) {
      console.log('Milestone check skipped: User not authenticated');
      return;
    }

    try {
      const currentStreak = await getUserBudBoostRun();
      await checkForMilestones(currentStreak);
    } catch (error) {
      console.error('Error checking milestones:', error);
    }
  };

  // Auto-check milestones on initial app load (post-auth only)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const autoCheckMilestones = async () => {
      // Only check if user is authenticated and after a small delay to ensure auth is stable
      if (session?.user?.id) {
        console.log('Auto-checking milestones for authenticated user');
        
        // Small delay to ensure any pending auth operations complete
        timeoutId = setTimeout(async () => {
          try {
            const currentStreak = await getUserBudBoostRun();
            console.log('Current user streak:', currentStreak);
            
            if (currentStreak > 0) {
              await checkForMilestones(currentStreak);
            }
          } catch (error) {
            console.error('Error in auto milestone check:', error);
          }
        }, 1000);
      }
    };

    autoCheckMilestones();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [session?.user?.id, checkForMilestones]);

  const contextValue: MilestoneContextType = {
    checkMilestones,
    isCheckingMilestones: isChecking
  };

  return (
    <MilestoneContext.Provider value={contextValue}>
      {children}
      
      {/* Milestone Celebration Modal */}
      <MilestoneCelebrationModal
        milestones={newMilestones}
        isOpen={newMilestones.length > 0}
        onClose={clearMilestones}
        onShare={markMilestoneShared}
      />
    </MilestoneContext.Provider>
  );
};