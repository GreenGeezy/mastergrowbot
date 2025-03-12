
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { toast } from 'sonner';

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
  const { isLoading, hasAccess, hasCompletedQuiz } = useSubscriptionStatus();

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

  if (requireQuiz && !hasCompletedQuiz) {
    toast.error("Please complete the quiz first");
    return <Navigate to="/quiz" replace />;
  }

  if (requireSubscription && !hasAccess) {
    toast.error("This feature requires an active subscription");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
