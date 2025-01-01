import { useEffect, Suspense } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthUI from '@/components/AuthUI';
import UserDashboard from '@/components/UserDashboard';
import Header from '@/components/Header';
import FeatureSection from '@/components/FeatureSection';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export default function Index() {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (session && location.state?.from) {
      navigate(location.state.from.pathname, { replace: true });
    }
  }, [session, navigate, location]);

  const handleFeatureClick = () => {
    if (!session) {
      return;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-background to-background -z-10" />
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        
        {session ? (
          <Suspense fallback={<LoadingSpinner />}>
            <UserDashboard />
          </Suspense>
        ) : (
          <div className="container mx-auto px-4">
            <div className="py-12 md:py-20">
              <Suspense fallback={<LoadingSpinner />}>
                <FeatureSection onFeatureClick={handleFeatureClick} />
                <div className="mt-12">
                  <AuthUI />
                </div>
              </Suspense>
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
}