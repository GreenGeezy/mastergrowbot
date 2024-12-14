import { MessageCircle, Camera, BookOpen } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const isLoggedIn = false; // This would come from your auth state

  const handleFeatureClick = () => {
    if (!isLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to access this feature",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[#1F1F1F] text-white p-6">
      {/* Header Section with enhanced styling */}
      <div className="w-full flex flex-col items-center mb-16 animate-fade-in">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-background/90 p-8 rounded-full mb-6 backdrop-blur-sm ring-1 ring-white/10 hover:ring-white/30 transition-all duration-300">
            <img 
              src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
              alt="Master Growbot Logo" 
              className="w-32 h-32 transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-fade-in">
          Master Growbot
        </h1>
        <p className="text-xl text-gray-300 text-center max-w-2xl leading-relaxed mb-8 animate-fade-in">
          Grow Bigger and Grow Better with your personal AI powered Cannabis Growing Assistant!
        </p>
      </div>

      {/* Feature Cards Section with enhanced styling */}
      <div className="w-full max-w-6xl mx-auto mb-16 flex flex-col sm:flex-row gap-6 justify-center items-stretch px-4">
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

      {/* Bottom Section with enhanced styling */}
      {isLoggedIn ? (
        <div className="w-full max-w-md mx-auto animate-fade-in">
          <h2 className="text-2xl font-semibold mb-6 text-center">Recent Activity</h2>
          <div className="space-y-4">
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 ring-1 ring-white/10 hover:ring-white/30 transition-all duration-300">
              <p className="text-gray-300">Last health scan: Healthy</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 ring-1 ring-white/10 hover:ring-white/30 transition-all duration-300">
              <p className="text-gray-300">Last chat: Nutrient schedule</p>
              <p className="text-sm text-gray-500">Yesterday</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto flex flex-col items-center animate-fade-in">
          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white mb-4 h-12 text-lg font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            size="lg"
          >
            Sign Up
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-300"
          >
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;