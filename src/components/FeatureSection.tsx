import React from "react";
import { MessageCircle, Camera, BookOpen } from "lucide-react";
import FeatureCard from "./FeatureCard";

interface FeatureSectionProps {
  onFeatureClick: () => void;
}

const FeatureSection = React.memo(({ onFeatureClick }: FeatureSectionProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-3 gap-2">
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