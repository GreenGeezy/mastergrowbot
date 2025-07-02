import React from "react";
import FeatureCards from "./FeatureCards";
interface FeatureSectionProps {
  onFeatureClick: () => void;
}
const FeatureSection = React.memo(({
  onFeatureClick
}: FeatureSectionProps) => {
  return <div className="w-full max-w-screen-md mx-auto px-4">
      
    </div>;
});
FeatureSection.displayName = 'FeatureSection';
export default FeatureSection;