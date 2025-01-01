import { useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthUI from '@/components/AuthUI';
import UserDashboard from '@/components/UserDashboard';
import Header from '@/components/Header';
import FeatureSection from '@/components/FeatureSection';

export default function Index() {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to the intended page after login if there was one
    if (session && location.state?.from) {
      navigate(location.state.from.pathname, { replace: true });
    }
  }, [session, navigate, location]);

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-background to-background -z-10" />
      <Header />
      
      {session ? (
        <UserDashboard />
      ) : (
        <div className="container mx-auto px-4">
          <div className="py-12 md:py-20">
            <FeatureSection onFeatureClick={() => {
              if (!session) {
                return;
              }
            }} />
            <div className="mt-12">
              <AuthUI />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}