
import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionGuardProps {
  children: ReactNode;
  requireQuiz?: boolean;
  requireSubscription?: boolean;
}

const SubscriptionGuard = ({ 
  children, 
  requireQuiz = false, // Always false by default - quiz completion not required
  requireSubscription = false // Always false by default - subscription not required
}: SubscriptionGuardProps) => {
  const session = useSession();
  const { isLoading, hasAccess, hasCompletedQuiz } = useSubscriptionStatus();

  // Check/create profile when session changes
  useEffect(() => {
    if (session?.user?.id) {
      // Ensure user profile exists and quiz is marked as completed
      async function ensureProfileComplete() {
        try {
          console.log('[SubscriptionGuard] Checking profile for user:', session.user.id);
          
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error('[SubscriptionGuard] Error checking profile:', profileError);
            return;
          }
          
          if (!profile) {
            console.log('[SubscriptionGuard] No profile found, creating one');
            
            // Create profile with quiz completed
            const { error: insertError } = await supabase.from('user_profiles').insert({
              id: session.user.id,
              username: session.user.email?.split('@')[0] || 'User',
              grow_experience_level: 'new',
              has_completed_quiz: true, // Always true
              goals: ['learn'],
              challenges: ['none'],
              nutrient_type: 'organic',
              growing_method: 'indoor',
              monitoring_method: 'manual'
            });
            
            if (insertError) {
              console.error('[SubscriptionGuard] Error creating profile:', insertError);
            } else {
              console.log('[SubscriptionGuard] Profile created successfully');
            }
          } else if (!profile.has_completed_quiz) {
            console.log('[SubscriptionGuard] Profile found but quiz not completed, updating');
            // Update profile to mark quiz as completed
            const { error: updateError } = await supabase
              .from('user_profiles')
              .update({ has_completed_quiz: true })
              .eq('id', session.user.id);
              
            if (updateError) {
              console.error('[SubscriptionGuard] Error updating profile:', updateError);
            } else {
              console.log('[SubscriptionGuard] Profile updated successfully');
            }
          } else {
            console.log('[SubscriptionGuard] Profile exists and quiz already completed');
          }
        } catch (error) {
          console.error('[SubscriptionGuard] Error ensuring profile:', error);
        }
      }
      
      ensureProfileComplete();
    }
  }, [session]);

  if (!session) {
    console.log('[SubscriptionGuard] No session, redirecting to home');
    
    // Save the current path to redirect back after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectTo', window.location.pathname);
    }
    
    toast.error("Please sign in to access this feature");
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Always allow access regardless of quiz or subscription status
  return <>{children}</>;
};

export default SubscriptionGuard;
