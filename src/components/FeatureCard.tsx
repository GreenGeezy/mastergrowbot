
import { LucideIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useHapticFeedback } from "@/utils/hapticFeedback";
import { useIsMobile } from "@/hooks/use-mobile";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  to: string;
  id?: string;
}

const FeatureCard = React.memo(({ icon: Icon, title, subtitle, to, id }: FeatureCardProps) => {
  const haptic = useHapticFeedback();
  const isMobile = useIsMobile();

  const handleClick = () => {
    haptic.light();
  };

  return (
    <motion.div 
      className="relative group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Enhanced glow effect wrapper */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-glow/40 via-accent-glow/40 to-secondary-glow/40 rounded-2xl blur opacity-60 group-hover:opacity-90 transition duration-500 group-hover:duration-200 animate-pulse-glow pointer-events-none" />
      
      <Link 
        to={to} 
        onClick={handleClick}
        style={{ textDecoration: "none", display: "block" }} 
        data-featurecard 
        id={id}
      >
        <article className="cursor-pointer select-none">
          <div className={`relative flex items-center rounded-2xl will-change-transform transition-all duration-300 bg-card/90 backdrop-blur-xl border border-card-foreground/10 hover:border-primary/30 shadow-xl hover:shadow-2xl hover:shadow-primary/10 ${isMobile ? 'p-3 min-w-[160px]' : 'p-4 min-w-[200px]'}`}>
            <div className={`bg-gradient-primary group-hover:bg-gradient-secondary rounded-xl float-effect will-change-transform shadow-lg ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300 ${isMobile ? 'p-2' : 'p-3'}`}>
              <Icon className={`text-white group-hover:scale-110 transition-transform duration-300 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>
            <div className={`flex flex-col ${isMobile ? 'ml-2' : 'ml-3'}`}>
              <h3 className={`font-semibold text-white group-hover:text-accent transition-colors duration-300 ${isMobile ? 'text-sm' : 'text-base'}`}>
                {title}
              </h3>
              <p className={`text-gray-400 group-hover:text-gray-300 transition-colors duration-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {subtitle}
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;
