
import React from "react";
import { MessageCircle, Camera, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FeatureSectionProps {
  onFeatureClick: () => void;
}

const featureTabs = [
  {
    id: 0,
    label: "Growing Assistant",
    subtitle: "Get expert growing advice",
    to: "/chat",
    icon: MessageCircle,
  },
  {
    id: 1,
    label: "Plant Health Check", 
    subtitle: "Diagnose plant issues",
    to: "/plant-health",
    icon: Camera,
  },
  {
    id: 2,
    label: "Growing Guide",
    subtitle: "Quick answers to FAQs", 
    to: "/grow-guide",
    icon: BookOpen,
  },
];

const FeatureSection = React.memo(({ onFeatureClick }: FeatureSectionProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabClicked, setTabClicked] = useState(false);

  const handleTabClick = (newTabId: number) => {
    setTabClicked(true);
    if (newTabId !== activeTab) {
      setActiveTab(newTabId);
    }
  };

  return (
    <div className="w-full max-w-screen-md mx-auto px-4">
      <div className="flex flex-col items-center w-full">
        <div className={cn("flex flex-col xs:flex-row xs:space-x-4 space-y-4 xs:space-y-0 rounded-full w-full justify-center")}>
          {featureTabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <Link 
                key={tab.id}
                to={tab.to}
                onClick={() => {
                  handleTabClick(tab.id);
                  onFeatureClick();
                }}
                style={{ textDecoration: "none", display: "block" }}
                className="flex-1 xs:flex-initial"
              >
                <motion.button
                  whileTap="tapped"
                  whileHover="hovered"
                  className={cn(
                    "relative w-full xs:w-auto px-4 py-3 tracking-[0.01em] cursor-pointer transition focus-visible:outline-1 focus-visible:ring-1 focus-visible:outline-none flex flex-col xs:flex-row gap-3 xs:gap-2 items-center rounded-lg border border-primary/20 bg-card/90 backdrop-blur-sm",
                    activeTab === tab.id
                      ? "text-accent font-medium tracking-normal border-accent/40"
                      : "text-gray-300 hover:text-accent hover:border-accent/30"
                  )}
                  style={{ 
                    WebkitTapHighlightColor: "transparent", 
                    minHeight: "44px", 
                    minWidth: "44px" 
                  }}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="feature-bubble"
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
                    className="relative z-10 p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg"
                    transition={{ type: "spring" }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex flex-col items-center xs:items-start relative z-10">
                    <span className="font-medium text-sm">{tab.label}</span>
                    <span className="text-xs opacity-80">{tab.subtitle}</span>
                  </div>
                </motion.button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
});

FeatureSection.displayName = 'FeatureSection';

export default FeatureSection;
