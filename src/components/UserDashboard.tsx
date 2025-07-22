import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Camera, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const isMobile = useIsMobile();

  const navigationButtons = [
    {
      title: "Growing Assistant",
      subtitle: "Get expert growing advice",
      icon: MessageCircle,
      onClick: () => navigate("/chat"),
    },
    {
      title: "Plant Health Check",
      subtitle: "Diagnose plant issues",
      onClick: () => navigate("/plant-health"),
      icon: Camera,
    },
    {
      title: "Growing Guide",
      subtitle: "Quick answers to FAQs",
      onClick: () => navigate("/grow-guide"),
      icon: BookOpen,
    },
  ];

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
        toast.error("Sign out failed. Please try again.");
      } else {
        // Successfully signed out
        toast.success("Successfully signed out");
        // Navigation will happen automatically due to auth state change
      }
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto animate-fade-in relative ${isMobile ? 'px-4 py-6' : 'px-8 py-8'}`}>
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 p-6 sm:p-8">
        {/* Dashboard Header */}
        <div className="text-center mb-8">
          <h1 className={`font-bold text-gray-900 mb-4 ${isMobile ? 'text-2xl sm:text-3xl' : 'text-4xl'}`}>
            Welcome to Master Growbot
          </h1>
          <p className={`text-gray-600 leading-relaxed px-2 ${isMobile ? 'text-sm sm:text-base' : 'text-lg'}`}>
            Your AI-powered cannabis cultivation assistant is ready to help
          </p>
        </div>

        {/* Navigation Cards */}
        <div className={`grid gap-6 mb-8 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
          {navigationButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <div key={index} className="group relative">
                <Button
                  onClick={button.onClick}
                  className="w-full h-auto text-left bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 hover:border-green-300 transition-all duration-300 group-hover:scale-105 p-6"
                  variant="ghost"
                >
                  <div className="flex flex-col items-center text-center">
                    <IconComponent className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-green-600 mb-4`} />
                    <h3 className={`font-bold text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                      {button.title}
                    </h3>
                    <p className={`text-gray-600 leading-relaxed ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {button.subtitle}
                    </p>
                  </div>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Sign Out Button */}
        <div className="text-center pt-6 border-t border-gray-200">
          <Button
            onClick={handleSignOut}
            disabled={isSigningOut}
            variant="outline"
            className={`text-gray-600 hover:text-red-600 border-gray-300 hover:border-red-300 ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'}`}
          >
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;