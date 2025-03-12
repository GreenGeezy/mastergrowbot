
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
    <div className="w-full max-w-md mx-auto animate-fade-in px-4 circuit-background">
      <div className="flex flex-col items-center space-y-8">
        <div className="w-full grid grid-cols-1 gap-4">
          {navigationButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={button.title}
                onClick={button.onClick}
                className="card flex items-center p-4 rounded-lg cursor-pointer w-full group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-2 bg-gradient-primary group-hover:bg-gradient-secondary rounded-lg glow-primary group-hover:glow-accent transition-all duration-300">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="ml-4 flex flex-col text-left">
                  <h3 className="font-medium text-sm text-white group-hover:text-accent transition-colors duration-300 tech-font">
                    {button.title}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {button.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-glow via-accent to-secondary-glow tech-font">
          Welcome back!
        </h2>
        
        <Button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="cyber-button w-full glow-accent"
        >
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  );
};

export default UserDashboard;
