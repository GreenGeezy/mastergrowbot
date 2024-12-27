import React from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Camera, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

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
      onClick: () => navigate("/guide"),
      icon: BookOpen,
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in px-4">
      <div className="flex flex-col items-center space-y-8">
        <div className="w-full grid grid-cols-1 gap-4">
          {navigationButtons.map((button) => {
            const Icon = button.icon;
            return (
              <button
                key={button.title}
                onClick={button.onClick}
                className="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#333333] border border-[#333333] hover:border-primary/50 w-full"
              >
                <div className="p-1.5 bg-gradient-to-r from-primary to-[#33C3F0] rounded-lg">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3 flex flex-col text-left">
                  <h3 className="font-medium text-sm text-white group-hover:text-[#33C3F0] transition-colors duration-300">
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
  );
};

export default UserDashboard;