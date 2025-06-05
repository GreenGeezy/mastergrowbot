
import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase, safeDeleteUser, checkUserExists } from '@/integrations/supabase/client';
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
      
      // First check if the user exists to avoid unnecessary operations
      const { exists } = await checkUserExists(userId);
      
      if (!exists) {
        toast.info('User does not exist or was already deleted');
        setLoading(false);
        return;
      }
      
      // Use the improved safe delete user function
      const { success, error, warning } = await safeDeleteUser(userId);
      
      if (warning) {
        toast.info(warning);
        return;
      }
      
      if (!success) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user: ' + (error?.message || 'Unknown error'));
      } else {
        toast.success('User deleted successfully');
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
            
            {/* Testimonial Section */}
            <div className="mt-12 mb-8 text-center">
              <p className="text-lg text-white mb-6">
                Select a Plan and Subscribed with Square Checkout. Already Subscribed? Sign in at the Bottom of the Page
              </p>
              
              <div className="flex items-center gap-4 w-full max-w-4xl mx-auto justify-center">
                <img 
                  src="/lovable-uploads/61f42e0f-6e69-435b-b181-dc50cbb9b324.png"
                  className="flex-shrink-0" 
                  style={{
                    height: '160px',
                    backgroundColor: 'transparent',
                    filter: 'brightness(1.4) contrast(1.3) saturate(1.2) drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))'
                  }} 
                  alt="Cancel Anytime - Zero Fees" 
                />
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 flex-1 max-w-2xl">
                  <p className="text-white italic text-center text-lg font-extrabold">TESTIMONIAL: 
"Brilliant Technology! Master Growbot saved my new strain from dying, saving me thousands of dollars and time." – Dr. Sergio, Licensed Medical Practitioner & Grower</p>
                </div>
                <img 
                  className="flex-shrink-0" 
                  style={{
                    height: '160px',
                    backgroundColor: 'transparent',
                    filter: 'brightness(1.4) contrast(1.3) saturate(1.2) drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))'
                  }} 
                  alt="Trusted Seller" 
                  src="/lovable-uploads/72c8715f-f973-49a5-a653-cb3400fe9dd7.png" 
                />
              </div>
            </div>
            
            <div className="mt-12 flex flex-col items-center">
              <AuthUI />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
