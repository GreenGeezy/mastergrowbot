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
    <div className="min-h-screen bg-gradient-to-b from-background to-[#1F1F1F] text-white px-4 sm:px-6 py-6 sm:py-12">
      {/* Header Section with enhanced mobile styling */}
      <div className="w-full flex flex-col items-center mb-8 sm:mb-16 animate-fade-in">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-background/90 p-4 sm:p-8 rounded-full mb-4 sm:mb-6 backdrop-blur-sm ring-1 ring-white/10 hover:ring-white/30 transition-all duration-300">
            <img 
              src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
              alt="Master Growbot Logo" 
              className="w-24 h-24 sm:w-32 sm:h-32 transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-fade-in px-2">
          Master Growbot
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 text-center max-w-2xl leading-relaxed mb-6 sm:mb-8 animate-fade-in px-4">
          Grow Bigger and Grow Better with your personal AI powered Cannabis Growing Genius Friend!
        </p>
      </div>

      {/* Feature Cards Section with improved mobile layout */}
      <div className="w-full max-w-6xl mx-auto mb-8 sm:mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4">
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

      {/* Bottom Section with mobile-friendly spacing */}
      {isLoggedIn ? (
        <div className="w-full max-w-md mx-auto animate-fade-in px-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center">Recent Activity</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 ring-1 ring-white/10 hover:ring-white/30 transition-all duration-300">
              <p className="text-gray-300">Last health scan: Healthy</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 ring-1 ring-white/10 hover:ring-white/30 transition-all duration-300">
              <p className="text-gray-300">Last chat: Nutrient schedule</p>
              <p className="text-sm text-gray-500">Yesterday</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto flex flex-col items-center animate-fade-in px-4">
          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white mb-3 sm:mb-4 h-10 sm:h-12 text-base sm:text-lg font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
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