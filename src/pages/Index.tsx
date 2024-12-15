import { MessageCircle, Camera, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import FeatureCard from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AuthUI from "@/components/AuthUI";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

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
      {/* Header Section - Reduced vertical spacing */}
      <div className="w-full flex flex-col items-center mb-6 sm:mb-10 animate-fade-in">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-[#33C3F0] to-secondary rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-[#1A1A1A]/90 p-4 sm:p-6 rounded-full mb-4 sm:mb-6 backdrop-blur-xl ring-1 ring-white/10 hover:ring-[#33C3F0]/30 transition-all duration-500">
            <img 
              src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
              alt="Master Growbot Logo" 
              className="w-20 h-20 sm:w-28 sm:h-28 transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#33C3F0] to-secondary animate-fade-in px-2 tracking-tight">
          Master Growbot
        </h1>
        <p className="text-base sm:text-lg text-[#8B5CF6] text-center max-w-2xl leading-relaxed mb-4 sm:mb-6 animate-fade-in px-4 font-light">
          Grow Bigger and Grow Better with your personal AI powered Cannabis Growing Genius Friend!
        </p>
      </div>

      {/* Feature Cards Section - Moved up */}
      <div className="w-full max-w-6xl mx-auto mb-8 sm:mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4">
        <FeatureCard
          icon={MessageCircle}
          title="Growing Assistant"
          subtitle="Get expert growing advice"
          onClick={handleFeatureClick}
        />
        <FeatureCard
          icon={Camera}
          title="Plant Health Check"
          subtitle="Diagnose plant issues"
          onClick={handleFeatureClick}
        />
        <FeatureCard
          icon={BookOpen}
          title="Growing Guide"
          subtitle="Quick answers to FAQs"
          onClick={handleFeatureClick}
        />
      </div>

      {/* Auth Section - Moved up */}
      {!session && !loading && (
        <div className="w-full max-w-md mx-auto animate-fade-in px-4 mb-8">
          <AuthUI />
        </div>
      )}

      {/* User Dashboard Section */}
      {session && (
        <div className="w-full max-w-md mx-auto animate-fade-in px-4">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#33C3F0]">
              Welcome back!
            </h2>
            <Button
              onClick={() => supabase.auth.signOut()}
              className="bg-gradient-to-r from-primary to-[#33C3F0] hover:opacity-90 text-white font-medium px-8 py-2 rounded-lg transform hover:scale-105 transition-all duration-300"
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
