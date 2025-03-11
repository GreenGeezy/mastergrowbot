
import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import AuthUI from '@/components/AuthUI';
import UserDashboard from '@/components/UserDashboard';
import Header from '@/components/Header';
import FeatureSection from '@/components/FeatureSection';

export default function Index() {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Handle redirects from authentication flow
  useEffect(() => {
    if (session && location.state?.from) {
      navigate(location.state.from.pathname, { replace: true });
    }
    
    // Handle payment success redirect if needed
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get('payment_success');
    
    if (paymentSuccess === 'true') {
      toast.success('Payment processed successfully!');
      // Clean up URL parameters
      navigate('/', { replace: true });
    }
  }, [session, navigate, location]);

  const handleFeatureClick = () => {
    if (!session) {
      return;
    }
  };

  // Admin function to delete test users (should be removed in production)
  const deleteTestUser = async (userId) => {
    if (!session) {
      toast.error('You must be logged in as an admin to perform this action');
      return;
    }

    try {
      setLoading(true);
      
      // First check if current user is admin (in a real app)
      // For simplicity, we're just showing how this would work
      
      // Call the safely_delete_user function via RPC
      const { data, error } = await supabase.rpc('safely_delete_user', {
        user_id_to_delete: userId
      });
      
      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user: ' + error.message);
      } else {
        toast.success('User deleted successfully');
        console.log('User deletion response:', data);
      }
    } catch (err) {
      console.error('Exception when deleting user:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-background to-background -z-10" />
      <Header />
      
      {session ? (
        <UserDashboard />
      ) : (
        <div className="container mx-auto px-4">
          <div className="py-6 md:py-10">
            <FeatureSection onFeatureClick={handleFeatureClick} />
            <div className="mt-12 flex flex-col items-center">
              <AuthUI />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
