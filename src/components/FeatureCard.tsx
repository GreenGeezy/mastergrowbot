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
      className="card group flex items-center p-2 rounded-lg cursor-pointer will-change-transform transition-all duration-300 hover:scale-105 min-w-[200px]"
    >
      <div className="p-1 bg-gradient-primary group-hover:bg-gradient-secondary rounded-lg float-effect will-change-transform">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="ml-2 flex flex-col">
        <h3 className="font-medium text-sm text-white group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 text-xs">
          {subtitle}
        </p>
      </div>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;