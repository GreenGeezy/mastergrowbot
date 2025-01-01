import React from "react";
import { MessageCircle, Camera, BookOpen } from "lucide-react";
import FeatureCard from "./FeatureCard";

interface FeatureSectionProps {
  onFeatureClick: () => void;
}

const FeatureSection = React.memo(({ onFeatureClick }: FeatureSectionProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-2 sm:mb-3 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4">
      <FeatureCard
        icon={MessageCircle}
        title="Growing Assistant"
        subtitle="Get expert growing advice"
        to="/chat"
      />
      <FeatureCard
        icon={Camera}
        title="Plant Health Check"
        subtitle="Diagnose plant issues"
        to="/plant-health"
      />
      <FeatureCard
        icon={BookOpen}
        title="Growing Guide"
        subtitle="Quick answers to FAQs"
        to="/grow-guide"
      />
    </div>
  );
});

FeatureSection.displayName = 'FeatureSection';

export default FeatureSection;