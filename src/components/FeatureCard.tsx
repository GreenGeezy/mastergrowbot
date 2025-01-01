import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick?: () => void;
  to?: string;
}

const FeatureCard = React.memo(({ icon: Icon, title, subtitle, onClick, to }: FeatureCardProps) => {
  const navigate = useNavigate();

  const handleClick = React.useCallback(() => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  }, [to, onClick, navigate]);

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
      className="card group flex items-center p-3 rounded-lg cursor-pointer will-change-transform"
    >
      <div className="p-1.5 bg-gradient-primary group-hover:bg-gradient-secondary rounded-lg float-effect will-change-transform">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="ml-3 flex flex-col">
        <h3 className="font-medium text-sm text-white group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 text-[19px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;