import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import FeatureSection from "@/components/FeatureSection";
import UserDashboard from "@/components/UserDashboard";
import AuthUI from "@/components/AuthUI";

const Index = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFeatureClick = () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to access this feature",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white px-4 sm:px-6 py-4 sm:py-8">
      <Header />
      <FeatureSection onFeatureClick={handleFeatureClick} />
      
      {!session && !loading && (
        <div className="w-full max-w-md mx-auto animate-fade-in px-4 mb-8">
          <AuthUI />
        </div>
      )}

      {session && <UserDashboard />}
    </div>
  );
};

export default Index;