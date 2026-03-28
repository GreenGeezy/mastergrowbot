import { useEffect } from 'react';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import ConversionBanner from './ConversionBanner';
import LandingFooter from './LandingFooter';
import LandingNav from './LandingNav';
import ParticleBackground from './ParticleBackground';

export default function LandingPage() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <ParticleBackground />
      <LandingNav />
      <HeroSection />
      <FeatureSection />
      <ConversionBanner />
      <LandingFooter />
    </div>
  );
}
