
import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export interface SubscriptionStatus {
  isLoading: boolean;
  hasAccess: boolean;
  subscriptionType: string | null;
  expiresAt: string | null;
  hasCompletedQuiz: boolean;
}

export function useSubscriptionStatus(): SubscriptionStatus {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [status, setStatus] = useState<SubscriptionStatus>({
    isLoading: true,
    hasAccess: false,
    subscriptionType: null,
    expiresAt: null,
    hasCompletedQuiz: false
  });

  useEffect(() => {
    const checkAccess = async () => {
      if (!session?.user?.id) {
        setStatus({
          isLoading: false,
          hasAccess: false,
          subscriptionType: null,
          expiresAt: null,
          hasCompletedQuiz: false
        });
        return;
      }

      try {
        // Get user access information from our view
        const { data, error } = await supabase
          .from('user_access_view')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setStatus({
            isLoading: false,
            hasAccess: data.has_active_subscription && data.has_completed_quiz,
            subscriptionType: data.subscription_type,
            expiresAt: data.expires_at,
            hasCompletedQuiz: data.has_completed_quiz
          });
        } else {
          // Fallback to separate queries if view doesn't return data
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('has_completed_quiz')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) throw profileError;

          const { data: hasAccess, error: accessError } = await supabase
            .rpc('user_has_access', { user_uuid: session.user.id });

          if (accessError) throw accessError;

          setStatus({
            isLoading: false,
            hasAccess: Boolean(hasAccess),
            subscriptionType: null,
            expiresAt: null,
            hasCompletedQuiz: profile?.has_completed_quiz || false
          });
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setStatus({
          isLoading: false,
          hasAccess: false,
          subscriptionType: null,
          expiresAt: null,
          hasCompletedQuiz: false
        });
      }
    };

    checkAccess();
  }, [session, supabase]);

  return status;
}
