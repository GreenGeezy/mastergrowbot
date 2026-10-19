import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { HERO_VERSION } from "@/lib/heroDemoMetadata";
import HeroProductDemo from "./HeroProductDemo";
import { appStoreUrl, playStoreUrl } from "./ctaLinks";

function PlatformIcon({ platform }: { platform: "ios" | "android" }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    {platform === "ios" ? <path d="M17.1 12.8c0-2 1.6-3 1.7-3.1-1-1.5-2.6-1.7-3.2-1.7-1.4-.2-2.7.8-3.4.8-.7 0-1.8-.8-2.9-.8-1.5 0-3 .9-3.8 2.2-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.7-2.2c.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.4-1-2.4-4.1ZM14.8 6.5c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.8 1 .1 2.1-.5 2.8-1.2Z" /> : <><path d="m6.3 7.2-1.2-2a.5.5 0 0 1 .9-.5l1.3 2.1a10 10 0 0 1 9.4 0L18 4.7a.5.5 0 0 1 .9.5l-1.2 2C20 8.6 21.4 11 21.5 14h-19c.1-3 1.5-5.4 3.8-6.8ZM7.5 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" /><path d="M4 15h16v3a2 2 0 0 1-2 2h-1v2h-2v-2H9v2H7v-2H6a2 2 0 0 1-2-2v-3Z" /></>}
  </svg>;
}

export function AppActions({ location = "hero", trial = false }: { location?: string; trial?: boolean }) {
  const hero = location === "hero";
  return <div className="premium-actions">
    <a className="premium-button" href={appStoreUrl(location)} data-cta-location={`${location}:ios`} data-hero-version={hero ? HERO_VERSION : undefined}>{hero && <PlatformIcon platform="ios" />}{trial ? "Try it free on iPhone" : "Get it on iPhone"} <ArrowRight size={18} aria-hidden="true" /></a>
    <a className={`premium-button${hero ? "" : " secondary"}`} href={playStoreUrl(location)} data-cta-location={`${location}:android`} data-hero-version={hero ? HERO_VERSION : undefined}>{hero && <PlatformIcon platform="android" />}{trial ? "Try it free on Android" : "Get it on Android"} <ArrowRight size={18} aria-hidden="true" /></a>
  </div>;
}
export default function HeroSection() {
  const section = useRef<HTMLElement>(null);
  const exposed = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || exposed.current) return;
      exposed.current = true;
      trackEvent("hero_exposure", { placement: "homepage_hero", hero_version: HERO_VERSION, device_category: window.innerWidth < 600 ? "mobile" : window.innerWidth < 900 ? "tablet" : "desktop" });
      observer.disconnect();
    });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  return <><Helmet>
    <link rel="preload" as="image" href="/images/premium/hero-grow-lab-mobile-v8.webp" media="(max-width: 767px)" />
    <link rel="preload" as="image" href="/images/premium/hero-grow-lab-v8.webp" media="(min-width: 768px)" />
  </Helmet><section ref={section} className="premium-hero revenue-hero" aria-labelledby="hero-title">
    <div className="premium-wrap premium-hero-grid">
      <div className="premium-hero-copy">
        <p className="premium-eyebrow"><span className="status-dot" /> MASTERGROWBOT AI · CANNABIS GROW INTELLIGENCE</p>
        <h1 id="hero-title">Something look off?<br />Get a <em>second set of eyes.</em></h1>
        <p className="premium-lead">Stop guessing what your plant needs. Turn a photo into AI insights, practical checks, and a clearer next step. Keep your observations together as your grow changes.</p>
        <AppActions trial />
        <p className="premium-fine">Free download. Photo analysis and journal tools require Pro. Eligible new Pro subscribers can try 3 days free; subscriptions renew unless canceled. Check your store for terms.</p>
        <div className="premium-hero-benefits"><span><Check size={15} aria-hidden="true" /> Understand symptoms</span><span><Check size={15} aria-hidden="true" /> Know what to check</span><span><Check size={15} aria-hidden="true" /> Track your grow</span></div>
        <a href="#video-analysis" className="premium-text-link hero-video-discovery">Want a fuller view? Explore AI video analysis on iPhone <ArrowDown size={16} aria-hidden="true" /></a>
      </div>
      <div className="hero-showcase"><HeroProductDemo /><a href="#grow-walkthrough" className="premium-text-link hero-workflow-link">See the photo-to-journal workflow <ArrowDown size={16} aria-hidden="true" /></a></div>
      <figure className="hero-customer-quote"><blockquote>“As a first-time grower I was totally lost. MasterGrowbot walked me through everything.”</blockquote><figcaption>Sarah K. · MasterGrowbot customer</figcaption><a href="#customer-experiences">Read customer experiences <ArrowDown size={14} aria-hidden="true" /></a></figure>
    </div>
  </section></>;
}

