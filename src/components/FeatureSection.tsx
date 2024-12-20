import React from "react";
import { MessageCircle, Camera, BookOpen } from "lucide-react";
import FeatureCard from "./FeatureCard";

interface FeatureSectionProps {
  onFeatureClick: () => void;
}

const FeatureSection = ({ onFeatureClick }: FeatureSectionProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4">
      <FeatureCard
        icon={MessageCircle}
        title="Growing Assistant"
        subtitle="Get expert growing advice"
        onClick={onFeatureClick}
      />
      <FeatureCard
        icon={Camera}
        title="Plant Health Check"
        subtitle="Diagnose plant issues"
        onClick={onFeatureClick}
      />
      <FeatureCard
        icon={BookOpen}
        title="Growing Guide"
        subtitle="Quick answers to FAQs"
        onClick={onFeatureClick}
      />
    </div>
  );
};

export default FeatureSection;