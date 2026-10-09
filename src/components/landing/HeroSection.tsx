import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { appStoreUrl, playStoreUrl } from "./ctaLinks";

export function AppActions({ location = "hero" }: { location?: string }) {
  return <div className="premium-actions">
    <a className="premium-button" href={appStoreUrl(location)} data-cta-location={`${location}:ios`}>Get it on iPhone <ArrowRight size={18} /></a>
    <a className="premium-button secondary" href={playStoreUrl(location)} data-cta-location={`${location}:android`}>Get it on Android <ArrowRight size={18} /></a>
  </div>;
}
export default function HeroSection() {
  return <section className="premium-hero revenue-hero" aria-labelledby="hero-title">
    <img className="premium-backdrop" src="/images/premium/botanical-hero.webp" alt="" width="1536" height="1024" />
    <div className="premium-wrap premium-hero-grid">
      <div className="premium-hero-copy">
        <p className="premium-eyebrow"><span className="status-dot" /> MASTERGROWBOT AI · IPHONE & ANDROID</p>
        <h1 id="hero-title">Your plant photos.<br /><em>A clearer record.</em></h1>
        <p className="premium-lead">Keep plant photos, AI observations and your grow journal together. Review a report, save the context and return to it at your next check.</p>
        <AppActions />
        <p className="premium-fine">Free download. Photo analysis and journal tools require Pro. Eligible new Pro subscribers can try 3 days free; subscriptions renew unless canceled. Check your store for terms.</p>
        <div className="premium-hero-benefits"><span><Check size={15} /> Photo analysis</span><span><Check size={15} /> Grow journal</span><span><Check size={15} /> Strain intelligence</span></div>
        <a href="#grow-walkthrough" className="premium-text-link">See the photo-to-journal workflow <ArrowDown size={16} /></a>
      </div>
      <figure className="revenue-hero-proof">
        <div className="revenue-report-crop"><img src="/images/premium/app-2.webp" alt="MasterGrowbot app report preview showing a plant observation and report interface" width="700" height="1516" fetchPriority="high" /></div>
        <figcaption><strong>See what a report looks like.</strong><span>App preview · Example AI output. Review observations against your own evidence.</span></figcaption>
      </figure>
    </div>
  </section>;
}
