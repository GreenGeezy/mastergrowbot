
import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Camera, BookOpen } from "lucide-react";

const FeatureCards = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Growing Assistant",
      subtitle: "Get expert growing advice",
      icon: MessageCircle,
      to: "/chat",
      bgColor: "bg-green-600",
    },
    {
      title: "Plant Health Check",
      subtitle: "Diagnose plant issues",
      icon: Camera,
      to: "/plant-health",
      bgColor: "bg-green-600",
    },
    {
      title: "Growing Guide",
      subtitle: "Quick answers to FAQs",
      icon: BookOpen,
      to: "/grow-guide",
      bgColor: "bg-green-600",
    },
  ];

  return (
    <div className="space-y-4 w-full max-w-md mx-auto px-4">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <button
            key={feature.to}
            onClick={() => navigate(feature.to)}
            className="w-full flex items-center p-4 bg-card/50 hover:bg-card/70 border border-white/10 rounded-xl transition-all duration-200 hover:border-accent/30 text-left"
          >
            <div className={`p-3 ${feature.bgColor} rounded-xl mr-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-lg">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.subtitle}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default FeatureCards;
