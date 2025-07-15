import React from "react";
import BenefitsSection from "./BenefitsSection";

interface FeatureSectionProps {
  onFeatureClick: () => void;
}

const FeatureSection = React.memo(({
  onFeatureClick
}: FeatureSectionProps) => {
  return (
    <div className="w-full">
      <BenefitsSection />
    </div>
  );
});

FeatureSection.displayName = 'FeatureSection';
export default FeatureSection;