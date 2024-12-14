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
      className="group relative w-full sm:w-[300px] p-6 rounded-xl cursor-pointer transition-all duration-300 animate-fade-in"
    >
      {/* Gradient border effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 to-secondary/50 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      
      {/* Card content */}
      <div className="relative flex flex-col space-y-4 bg-card/80 backdrop-blur-sm p-6 rounded-xl ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-300">
        <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-lg w-fit">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col text-left">
          <h3 className="font-semibold text-xl text-white mb-2 group-hover:text-secondary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;