import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

const FeatureCard = ({ icon: Icon, title, subtitle, onClick }: FeatureCardProps) => {
  return (
    <div
      onClick={onClick}
      className="w-full p-4 bg-card rounded-lg mb-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 flex items-center space-x-4 animate-fade-in"
    >
      <div className="p-3 bg-primary rounded-lg">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col text-left">
        <h3 className="font-semibold text-lg text-white">{title}</h3>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

export default FeatureCard;