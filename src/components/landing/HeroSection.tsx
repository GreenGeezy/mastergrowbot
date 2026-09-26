import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { appStoreUrl, playStoreUrl } from "./ctaLinks";

export function AppActions({ location = "hero" }: { location?: string }) {
  return (
    <div className="premium-actions">
      <a
        className="premium-button"
        href={appStoreUrl(location)}
        data-cta-location={`${location}:ios`}
      >
        Try Pro free on iPhone <ArrowRight size={18} />
      </a>
      <a
        className="premium-button secondary"
        href={playStoreUrl(location)}
        data-cta-location={`${location}:android`}
      >
        Get it on Android <ArrowRight size={18} />
      </a>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="premium-hero" aria-labelledby="hero-title">
      <img
        className="premium-backdrop"
        src="/images/premium/botanical-hero.webp"
        alt=""
        width="1536"
        height="1024"
        fetchPriority="high"
      />
      <div className="premium-wrap premium-hero-grid">
        <div className="premium-hero-copy">
          <p className="premium-eyebrow">
            <span className="status-dot" /> AI PLANT ANALYSIS · BUILT FOR CANNABIS GROWERS
          </p>
          <h1 id="hero-title">
            Something look off?
            <br />
            Get a <em>second set of eyes.</em>
          </h1>
          <p className="premium-lead">
            Take a plant photo. Get an AI plant health report with practical next steps, then track what changes in your grow journal.
          </p>
          <AppActions />
          <p className="premium-fine">
            3-day Pro trial for eligible new subscribers. Subscription renews
            unless canceled. See your store for terms.
          </p>
          <div className="premium-hero-benefits">
            <span>
              <Check size={15} /> Photo analysis
            </span>
            <span>
              <Check size={15} /> Grow journal
            </span>
            <span>
              <Check size={15} /> Strain intelligence
            </span>
          </div>
          <a href="#grow-goal-title" className="premium-text-link">
            Find your next step <ArrowDown size={16} />
          </a>
        </div>
        <div className="premium-phone-stage">
          <div className="premium-stage-label">
            <span>MASTERGROWBOT AI</span>
            <span>YOUR POCKET COMPANION</span>
          </div>
          <img
            className="premium-phone rear"
            src="/images/premium/app-1.webp"
            alt="MasterGrowbot photo analysis app preview"
            width="700"
            height="1516"
          />
          <img
            className="premium-phone front"
            src="/images/premium/app-2.webp"
            alt="MasterGrowbot plant health report app preview"
            width="700"
            height="1516"
            fetchPriority="high"
          />
          <div className="premium-stage-note">
            <Check size={18} />
            <div>
              <strong>From a photo to a plan.</strong>
              <span>Understand what you’re seeing.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
