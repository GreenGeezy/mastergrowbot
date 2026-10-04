import { useEffect } from "react";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import LandingFooter from "./LandingFooter";
import LandingNav from "./LandingNav";
import "./premium.css";
import TrustRail from "./TrustRail";
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
    <div className="premium-site min-h-screen text-white overflow-x-hidden">
      <LandingNav />
      <main>
        <HeroSection />
        <TrustRail />
        <GrowWalkthrough />
        <FeatureSection />
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_.8fr]" aria-labelledby="home-playbooks-title">
          <div><p className="text-xs font-bold uppercase tracking-widest text-emerald-300">MasterGrowbot field manuals</p><h2 id="home-playbooks-title" className="mt-4 text-3xl font-bold">Give your photos and readings a clear record.</h2><p className="mt-5 max-w-2xl leading-7 text-white/70">Follow worked AI examples, copy a prompt with the right context and save a note you have checked. Start with free equipment sheets, the $19 Quickstart or the complete Playbook kit.</p><Link to="/playbooks" onClick={() => trackEvent('playbooks_discovery_click', { cta_location: 'homepage_field_manual' })} className="mt-7 inline-flex min-h-12 items-center rounded-full bg-emerald-300 px-6 py-3 font-bold text-emerald-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Preview the guides and compare options</Link></div>
          <img src="/images/playbook/field-manual-scene.webp" width={1536} height={1024} loading="lazy" alt="Illustrative botanical observation scene with a phone and notebook" className="w-full rounded-2xl" />
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
