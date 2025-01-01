import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick?: () => void;
  to?: string;
}

const FeatureCard = ({ icon: Icon, title, subtitle, onClick, to }: FeatureCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      className="card group flex items-center p-3 rounded-lg cursor-pointer"
    >
      <div className="p-1.5 bg-gradient-primary group-hover:bg-gradient-secondary rounded-lg float-effect">
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
};

export default FeatureCard;