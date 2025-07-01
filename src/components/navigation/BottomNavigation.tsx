import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, Camera, BookOpen, Settings } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";

const BottomNavigation = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't render anything on mobile devices
  if (isMobile) {
    return null;
  }

  // Navigation items for bottom tabs
  const navigationItems = [
    {
      title: "Growing Assistant",
      to: "/chat",
      icon: MessageCircle,
    },
    {
      title: "Plant Health Check",
      to: "/plant-health", 
      icon: Camera,
    },
    {
      title: "Growing Guide",
      to: "/grow-guide",
      icon: BookOpen,
    },
    {
      title: "Settings",
      to: "/profile",
      icon: Settings,
    },
  ];

  // Handle bottom navigation tab changes
  const handleTabChange = (index: number | null) => {
    if (index !== null && navigationItems[index]) {
      navigate(navigationItems[index].to);
    }
  };

  const getActiveTabIndex = () => {
    const activeIndex = navigationItems.findIndex(item => location.pathname === item.to);
    return activeIndex >= 0 ? activeIndex : null;
  };

  // Create tabs for ExpandableTabs component
  const tabs = navigationItems.map((item) => ({
    title: item.title,
    icon: item.icon,
    type: "tab" as const,
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-white/10 md:hidden lg:hidden">
      <div className="flex justify-center p-4">
        <ExpandableTabs 
          tabs={tabs}
          className="flex-row gap-2 bg-black/50 border-white/20 p-2"
          activeColor="text-accent"
          onChange={handleTabChange}
        />
      </div>
    </div>
  );
};

export default BottomNavigation;
