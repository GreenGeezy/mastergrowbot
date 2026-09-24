import { useEffect } from "react";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import LandingFooter from "./LandingFooter";
import LandingNav from "./LandingNav";
import "./premium.css";
import TrustRail from "./TrustRail";

export default function LandingPage() {
  useEffect(() => {
    // Honor direct download links after the lazy-loaded homepage mounts.
    const target =
      window.location.hash &&
      document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, []);

  return (
    <div className="premium-site min-h-screen text-white overflow-x-hidden">
      <LandingNav />
      <main>
        <HeroSection />
        <TrustRail />
        <FeatureSection />
      </main>
      <LandingFooter />
    </div>
  );
}
