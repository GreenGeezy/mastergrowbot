
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useHapticFeedback } from "@/utils/hapticFeedback";
import { Camera, MessageCircle, BookOpen, Settings, Home } from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const haptic = useHapticFeedback();

  // Navigation items configuration - prioritized for conversion
  const navigationItems = [
    {
      title: "Plant Health",
      subtitle: "Scan & Diagnose", 
      to: "/plant-health",
      icon: Camera,
      label: "Health"
    },
    {
      title: "Home",
      subtitle: "Dashboard",
      to: "/",
      icon: Home,
      label: "Home"
    },
    {
      title: "AI Chat",
      subtitle: "Growing Assistant",
      to: "/chat",
      icon: MessageCircle,
      label: "Chat"
    },
    {
      title: "Growing Guide",
      subtitle: "Expert Tips",
      to: "/grow-guide", 
      icon: BookOpen,
      label: "Guide"
    },
    {
      title: "Settings",
      subtitle: "Account & Profile",
      to: "/settings",
      icon: Settings,
      label: "Settings"
    }
  ];

  return (
    <nav 
      data-testid="bottom-navigation" 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-card safe-area-pb"
      style={{ height: '60px', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="px-4 py-2 h-full">
        <div className="flex justify-between items-center max-w-md mx-auto h-full">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <button
                key={item.to}
                onClick={() => {
                  haptic.light();
                  if (item.to === '/plant-health') {
                    // Trigger camera capture event for Plant Health priority
                    window.dispatchEvent(new CustomEvent('trigger-camera-capture'));
                  }
                  navigate(item.to);
                }}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 interactive-element min-w-[48px] h-12 ${
                  isActive 
                    ? 'bg-primary/10 transform scale-105' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <IconComponent
                  className={`w-7 h-7 mb-1 transition-all duration-200 ${
                    isActive 
                      ? 'text-primary fill-primary stroke-2 drop-shadow-sm' 
                      : 'text-muted-foreground stroke-2'
                  }`}
                  style={{
                    filter: isActive 
                      ? 'drop-shadow(0 1px 2px rgba(229, 231, 235, 0.5)) drop-shadow(0 0 8px rgba(34, 197, 94, 0.2))' 
                      : 'drop-shadow(0 1px 2px rgba(229, 231, 235, 0.5))'
                  }}
                  fill={isActive ? 'currentColor' : 'none'}
                />
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground'
                } font-sans`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
