import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import UserDashboard from "@/components/UserDashboard";
import AuthUI from "@/components/AuthUI";
import ChatInterface from "@/components/ChatInterface";
import { useNavigate, useLocation } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      
      // If we have a session and we're on the callback route, redirect to home
      if (session && (location.pathname.includes('/auth/callback') || location.hash)) {
        navigate('/', { replace: true });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      // If we have a session and we're on the callback route, redirect to home
      if (session && (location.pathname.includes('/auth/callback') || location.hash)) {
        navigate('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  const handleFeatureClick = () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to access this feature",
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white px-4 sm:px-6 py-4 sm:py-8">
      <Header />
      
      {!session && !loading && (
        <div className="w-full max-w-md mx-auto animate-fade-in px-4 mb-8">
          <AuthUI />
        </div>
      )}

      {session && (
        <div className="mt-8">
          <ChatInterface />
        </div>
      )}

      {session && <UserDashboard />}
    </div>
  );
};

export default Index;
