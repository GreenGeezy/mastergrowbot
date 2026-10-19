import AppRating from "./AppRating";
import { Quote } from "lucide-react";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { AppActions } from "./HeroSection";

// Reused from app onboarding and summary. Founder confirmed real customer
// origin and permission for public reuse on October 9, 2026.
const feedback = [
  { name: "Sarah K.", quote: "As a first-time grower I was totally lost. MasterGrowbot walked me through everything.", source: "Onboarding quiz" },
  { name: "Tom R.", quote: "The daily reminders and grow journal keep me on track.", source: "Quiz summary · excerpt" },
  { name: "Jake M.", quote: "Caught a magnesium deficiency before it wrecked my whole crop.", source: "Onboarding quiz" },
  { name: "Alex D.", quote: "Helped me diagnose an issue in seconds that would have taken me days to figure out.", source: "Onboarding quiz" },
];

export default function AppTestimonials() {

  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { trackEvent("customer_feedback_view", {placement:"homepage_customer_feedback", creative:"proof_v2"}); observer.disconnect(); }
    }, {threshold:0.25});
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  const quoteCard = ({name, quote}: typeof feedback[number]) => <figure key={name}><Quote size={24} aria-hidden="true" /><blockquote>“{quote}”</blockquote><figcaption>{name}<span>MasterGrowbot customer</span></figcaption></figure>;
  return <section ref={section} id="customer-experiences" className="premium-wrap app-customer-feedback" aria-labelledby="app-feedback-title">
    <div className="feedback-heading"><div><p className="premium-eyebrow">GROWERS. THEIR WORDS.</p>
    <h2 id="app-feedback-title">More confidence.<br/><em>From the first grow.</em></h2></div><AppRating /></div>
    <div className="app-feedback-grid">{feedback.map(quoteCard)}</div>
    <div className="app-feedback-action"><p>Customer feedback also featured in the app’s onboarding. Individual experiences; AI results vary.</p><AppActions location="homepage_customer_feedback" trial /></div>
    <p className="premium-fine">Free download. Photo analysis and journal tools require Pro. Eligible new Pro subscribers: 3 days free. Subscriptions renew unless canceled. Check your store for terms.</p>
  </section>;
}
