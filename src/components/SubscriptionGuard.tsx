
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Environment variable to control subscription requirement
const REQUIRE_QUIZ_AND_SUBSCRIPTION = import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';

interface SubscriptionGuardProps {
  children: ReactNode;
  requireQuiz?: boolean;
  requireSubscription?: boolean;
}

const SubscriptionGuard = ({ 
  children, 
  requireQuiz = true,
  requireSubscription = true 
}: SubscriptionGuardProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const { isLoading, hasAccess, hasCompletedQuiz } = useSubscriptionStatus();
  const [isChecking, setIsChecking] = useState(true);

  // Add effect to check subscription status on mount and handle unauthorized users
  useEffect(() => {
    if (!session) {
      setIsChecking(false);
      return;
    }

    // Skip checks if not required by the environment flag
    if (!REQUIRE_QUIZ_AND_SUBSCRIPTION) {
      setIsChecking(false);
      return;
    }

    const checkUserAccess = async () => {
      try {
        // Only continue checks if we have valid data (not loading)
        if (!isLoading) {
          console.log("SubscriptionGuard access check:", { 
            hasAccess, 
            hasCompletedQuiz, 
            requireQuiz, 
            requireSubscription,
            userId: session.user.id,
            userEmail: session.user.email
          });
          
          // When a user is initially signing in, directly mark them as having completed the quiz
          // This is needed for Google OAuth users since their session exists before our normal flow completes
          if (requireQuiz && !hasCompletedQuiz) {
            console.log("User does not have completed quiz, attempting to mark it completed");
            
            try {
              // Attempt to mark the quiz as completed for this user
              const result = await supabase.functions.invoke('mark-quiz-completed', {
                body: { 
                  user_id: session.user.id,
                  email: session.user.email,
                  subscription_type: "annual" // Default to annual for Google OAuth users
                }
              });
              
              console.log("Auto mark quiz completed result:", result);
              
              if (result.error) {
                console.error("Error in auto-marking quiz:", result.error);
                toast.error("Please complete the quiz first to continue");
                navigate('/quiz', { replace: true });
                setIsChecking(false);
                return;
              }
              
              // Wait a moment for the database to update
              setTimeout(async () => {
                // Recheck access after marking quiz completed
                const { data } = await supabase
                  .from('user_access_view')
                  .select('*')
                  .eq('id', session.user.id)
                  .maybeSingle();
                
                console.log("After auto-mark, user access data:", data);
                
                if (data && data.has_completed_quiz && data.has_active_subscription) {
                  console.log("Access granted after auto-marking");
                  setIsChecking(false);
                } else {
                  console.log("Still no access after auto-marking");
                  toast.error("Please complete the quiz first to continue");
                  navigate('/quiz', { replace: true });
                  setIsChecking(false);
                }
              }, 1000);
            } catch (err) {
              console.error("Exception in auto-marking quiz:", err);
              toast.error("Please complete the quiz first to continue");
              navigate('/quiz', { replace: true });
              setIsChecking(false);
            }
          } else if (requireSubscription && !hasAccess) {
            console.log("User does not have active subscription");
            toast.error("This feature requires an active subscription");
            navigate('/quiz', { replace: true });
            setIsChecking(false);
          } else {
            // User has both quiz completion and subscription (or doesn't need them)
            console.log("User has required access, proceeding");
            setIsChecking(false);
          }
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setIsChecking(false);
      }
    };

    if (!isLoading) {
      checkUserAccess();
    }
  }, [session, isLoading, hasAccess, hasCompletedQuiz, navigate, requireQuiz, requireSubscription]);

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For development/testing, optionally bypass subscription checks
  if (!REQUIRE_QUIZ_AND_SUBSCRIPTION) {
    return <>{children}</>;
  }

  // Special case for Google OAuth users - allow access anyway and we'll auto-mark quiz as completed
  if (session.user?.app_metadata?.provider === 'google' && 
      requireQuiz && !hasCompletedQuiz && !isChecking) {
    console.log("Google user allowed access despite missing quiz completion");
    return <>{children}</>;
  }

  if (session.user?.app_metadata?.provider !== 'google') {
    // Only show the actual content if all requirements are met (non-Google users)
    if (requireQuiz && !hasCompletedQuiz) {
      return <Navigate to="/quiz" replace />;
    }

    if (requireSubscription && !hasAccess) {
      return <Navigate to="/quiz" replace />;
    }
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
