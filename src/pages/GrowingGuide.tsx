import { useState } from "react";
import { Search, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GuideCategories from "@/components/guide/GuideCategories";
import { useNavigate } from "react-router-dom";
import SupportDialog from "@/components/support/SupportDialog";

const GrowingGuide = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSupport, setShowSupport] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E1E2E] to-[#2D5A27] text-white relative overflow-x-hidden">
      {/* Decorative accent lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[10%] left-[-10%] w-[120%] h-[1px] bg-[#FF69B4] transform rotate-[15deg]" />
          <div className="absolute top-[30%] left-[-10%] w-[120%] h-[1px] bg-[#FF69B4] transform rotate-[-10deg]" />
          <div className="absolute top-[50%] left-[-10%] w-[120%] h-[1px] bg-[#FF69B4] transform rotate-[5deg]" />
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-[#FF69B4]/20 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img
                src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png"
                alt="Master Growbot Logo"
                className="w-8 h-8"
              />
              <h1 className="text-xl font-medium hidden sm:block">Growing Guide</h1>
            </div>
          </div>
          <Button 
            variant="secondary" 
            className="bg-[#2D243B] hover:bg-[#3D344B]"
            onClick={() => setShowSupport(true)}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Get Support
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
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
              className="w-full bg-[#2D243B] border-[#FF69B4]/20 text-white placeholder:text-gray-400 h-12 pl-12 rounded-xl"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Guide Categories */}
        <GuideCategories searchQuery={searchQuery} />

        {/* Support Dialog */}
        <SupportDialog isOpen={showSupport} onOpenChange={setShowSupport} />
      </main>
    </div>
  );
};

export default GrowingGuide;