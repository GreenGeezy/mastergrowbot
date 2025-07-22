
import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase, safeDeleteUser, checkUserExists } from '@/integrations/supabase/client';
import { isIOSPreview } from '@/utils/flags';
import AuthUI from '@/components/AuthUI';
import UserDashboard from '@/components/UserDashboard';
import Header from '@/components/Header';
import FeatureSection from '@/components/FeatureSection';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import { SparklesCore } from '@/components/ui/sparkles';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Index() {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  
  // Check if we're in iOS preview mode
  const isIOSPreviewMode = isIOSPreview;
  
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
    if (!session && !isIOSPreviewMode) {
      return;
    }
  };

  // Admin function to delete test users (should be removed in production)
  const deleteTestUser = async (userId) => {
    if (!session && !isIOSPreviewMode) {
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

  // If in iOS preview mode, show UserDashboard directly
  if (isIOSPreviewMode) {
    return (
      <AuroraBackground className="min-h-screen">
        <div className="relative z-10 w-full">
          <Header />
          <UserDashboard />
        </div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground className="min-h-screen flex flex-col">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        {session ? (
          <UserDashboard />
        ) : (
          <div className="flex flex-col flex-1 pb-20">
            {/* Testimonials Section - Right after Header */}
            <div className="container mx-auto px-4 py-4">
              <TestimonialCarousel />
            </div>
            
            {/* Main content area */}
            <div className="flex-1 container mx-auto px-4 flex flex-col justify-center">
              <div className="py-6 md:py-10 flex flex-col items-center justify-center min-h-[60vh]">
                <AuthUI>
                  <div></div>
                </AuthUI>
              </div>
            </div>
          </div>
        )}
        
        {/* Benefits section - show on all devices for both signed-in and signed-out users */}
        <div className="bg-white/95 backdrop-blur-sm py-6 safe-area-pb">
          <FeatureSection onFeatureClick={handleFeatureClick} />
        </div>
      </div>
      
      {/* Bottom Navigation - show on all devices */}
      <BottomNavigation />
    </AuroraBackground>
  );
}
