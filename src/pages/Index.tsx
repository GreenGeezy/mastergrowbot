import { useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthUI from '@/components/AuthUI';
import UserDashboard from '@/components/UserDashboard';
import Header from '@/components/Header';
import FeatureSection from '@/components/FeatureSection';
import EmailTester from '@/components/EmailTester';

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
      
      {/* Add Email Tester section - you can place this wherever it fits best in your layout */}
      <div className="py-10 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Test Email Functionality</h2>
        <EmailTester />
      </div>
    </div>
  );
}
