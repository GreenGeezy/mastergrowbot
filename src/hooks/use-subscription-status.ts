
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

// Read the environment variable to check if quiz and subscription are required
const requireQuizAndSubscription = import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';

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
      // If subscription checking is disabled, immediately grant access
      if (!requireQuizAndSubscription) {
        console.log('[useSubscriptionStatus] Quiz and subscription not required, granting access');
        setStatus({
          isLoading: false,
          hasAccess: true,
          hasCompletedQuiz: true,
          subscriptionType: 'free',
          expiresAt: null,
          error: null
        });
        return;
      }

      if (!session?.user?.id) {
        console.log('[useSubscriptionStatus] No user session, denying access');
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
        console.log('[useSubscriptionStatus] Checking access for user:', session.user.id);
        // Get user access from the view we created
        const { data, error } = await supabase
          .from('user_access_view')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('[useSubscriptionStatus] Error checking subscription status:', error);
          throw error;
        }

        console.log('[useSubscriptionStatus] Access data retrieved:', data);
        setStatus({
          isLoading: false,
          hasAccess: !!data?.has_active_subscription,
          hasCompletedQuiz: !!data?.has_completed_quiz,
          subscriptionType: data?.subscription_type || null,
          expiresAt: data?.expires_at || null,
          error: null
        });
      } catch (error) {
        console.error('[useSubscriptionStatus] Error checking subscription status:', error);
        
        // Even if there's an error, grant access anyway if the feature flag is disabled
        if (!requireQuizAndSubscription) {
          setStatus({
            isLoading: false,
            hasAccess: true,
            hasCompletedQuiz: true,
            subscriptionType: 'free',
            expiresAt: null,
            error: null
          });
        } else {
          setStatus({
            isLoading: false,
            hasAccess: false,
            hasCompletedQuiz: false,
            subscriptionType: null,
            expiresAt: null,
            error: error instanceof Error ? error : new Error('Unknown error')
          });
        }
      }
    };

    checkSubscription();
  }, [session, requireQuizAndSubscription]);

  return status;
};
