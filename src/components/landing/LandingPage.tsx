import { useEffect } from 'react';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import ConversionBanner from './ConversionBanner';
import IPMPlaybookSection from './IPMPlaybookSection';
import LandingFooter from './LandingFooter';
import LandingNav from './LandingNav';
import ParticleBackground from './ParticleBackground';
import TrustRail from './TrustRail';

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
      <TrustRail />
      <FeatureSection />
      <IPMPlaybookSection />
      <ConversionBanner />
      <LandingFooter />
    </div>
  );
}
