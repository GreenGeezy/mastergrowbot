
import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Camera, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useHapticFeedback } from "@/utils/hapticFeedback";
import { useIsMobile } from "@/hooks/use-mobile";

const FeatureCards = () => {
  const navigate = useNavigate();
  const haptic = useHapticFeedback();
  const isMobile = useIsMobile();

  const handleFeatureClick = (to: string) => {
    haptic.light();
    navigate(to);
  };

  const features = [
    {
      title: "Growing Assistant",
      subtitle: "Get expert growing advice",
      icon: MessageCircle,
      to: "/chat",
      bgColor: "bg-gradient-to-br from-green-600/80 to-green-700/80",
      glowColor: "shadow-green-500/20",
    },
    {
      title: "Plant Health Check",
      subtitle: "Diagnose plant issues",
      icon: Camera,
      to: "/plant-health",
      bgColor: "bg-gradient-to-br from-blue-600/80 to-blue-700/80",
      glowColor: "shadow-blue-500/20",
    },
    {
      title: "Growing Guide",
      subtitle: "Quick answers to FAQs",
      icon: BookOpen,
      to: "/grow-guide",
      bgColor: "bg-gradient-to-br from-purple-600/80 to-purple-700/80",
      glowColor: "shadow-purple-500/20",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className={`space-y-3 sm:space-y-4 w-full max-w-md mx-auto px-4 ${isMobile ? 'mb-6' : 'mb-8'}`}
      data-testid="feature-cards"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.to}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <button
              onClick={() => handleFeatureClick(feature.to)}
              className={`w-full flex items-center p-4 sm:p-5 bg-card/90 hover:bg-card/95 border border-white/10 hover:border-accent/30 rounded-2xl transition-all duration-300 text-left backdrop-blur-xl shadow-xl hover:shadow-2xl ${feature.glowColor} hover:shadow-lg group-hover:translate-y-[-2px]`}
            >
              <div className={`${feature.bgColor} p-3 sm:p-4 rounded-xl mr-4 shadow-lg ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300`}>
                <Icon className={`text-white group-hover:scale-110 transition-transform duration-300 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`text-white font-semibold group-hover:text-accent transition-colors duration-300 ${isMobile ? 'text-base' : 'text-lg'}`}>
                  {feature.title}
                </h3>
                <p className={`text-gray-400 group-hover:text-gray-300 transition-colors duration-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {feature.subtitle}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 bg-accent rounded-full" />
              </div>
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default FeatureCards;
