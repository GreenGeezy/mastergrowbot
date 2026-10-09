import { ArrowDown, ArrowRight, Check } from "lucide-react";
import HeroProductDemo from "./HeroProductDemo";
import { appStoreUrl, playStoreUrl } from "./ctaLinks";

export function AppActions({ location = "hero", trial = false }: { location?: string; trial?: boolean }) {
  return <div className="premium-actions">
    <a className="premium-button" href={appStoreUrl(location)} data-cta-location={`${location}:ios`}>{trial ? "Try it free on iPhone" : "Get it on iPhone"} <ArrowRight size={18} /></a>
    <a className="premium-button secondary" href={playStoreUrl(location)} data-cta-location={`${location}:android`}>{trial ? "Try it free on Android" : "Get it on Android"} <ArrowRight size={18} /></a>
  </div>;
}
export default function HeroSection() {
  return <section className="premium-hero revenue-hero" aria-labelledby="hero-title">
    <img className="premium-backdrop" src="/images/premium/botanical-hero.webp" alt="" width="1536" height="1024" />
    <div className="premium-wrap premium-hero-grid">
      <div className="premium-hero-copy">
        <p className="premium-eyebrow"><span className="status-dot" /> MASTERGROWBOT AI · IPHONE & ANDROID</p>
        <h1 id="hero-title">Something look off?<br />Get a <em>second set of eyes.</em></h1>
        <p className="premium-lead">Take a plant photo. Get an AI plant health report with practical next steps, then track what changes in your grow journal.</p>
        <AppActions trial />
        <p className="premium-fine">Free download. Photo analysis and journal tools require Pro. Eligible new Pro subscribers can try 3 days free; subscriptions renew unless canceled. Check your store for terms.</p>
        <div className="premium-hero-benefits"><span><Check size={15} /> Photo analysis</span><span><Check size={15} /> Grow journal</span><span><Check size={15} /> Strain intelligence</span></div>
        <a href="#grow-walkthrough" className="premium-text-link">See the photo-to-journal workflow <ArrowDown size={16} /></a>
      </div>
      <HeroProductDemo />
    </div>
  </section>;
}

