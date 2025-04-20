
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { toast } from 'sonner';

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
            requireSubscription 
          });
          
          if (requireQuiz && !hasCompletedQuiz) {
            toast.error("Please complete the quiz first to continue");
            navigate('/quiz', { replace: true });
          } else if (requireSubscription && !hasAccess) {
            toast.error("This feature requires an active subscription");
            navigate('/quiz', { replace: true });
          }
          
          setIsChecking(false);
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

  // Only show the actual content if all requirements are met
  if (requireQuiz && !hasCompletedQuiz) {
    return <Navigate to="/quiz" replace />;
  }

  if (requireSubscription && !hasAccess) {
    return <Navigate to="/quiz" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
