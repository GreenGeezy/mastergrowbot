
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionStatus {
  isLoading: boolean;
  hasAccess: boolean;
  hasCompletedQuiz: boolean;
  subscriptionType: string | null;
  expiresAt: string | null;
  error: Error | null;
}

export const useSubscriptionStatus = (): SubscriptionStatus => {
  const session = useSession();
  const [status, setStatus] = useState<SubscriptionStatus>({
    isLoading: true,
    hasAccess: false,
    hasCompletedQuiz: false,
    subscriptionType: null,
    expiresAt: null,
    error: null
  });

  useEffect(() => {
    const checkSubscription = async () => {
      if (!session?.user?.id) {
        setStatus({
          isLoading: false,
          hasAccess: false,
          hasCompletedQuiz: false,
          subscriptionType: null,
          expiresAt: null,
          error: null
        });
        return;
      }

      try {
        console.log("Checking subscription status for user:", session.user.id);
        
        // Get user access from the view we created
        const { data, error } = await supabase
          .from('user_access_view')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user access data:", error);
          throw error;
        }

        console.log("User access data:", data);
        
        // For development/testing, default to true if REQUIRE_QUIZ_AND_SUBSCRIPTION is not set
        const requireChecks = import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';
        
        // Default to true for access if neither access check is required
        // or if the user has active subscription and has completed quiz
        const hasAccess = !requireChecks || (data?.has_active_subscription === true);
        const hasQuiz = !requireChecks || (data?.has_completed_quiz === true);

        setStatus({
          isLoading: false,
          hasAccess,
          hasCompletedQuiz: hasQuiz,
          subscriptionType: data?.subscription_type || null,
          expiresAt: data?.expires_at || null,
          error: null
        });
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setStatus({
          isLoading: false,
          hasAccess: false,
          hasCompletedQuiz: false,
          subscriptionType: null,
          expiresAt: null,
          error: error instanceof Error ? error : new Error('Unknown error')
        });
      }
    };

    checkSubscription();
  }, [session]);

  return status;
};
