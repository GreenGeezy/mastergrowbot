
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
        
        // First check if quiz and subscription are required
        const requireChecks = import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';
        
        // If not required, grant access immediately
        if (!requireChecks) {
          setStatus({
            isLoading: false,
            hasAccess: true,
            hasCompletedQuiz: true,
            subscriptionType: 'basic',
            expiresAt: null,
            error: null
          });
          return;
        }
        
        // Get user access from the view we created
        const { data, error } = await supabase
          .from('user_access_view')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          // Only throw if it's not a "no rows returned" error
          if (!error.message.includes('JSON object requested, multiple (or no) rows returned')) {
            console.error("Error fetching user access data:", error);
            throw error;
          }
        }

        console.log("User access data:", data);
        
        // If no data was returned, let's manually check user_profiles and subscriptions
        if (!data) {
          console.log("No data returned from user_access_view, checking individual tables");
          
          // Check user profile for quiz completion
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('has_completed_quiz')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) console.error("Error fetching profile:", profileError);
          
          // Check subscriptions for active subscription
          const { data: subData, error: subError } = await supabase
            .from('subscriptions')
            .select('subscription_type, expires_at, status')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .gt('expires_at', new Date().toISOString())
            .maybeSingle();
            
          if (subError) console.error("Error fetching subscription:", subError);
          
          const hasQuiz = profileData?.has_completed_quiz === true;
          const hasSubscription = subData && subData.status === 'active';
          
          setStatus({
            isLoading: false,
            hasAccess: hasSubscription,
            hasCompletedQuiz: hasQuiz,
            subscriptionType: subData?.subscription_type || null,
            expiresAt: subData?.expires_at || null,
            error: null
          });
          
          return;
        }
        
        setStatus({
          isLoading: false,
          hasAccess: data?.has_active_subscription === true,
          hasCompletedQuiz: data?.has_completed_quiz === true,
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
