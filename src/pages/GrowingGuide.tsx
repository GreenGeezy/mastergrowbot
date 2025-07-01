import { useState } from "react";
import { Search, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GuideCategories from "@/components/guide/GuideCategories";
import { useNavigate } from "react-router-dom";
import SupportDialog from "@/components/support/SupportDialog";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { SparklesCore } from '@/components/ui/sparkles';

const GrowingGuide = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSupport, setShowSupport] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background text-white pb-20 relative">
      {/* Sparkles Background */}
      <div className="fixed inset-0 w-full h-full">
        <SparklesCore
          id="guide-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#36d399"
          speed={0.8}
        />
      </div>

      {/* Existing gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-background to-background -z-10" />
      
      {/* Decorative accent lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[10%] left-[-10%] w-[120%] h-[1px] bg-accent transform rotate-[15deg]" />
          <div className="absolute top-[30%] left-[-10%] w-[120%] h-[1px] bg-accent transform rotate-[-10deg]" />
          <div className="absolute top-[50%] left-[-10%] w-[120%] h-[1px] bg-accent transform rotate-[5deg]" />
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-8 pb-16 px-4 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Growing Guide & FAQ
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions and learn expert growing techniques
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12 animate-fade-in">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search guides and growing help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border-accent/20 text-white placeholder:text-gray-400 h-12 pl-12 rounded-xl"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Guide Categories */}
        <GuideCategories searchQuery={searchQuery} />

        {/* Feedback Button */}
        <div className="flex justify-center mt-8">
          <Button 
            variant="secondary" 
            className="bg-gradient-secondary hover:opacity-90"
            onClick={() => setShowSupport(true)}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Share Feedback
          </Button>
        </div>
      </main>

      {/* Support Dialog */}
      <SupportDialog 
        isOpen={showSupport} 
        onOpenChange={setShowSupport} 
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default GrowingGuide;
