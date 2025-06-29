
import { LucideIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  to: string;
}

const FeatureCard = React.memo(({ icon: Icon, title, subtitle, to }: FeatureCardProps) => {
  return (
    <div className="relative group">
      {/* Glow effect wrapper */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-glow/50 via-accent-glow/50 to-secondary-glow/50 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-glow" />
      
      <Link to={to} style={{ textDecoration: "none", display: "block" }} onClick={() => console.log("CARD→", to)}>
        <article className="cursor-pointer select-none">
          <div className="relative flex items-center p-2 rounded-lg will-change-transform transition-all duration-300 hover:scale-105 min-w-[180px] bg-card/90 backdrop-blur-sm border border-card-foreground/10 hover:border-primary/20">
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
        </article>
      </Link>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;
