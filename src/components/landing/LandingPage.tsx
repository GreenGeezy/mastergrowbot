import RealReports from '@/components/landing/RealReports';
import IPMPlaybookSection from './IPMPlaybookSection';
import NewsletterBand from './NewsletterBand';
import { useEffect } from "react";
import HeroSection from "./HeroSection";
import AppTestimonials from "./AppTestimonials";
import FeatureSection from "./FeatureSection";
import GrowerBenefits from "./GrowerBenefits";
import MobileDownloadBar from "./MobileDownloadBar";
import LandingFooter from "./LandingFooter";
import LandingNav from "./LandingNav";
import "./premium.css";
import "./premium-release.css";
import "./cinematic.css";
import "./hero-v4.css";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Monitor } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { ANNUAL_SAVING_PERCENT, PLANS, WEEKLY_PHOTO_REPORTS, webProLive } from "@/lib/webPro";

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
        <RealReports campaign="homepage" location="homepage" />
        <GrowerBenefits />
        <FeatureSection />
        {webProLive && (
          <section className="premium-wrap my-12" aria-labelledby="home-web-pro-title">
            <div className="rounded-3xl border border-landing-green/25 bg-gradient-to-br from-landing-green/[0.08] via-[#070b08] to-[#050806] p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
              <div className="max-w-2xl font-sans">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-landing-green">
                  <Monitor size={14} aria-hidden="true" />
                  For your computer · Web Pro
                </p>
                <h2 id="home-web-pro-title" className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Prefer working at a desk? Get AI plant reports in your browser.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
                  Upload photos from any computer, save your VPD, light and grow week numbers, work through checklists, and print or save reports as PDF.
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
                  <li className="inline-flex items-center gap-2"><Check size={15} className="text-landing-green" aria-hidden="true" />Up to {WEEKLY_PHOTO_REPORTS} photo reports/week</li>
                  <li className="inline-flex items-center gap-2"><Check size={15} className="text-landing-green" aria-hidden="true" />Saved VPD &amp; light numbers</li>
                  <li className="inline-flex items-center gap-2"><Check size={15} className="text-landing-green" aria-hidden="true" />Cancel anytime</li>
                </ul>
                <p className="mt-3 text-xs text-white/55">
                  Browser subscription billed separately from the iPhone and Android apps.
                </p>
              </div>
              <div className="mt-6 shrink-0 rounded-2xl border border-white/10 bg-black/50 p-5 font-sans lg:mt-0 lg:w-72">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{PLANS.annual.display}</span>
                  <span className="text-sm text-white/65">/ year</span>
                  <span className="ml-auto rounded-full bg-landing-green/15 px-2.5 py-0.5 text-xs font-semibold text-landing-green">
                    Save {ANNUAL_SAVING_PERCENT}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/60">
                  or {PLANS.monthly.display}/month · billed in USD via Whop
                </p>
                <Link
                  to="/pro"
                  data-cta-location="homepage-spotlight:web-pro"
                  onClick={() => trackEvent('web_pro_invite_click', { cta_location: 'homepage_spotlight' })}
                  className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-landing-green px-6 text-sm font-bold text-black transition hover:bg-landing-green/90"
                >
                  Explore Web Pro <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        )}
        <section className="premium-wrap mg-light-teaser" aria-labelledby="home-light-title">
          <div className="mg-light-teaser-media">
            <picture>
              <source media="(max-width:767px)" srcSet="/images/grow-tech/ag1000-lifestyle-v2/hero-mobile.webp" />
              <img src="/images/grow-tech/ag1000-lifestyle-v2/hero.webp" width={1200} height={1500} loading="lazy" alt="Home grower checking cannabis plants under the AG1000 100W LED grow light in a reflective grow tent" />
            </picture>

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
        <NewsletterBand />
      </main>
      <LandingFooter />
      <MobileDownloadBar />
    </div>
  );
}
