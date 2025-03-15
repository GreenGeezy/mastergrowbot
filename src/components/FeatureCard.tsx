
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import React from "react";
import { toast } from "sonner";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick?: () => void;
  to?: string;
}

const FeatureCard = React.memo(({ icon: Icon, title, subtitle, onClick, to }: FeatureCardProps) => {
  const navigate = useNavigate();
  const session = useSession();

  const handleClick = React.useCallback(() => {
    if (!session) {
      toast.error("Please sign in to access this feature");
      return;
    }

    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  }, [to, onClick, navigate, session]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }, [handleClick]);

  return (
    <div 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative group flex justify-between items-center p-3 rounded-lg cursor-pointer border border-[#333333]/80 bg-[#1A1F2C]/90 hover:bg-[#2D3748]/70 transition-all duration-300 hover:scale-105 min-w-[120px] max-w-[140px] h-[65px] overflow-hidden"
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-[11px] text-white group-hover:text-accent transition-colors duration-300">
            {title}
          </h3>
        </div>
        <p className="text-gray-400 text-[9px]">
          {subtitle}
        </p>
      </div>
      
      {/* Glowing accent in bottom right */}
      <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-r from-primary-glow/30 to-secondary-glow/30 blur-md group-hover:from-primary-glow/50 group-hover:to-secondary-glow/50 transition-all duration-300"></div>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;
