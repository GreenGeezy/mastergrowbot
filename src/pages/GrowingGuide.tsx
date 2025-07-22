import { useState } from "react";
import { Search, ArrowLeft, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GuideCategories from "@/components/guide/GuideCategories";
import { useNavigate } from "react-router-dom";
import SupportDialog from "@/components/support/SupportDialog";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Particles } from '@/components/ui/particles';
const GrowingGuide = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSupport, setShowSupport] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  return <div className="min-h-screen bg-white text-gray-900 pb-20">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0"
        quantity={25}
        ease={80}
        color="#22c55e"
        size={5}
        refresh
      />
      
      <div className="absolute inset-0 bg-gradient-radial from-green-100/20 via-white to-white -z-10" />
      
      {/* Decorative accent lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[10%] left-[-10%] w-[120%] h-[1px] bg-green-200 transform rotate-[15deg]" />
          <div className="absolute top-[30%] left-[-10%] w-[120%] h-[1px] bg-green-200 transform rotate-[-10deg]" />
          <div className="absolute top-[50%] left-[-10%] w-[120%] h-[1px] bg-green-200 transform rotate-[5deg]" />
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-headline font-display text-foreground text-center mb-4">
            Growing Guide & FAQ
          </h1>
          <p className="text-body-secondary max-w-2xl mx-auto text-center">
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
              onChange={e => setSearchQuery(e.target.value)} 
              data-testid="search-input" 
              className="w-full bg-gray-50 border-gray-300 text-foreground placeholder:text-muted-foreground h-12 pl-12 rounded-xl" 
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5" />
          </div>
        </div>

        {/* Guide Categories */}
        <GuideCategories searchQuery={searchQuery} />
      </main>

      {/* Support Dialog */}
      <SupportDialog isOpen={showSupport} onOpenChange={setShowSupport} />

      {/* Bottom Navigation - show on all devices */}
      <BottomNavigation />
    </div>;
};
export default GrowingGuide;