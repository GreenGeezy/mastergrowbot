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
      className="group relative w-full sm:w-[300px] p-6 rounded-xl cursor-pointer transition-all duration-500 animate-fade-in hover:transform hover:scale-[1.02] glow-effect"
    >
      {/* Gradient border effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 via-[#33C3F0]/50 to-secondary/50 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      
      {/* Card content */}
      <div className="relative flex flex-col space-y-4 bg-[#1A1A1A]/90 backdrop-blur-xl p-6 rounded-xl ring-1 ring-white/10 group-hover:ring-[#33C3F0]/30 transition-all duration-500">
        <div className="p-3 bg-gradient-to-r from-primary via-[#33C3F0] to-secondary rounded-lg w-fit transform group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col text-left">
          <h3 className="font-semibold text-xl text-white mb-2 group-hover:text-[#33C3F0] transition-colors duration-300">
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