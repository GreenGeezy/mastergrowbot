
"use client";

import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, Camera, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationTabs = [
  {
    id: 0,
    label: "Chat",
    route: "/chat",
    icon: MessageCircle,
  },
  {
    id: 1,
    label: "Plant Health",
    route: "/plant-health",
    icon: Camera,
  },
  {
    id: 2,
    label: "Guide",
    route: "/grow-guide",
    icon: BookOpen,
  },
];

function MobileNavigation({ className }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const currentRoute = location.pathname;
    const foundTab = navigationTabs.find(tab => tab.route === currentRoute);
    return foundTab ? foundTab.id : 0;
  });

  useEffect(() => {
    const currentRoute = location.pathname;
    const foundTab = navigationTabs.find(tab => tab.route === currentRoute);
    if (foundTab && foundTab.id !== activeTab) {
      setActiveTab(foundTab.id);
    }
  }, [location.pathname, activeTab]);

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab) {
      setActiveTab(newTabId);
      const selectedTab = navigationTabs[newTabId];
      navigate(selectedTab.route);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className={cn("flex space-x-8 rounded-full bg-card/80 backdrop-blur-md px-6 py-3 border border-accent/20", className)}>
        {navigationTabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileTap="tapped"
              whileHover="hovered"
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "relative px-3 py-2 tracking-[0.01em] cursor-pointer transition focus-visible:outline-1 focus-visible:ring-1 focus-visible:outline-none flex flex-col gap-1 items-center",
                activeTab === tab.id
                  ? "text-accent font-medium tracking-normal"
                  : "text-gray-400 hover:text-gray-200"
              )}
              style={{ 
                WebkitTapHighlightColor: "transparent", 
                minHeight: "44px", 
                minWidth: "44px" 
              }}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="mobile-nav-bubble"
                  className="absolute inset-0 bg-accent/10 rounded-lg"
                  transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
                />
              )}
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  transition: {
                    type: "spring",
                    bounce: 0.2,
                    damping: 7,
                    duration: 0.4,
                    delay: index * 0.1,
                  },
                }}
                variants={{
                  default: { scale: 1 },
                  ...(!(activeTab === tab.id) && { hovered: { scale: 1.1 } }),
                  ...(!(activeTab === tab.id) && {
                    tapped: {
                      scale: 0.8,
                      transition: {
                        type: "spring",
                        bounce: 0.2,
                        damping: 7,
                        duration: 0.4,
                      },
                    },
                  }),
                }}
                className="relative z-10"
                transition={{ type: "spring" }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
              <span className="text-xs font-medium relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export { MobileNavigation };
