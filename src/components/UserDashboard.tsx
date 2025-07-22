import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Camera, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

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
    <div className="w-full max-w-md mx-auto animate-fade-in px-4 circuit-background relative">
      <div className="flex flex-col items-center space-y-8">
        <div className="w-full grid grid-cols-1 gap-4">
          {navigationButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <Button
                key={button.title}
                onClick={button.onClick}
                variant="outline"
                className="flex items-center justify-start p-6 h-auto w-full group relative overflow-hidden"
              >
                <div className="p-3 bg-primary rounded-xl mr-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col text-left">
                  <h3 className="text-body font-body text-foreground font-semibold">
                    {button.title}
                  </h3>
                  <p className="text-body-secondary font-body text-sm">
                    {button.subtitle}
                  </p>
                </div>
                <svg className="w-5 h-5 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            );
          })}
        </div>

        <h2 className="text-headline-sm font-display text-foreground mb-6 text-center">
          Welcome back!
        </h2>
        
        <Button
          onClick={handleSignOut}
          disabled={isSigningOut}
          variant="outline"
          size="full"
        >
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  );
};

export default UserDashboard;
