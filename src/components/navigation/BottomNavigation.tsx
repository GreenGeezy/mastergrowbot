
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, Camera, BookOpen, Settings } from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items for bottom tabs
  const navigationItems = [
    {
      title: "Growing Assistant",
      subtitle: "Get expert growing advice",
      to: "/chat",
      icon: MessageCircle,
    },
    {
      title: "Plant Health Check",
      subtitle: "Diagnose plant issues", 
      to: "/plant-health",
      icon: Camera,
    },
    {
      title: "Growing Guide",
      subtitle: "Quick answers to FAQs",
      to: "/grow-guide",
      icon: BookOpen,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-white/10">
      <div className="flex justify-center p-4">
        <div className="flex gap-4 w-full max-w-md items-center">
          {/* Logo button to navigate home */}
          <button
            onClick={() => navigate('/')}
            className="flex-shrink-0 p-3 rounded-xl transition-all duration-200 hover:bg-card/70"
          >
            <img
              src="/lovable-uploads/f3f24387-a344-47bd-b46b-d5996b6c9afd.png"
              alt="Master Growbot Logo"
              className="w-8 h-8"
            />
          </button>
          
          {/* Navigation items */}
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`flex-1 flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'bg-card/50 hover:bg-card/70 text-gray-300 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{
                  item.title === "Growing Assistant" ? "Chat" :
                  item.title === "Plant Health Check" ? "Plant Health" :
                  "Guide"
                }</span>
              </button>
            );
          })}

          {/* Settings gear icon */}
          <button
            onClick={() => navigate('/settings')}
            className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
              location.pathname === '/settings'
                ? 'bg-primary text-white' 
                : 'bg-card/50 hover:bg-card/70 text-gray-300 hover:text-white'
            }`}
          >
            <Settings className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
