import CinematicScene from "./CinematicScene";
import HeroProductDemo from "./HeroProductDemo";
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowDown, ArrowRight, Check, Star } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { HERO_VERSION } from "@/lib/heroDemoMetadata";

import { appStoreUrl, playStoreUrl } from "./ctaLinks";

function PlatformIcon({ platform }: { platform: "ios" | "android" }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    {platform === "ios" ? <path d="M17.1 12.8c0-2 1.6-3 1.7-3.1-1-1.5-2.6-1.7-3.2-1.7-1.4-.2-2.7.8-3.4.8-.7 0-1.8-.8-2.9-.8-1.5 0-3 .9-3.8 2.2-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.7-2.2c.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.4-1-2.4-4.1ZM14.8 6.5c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.8 1 .1 2.1-.5 2.8-1.2Z" /> : <><path d="m6.3 7.2-1.2-2a.5.5 0 0 1 .9-.5l1.3 2.1a10 10 0 0 1 9.4 0L18 4.7a.5.5 0 0 1 .9.5l-1.2 2C20 8.6 21.4 11 21.5 14h-19c.1-3 1.5-5.4 3.8-6.8ZM7.5 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" /><path d="M4 15h16v3a2 2 0 0 1-2 2h-1v2h-2v-2H9v2H7v-2H6a2 2 0 0 1-2-2v-3Z" /></>}
  </svg>;
}

export function AppActions({ location = "hero", trial = false }: { location?: string; trial?: boolean }) {
  const hero = location === "hero";
  return <div className="premium-actions">
    <a className="premium-button" href={appStoreUrl(location)} data-cta-location={`${location}:ios`} data-hero-version={hero ? HERO_VERSION : undefined}>{hero && <PlatformIcon platform="ios" />}{trial ? "Try it free on iPhone" : "Download for iPhone"} <ArrowRight size={18} aria-hidden="true" /></a>
    <a className={`premium-button${hero ? "" : " secondary"}`} href={playStoreUrl(location)} data-cta-location={`${location}:android`} data-hero-version={hero ? HERO_VERSION : undefined}>{hero && <PlatformIcon platform="android" />}{trial ? "Try it free on Android" : "Download for Android"} <ArrowRight size={18} aria-hidden="true" /></a>
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
  return <><Helmet><link rel="preload" as="image" href="/images/cinematic-v2/app-background-v3.webp" media="(min-width:768px)"/><link rel="preload" as="image" href="/images/cinematic-v2/app-background-v3-mobile.webp" media="(max-width:767px)"/></Helmet>
  <section ref={section} className="mg-hero" aria-labelledby="hero-title">
    <div className="mg-hero-stage">
      <CinematicScene name="app-background-v3" alt="Home grower checking cannabis plants under an LED grow light"/>
      <div className="mg-hero-shade" aria-hidden="true"/>
      <div className="premium-wrap mg-hero-content">
        <div className="mg-hero-copy">
          <p className="mg-hero-eyebrow"><span className="mg-pulse" aria-hidden="true"/>Your AI master grower, in your pocket</p>
          <h1 id="hero-title">Know what to check.<br/><em>Grow with confidence.</em></h1>
          <p className="mg-hero-lede">Snap a photo of your cannabis plant. Get an AI report on what to check next, then keep every observation in one grow journal.</p>
          <AppActions/>
          <ul className="mg-hero-trust" aria-label="Why growers download MasterGrowbot AI">
            <li><span className="mg-stars" aria-hidden="true">{Array.from({length:5},(_,i)=><Star key={i} size={14} fill="currentColor"/>)}</span><strong>5.0</strong>&nbsp;on the App Store</li>
            <li><Check size={15} aria-hidden="true"/>Free download</li>
            <li><Check size={15} aria-hidden="true"/>iPhone &amp; Android</li>
          </ul>
          <p className="mg-hero-terms">Photo analysis and journal tools require a subscription. Your app store shows current prices and trial eligibility.</p>
        </div>
      </div>
      <a href="#grow-walkthrough" className="mg-hero-scroll">See how it works <ArrowDown size={16} aria-hidden="true"/></a>
    </div>
    <div id="grow-walkthrough" className="premium-wrap mg-hero-demo">
      <div className="mg-hero-demo-copy">
        <p className="premium-eyebrow">SEE IT IN ACTION</p>
        <h2>From one photo<br/><em>to your next move.</em></h2>
        <p>Tap through a real example: a grower spots yellowing lower leaves, snaps a photo, and gets clear checks to run before changing anything.</p>
        <figure className="mg-hero-quote"><blockquote>“As a first-time grower I was totally lost. MasterGrowbot walked me through everything.”</blockquote><figcaption>Sarah K. · MasterGrowbot customer · <a href="#customer-experiences">Read more reviews</a></figcaption></figure>
      </div>
      <div className="mg-hero-demo-frame"><HeroProductDemo/></div>
    </div>
  </section></>;
}
