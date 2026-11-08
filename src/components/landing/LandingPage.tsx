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
import GrowWalkthrough from "./GrowWalkthrough";
import { Link } from "react-router-dom";
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
        <GrowWalkthrough />
        <AppTestimonials />
        <FeatureSection />
        <section className="mx-auto grid max-w-6xl items-center gap-6 px-5 py-10 sm:px-8 md:grid-cols-2" aria-labelledby="home-light-title">
          <img src="/images/grow-tech/ag1000-supplier/spectrum.png" width={800} height={800} loading="lazy" alt="AG1000 supplier product image and spectrum specifications" className="w-full max-w-md rounded-2xl" />
          <div><p className="text-xs font-bold uppercase tracking-widest text-emerald-300">GrowTech equipment</p><h2 id="home-light-title" className="mt-3 text-3xl font-bold">Adjustable light for your indoor setup.</h2><p className="mt-4 leading-7 text-white/75">AG1000 100W LED panel with 20–100% dimming. US plug and free equipment quickstart.</p><p className="mt-4 text-xl font-bold">$199 USD · US shipping included</p><Link to="/grow-tech?utm_source=homepage&utm_medium=internal&utm_campaign=november-ag1000&utm_content=equipment-card#grow-light" onClick={() => trackEvent('growtech_discovery_click', { cta_location: 'homepage_equipment', product_id: 'growtech_ag1000_light' })} className="mt-5 inline-flex min-h-12 items-center rounded-full bg-emerald-300 px-6 py-3 font-bold text-emerald-950">See the light and what’s included →</Link></div>
        </section>
        <IPMPlaybookSection />
      </main>
      <LandingFooter />
    </div>
  );
}
