import IPMPlaybookSection from './IPMPlaybookSection';
import { useEffect } from "react";
import HeroSection from "./HeroSection";
import AppTestimonials from "./AppTestimonials";
import FeatureSection from "./FeatureSection";
import LandingFooter from "./LandingFooter";
import LandingNav from "./LandingNav";
import "./premium.css";
import "./premium-release.css";
import "./cinematic.css";
import "./hero-v4.css";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

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
    <div className="premium-site cinematic-site min-h-screen text-white overflow-x-hidden">
      <LandingNav />
      <main>
        <HeroSection />
        <AppTestimonials />
        <FeatureSection />
        <section className="premium-wrap mg-light-teaser" aria-labelledby="home-light-title">
          <div className="mg-light-teaser-media">
            <picture>
              <source media="(max-width:767px)" srcSet="/images/grow-tech/ag1000-lifestyle-v2/hero-mobile.webp" />
              <img src="/images/grow-tech/ag1000-lifestyle-v2/hero.webp" width={1200} height={1500} loading="lazy" alt="Home grower checking cannabis plants under the AG1000 100W LED grow light in a reflective grow tent" />
            </picture>
            <span>AI illustration · tent and plants not included</span>
          </div>
          <div className="mg-light-teaser-copy">
            <p className="premium-eyebrow">GROWTECH · ALPHAGROW AG1000</p>
            <h2 id="home-light-title">Upgrade your light.<br /><em>Give every plant a brighter start.</em></h2>
            <p>A 100W full-spectrum LED panel for compact indoor tents. Turn the dial from 20% to 100% as your plants grow.</p>
            <ul>
              <li><Check size={16} aria-hidden="true" />100W full spectrum, 20 to 100% dimming</li>
              <li><Check size={16} aria-hidden="true" />US shipping included, 30-day returns</li>
              <li><Check size={16} aria-hidden="true" />Free equipment quickstart included</li>
            </ul>
            <div className="mg-light-teaser-buy">
              <p><strong>$199</strong><span>USD · one-time</span></p>
              <Link to="/grow-tech?utm_source=homepage&utm_medium=internal&utm_campaign=november-ag1000&utm_content=equipment-card" onClick={() => trackEvent('growtech_discovery_click', { cta_location: 'homepage_equipment', product_id: 'growtech_ag1000_light' })} className="mg-light-teaser-cta">Shop the AG1000 <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
        <IPMPlaybookSection />
      </main>
      <LandingFooter />
    </div>
  );
}
