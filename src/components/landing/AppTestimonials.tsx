import { Quote } from "lucide-react";
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
  return <section className="premium-wrap app-customer-feedback" aria-labelledby="app-feedback-title">
    <p className="premium-eyebrow">FROM MASTERGROWBOT CUSTOMERS</p>
    <h2 id="app-feedback-title">A second set of eyes.<br/><em>In their own words.</em></h2>
    <div className="app-feedback-grid">{feedback.map(({name, quote}) => <figure key={name}>
      <Quote size={20} aria-hidden="true" />
      <blockquote>“{quote}”</blockquote><figcaption>{name}</figcaption>
    </figure>)}</div>
    <div className="app-feedback-action"><p>Customer feedback also featured in the app’s onboarding. Individual experiences; AI results vary.</p><AppActions location="homepage_customer_feedback" /></div>
  </section>;
}
