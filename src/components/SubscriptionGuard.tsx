
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isIOSPreview } from '@/utils/flags';

interface SubscriptionGuardProps {
  children: ReactNode;
}

const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  // Skip all subscription checks in iOS preview mode
  if (isIOSPreview) return <>{children ?? null}</>;
  
  const session = useSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  // Check subscription status on mount
  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    const checkSubscriptionStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('subscription_status')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error checking subscription status:', error);
          setHasActiveSubscription(false);
        } else {
          const isActive = data?.subscription_status === 'active';
          
          // Special case for test user
          const isTestUser = session.user.id === '48f51ffd-7e63-4ee8-8789-0be75018ea01';
          setHasActiveSubscription(isActive || isTestUser);
          
          if (!isActive && !isTestUser) {
            toast.error('Your subscription is not active yet. Please complete purchase first.');
            navigate('/quiz', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setHasActiveSubscription(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [session, navigate]);

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return <Navigate to="/quiz" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
