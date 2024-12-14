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
    <div className="min-h-screen bg-background text-white p-6 flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full flex flex-col items-center mb-12 animate-fade-in">
        <div className="bg-primary/20 p-6 rounded-full mb-4">
          <img 
            src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
            alt="Master Growbot Logo" 
            className="w-20 h-20"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">Master Growbot</h1>
        <p className="text-gray-400 text-center max-w-md">
          Grow Bigger and Grow Better with your personal AI powered Cannabis Growing Assistant!
        </p>
      </div>

      {/* Feature Cards Section */}
      <div className="w-full max-w-5xl mb-8 flex flex-col sm:flex-row gap-4 justify-center items-stretch">
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

      {/* Bottom Section */}
      {isLoggedIn ? (
        <div className="w-full max-w-md animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-card rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400">Last health scan: Healthy</p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
          <div className="bg-card rounded-lg p-4">
            <p className="text-sm text-gray-400">Last chat: Nutrient schedule</p>
            <p className="text-xs text-gray-500">Yesterday</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col items-center animate-fade-in">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white mb-4"
            size="lg"
          >
            Sign Up
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;