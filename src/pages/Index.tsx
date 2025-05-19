
import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase, safeDeleteUser, checkUserExists } from '@/integrations/supabase/client';
import AuthUI from '@/components/AuthUI';
import UserDashboard from '@/components/UserDashboard';
import Header from '@/components/Header';
import FeatureSection from '@/components/FeatureSection';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export default function Index() {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);
  
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

  // Listen for plant-health button click from the Header component
  useEffect(() => {
    const handlePlantHealthClick = () => {
      if (!session) {
        setShowAuthDrawer(true);
        return;
      }
    };

    // Clean up event listener
    return () => {
      // Any cleanup if needed
    };
  }, [session]);

  const handleFeatureClick = () => {
    if (!session) {
      setShowAuthDrawer(true);
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
            
            {/* Hidden auth drawer that appears when user clicks CTA */}
            <Drawer open={showAuthDrawer} onOpenChange={setShowAuthDrawer}>
              <DrawerContent className="max-h-[85vh]">
                <div className="px-4 py-6">
                  <h3 className="text-xl font-semibold mb-4 text-center">Sign in to continue</h3>
                  <AuthUI />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      )}
    </div>
  );
}
