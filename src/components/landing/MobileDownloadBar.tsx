import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { appStoreUrl, playStoreUrl } from "./ctaLinks";

/** Mobile-only sticky download bar. Appears after the hero, hides at the final download section. */
export default function MobileDownloadBar() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");
  useEffect(() => {
    const ua = navigator.userAgent;
    setPlatform(/iPhone|iPad|iPod/i.test(ua) ? "ios" : /Android/i.test(ua) ? "android" : "other");
    let heroGone = false, finalVisible = false;
    const update = () => setShow(heroGone && !finalVisible);
    const hero = document.getElementById("hero-title");
    const final = document.getElementById("download");
    const heroObs = new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting && e.boundingClientRect.top < 0; update(); });
    const finalObs = new IntersectionObserver(([e]) => { finalVisible = e.isIntersecting; update(); });
    if (hero) heroObs.observe(hero);
    if (final) finalObs.observe(final);
    return () => { heroObs.disconnect(); finalObs.disconnect(); };
  }, []);
  return <aside className={`mg-mobile-bar${show ? " is-visible" : ""}`} aria-label="Download MasterGrowbot AI" aria-hidden={!show}>
    <div className="mg-mobile-bar-copy"><strong>MasterGrowbot AI</strong><span>Free download · 3-day Pro trial</span></div>
    {platform !== "android" && <a href={appStoreUrl("mobile-sticky-bar")} data-cta-location="mobile-sticky-bar:ios" tabIndex={show ? 0 : -1}>{platform === "ios" ? "Try it free" : "iPhone"} <ArrowRight size={16} aria-hidden="true" /></a>}
    {platform !== "ios" && <a href={playStoreUrl("mobile-sticky-bar")} data-cta-location="mobile-sticky-bar:android" tabIndex={show ? 0 : -1}>{platform === "android" ? "Try it free" : "Android"} <ArrowRight size={16} aria-hidden="true" /></a>}
  </aside>;
}
