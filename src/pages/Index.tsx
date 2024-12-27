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
    // Only redirect if there's a specific destination stored in location state
    if (session && location.state?.from) {
      navigate(location.state.from.pathname, { replace: true });
    }
  }, [session, navigate, location]);

  const handleFeatureClick = () => {
    // This ensures FeatureSection has the required prop
    if (!session) {
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      <Header />
      
      {session ? (
        <UserDashboard />
      ) : (
        <div className="container mx-auto px-4">
          <div className="py-12 md:py-20">
            <FeatureSection onFeatureClick={handleFeatureClick} />
            <div className="mt-12">
              <AuthUI />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}