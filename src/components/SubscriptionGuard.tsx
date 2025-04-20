
import { ReactNode, useEffect } from 'react';
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

  // Add effect to check subscription status on mount and handle unauthorized users
  useEffect(() => {
    if (!session) {
      return;
    }

    // Skip checks if not required by the environment flag
    if (!REQUIRE_QUIZ_AND_SUBSCRIPTION) {
      return;
    }

    const checkUserAccess = async () => {
      // If loaded and no subscription when required, sign them out
      if (!isLoading && requireSubscription && !hasAccess) {
        toast.error("You need an active subscription to use this feature");
        await supabase.auth.signOut();
        navigate('/quiz', { replace: true });
        return;
      }

      // If loaded and no quiz when required, redirect to quiz
      if (!isLoading && requireQuiz && !hasCompletedQuiz) {
        toast.error("Please complete the quiz first to continue");
        navigate('/quiz', { replace: true });
        return;
      }
    };

    checkUserAccess();
  }, [session, isLoading, hasAccess, hasCompletedQuiz, navigate, requireQuiz, requireSubscription]);

  if (!session) {
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

  // Only show the actual content if all requirements are met
  if (REQUIRE_QUIZ_AND_SUBSCRIPTION) {
    if (requireQuiz && !hasCompletedQuiz) {
      toast.error("Please complete the quiz first");
      return <Navigate to="/quiz" replace />;
    }

    if (requireSubscription && !hasAccess) {
      toast.error("This feature requires an active subscription");
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
