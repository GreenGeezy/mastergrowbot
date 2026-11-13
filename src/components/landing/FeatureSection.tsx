import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppActions } from "./HeroSection";
import { appStoreUrl, playStoreUrl } from "./ctaLinks";
import NewsletterSignup from "./NewsletterSignup";
import { appFaqs } from "@/data/appFaqs";
import { trackEvent } from "@/lib/analytics";

const experiences = [
  {
    label: "Plant health",
    title: "A clearer next step starts with a photo.",
    text: "Capture what you see. Get an AI plant health report to help you understand visible symptoms and decide what to investigate next.",
    image: 2,
  },
  {
    label: "Strain library",
    title: "Get to know the genetics in your garden.",
    text: "Explore the strain library or add your own genetics. Premium on iOS expands your library with more strains and breeder information.",
    image: 3,
  },
  {
    label: "Strain intelligence",
    title: "Guidance with your grow in mind.",
    text: "Explore strain-specific information and AI-generated grow tips, then keep your selected plants organized in your garden.",
    image: 4,
  },
  {
    label: "Photo analysis",
    title: "Take a closer look. Keep the bigger picture.",
    text: "Use plant photos alongside your own observations and journal history. AI insights support your judgment as your garden changes.",
    image: 5,
  },
];
export default function FeatureSection() {
  const [active, setActive] = useState(0);
  const item = experiences[active];
  return (
    <>
      <section id="app-plans" className="premium-section premium-wrap">
        <div className="premium-section-heading">
          <div>
            <p className="premium-eyebrow">YOUR NEXT STEP STARTS HERE</p>
            <h2>
              Less guesswork.
              <br />
              <em>A plan for your grow.</em>
            </h2>
          </div>
          <p>
            Download free. Choose your plan in the app.
            <br />
            Start with a 3-day Pro trial if eligible.
          </p>
        </div>
        <p className="premium-fine">One saved plant can pay for a full year. US pricing in USD; choose your platform below.</p>
        <div className="premium-plans all-plans">
          {[
            { name: "Android Pro", platform: "ANDROID", price: "$59.99", alternatives: "$6.99 weekly", monthly: "About $5/month, billed $59.99 yearly.", title: "Your daily grow advantage.", features: ["Understand visible symptoms with AI photo analysis", "Keep your plant observations in one grow journal", "Find your next steps with strain insights and tasks"], href: playStoreUrl("android-pro-plan"), location: "android-pro-plan:android", cta: "Start free trial on Android", premium: false, badge: "Best value" },
            { name: "iPhone Pro", platform: "iPHONE", price: "$99.99", alternatives: "$7.99 weekly", monthly: "About $8.33/month, billed $99.99 yearly.", title: "Less second-guessing. More direction.", features: ["Turn plant photos into practical AI insights", "Track changes in your grow journal", "Get strain intelligence and personalized tasks"], href: appStoreUrl("pro-plan"), location: "pro-plan:ios", cta: "Start free trial on iPhone", premium: false, badge: "3-day free trial" },
            { name: "iPhone Premium", platform: "iPHONE · VIDEO ANALYSIS", price: "$199", alternatives: "$12.99 weekly / $49.99 monthly", monthly: "About $16.58/month, billed $199 yearly.", title: "More angles. A fuller understanding.", features: ["Everything in iPhone Pro", "Record or upload short videos for AI analysis", "Expanded strain library and breeder information"], href: appStoreUrl("premium-plan"), location: "premium-plan:ios", cta: "Get iPhone Premium", premium: true, badge: "Most complete" },
          ].map(plan => <article key={plan.name} className={plan.premium ? "premium-plan-featured" : ""}>
            <p className="plan-badge">{plan.badge}</p><p className="plan-platform-label">{plan.platform}</p>
            <h3>{plan.name}</h3>
            <p className="plan-promise">{plan.title}</p>
            <p className="premium-price">{plan.price}<span> / year</span></p>
            <p className="plan-alternatives">Or {plan.alternatives}</p>
            <p className="plan-value">{plan.monthly}</p>
            <ul>{plan.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
            <a className="premium-button" href={plan.href} data-cta-location={plan.location}>{plan.cta}<ArrowRight size={17} aria-hidden="true" /></a>
            <p className="premium-fine">{plan.premium ? "Premium has no introductory free trial. Renews unless canceled." : "3 days free for eligible new subscribers. Renews at your selected plan price unless canceled."}</p>
          </article>)}
        </div>
        <p className="premium-fine">
          Prices and availability may vary by region and platform. Confirm
          current pricing and terms in your app store. Manage or cancel through
          your store account.
        </p>
      </section>

      <section className="premium-section premium-wrap premium-faq">
        <p className="premium-eyebrow">BEFORE YOU GET STARTED</p>
        <h2>A few good questions.</h2>
        <div>
          {appFaqs.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section
        id="download"
        className="premium-section premium-wrap premium-final"
      >
        <p className="premium-eyebrow">YOUR NEXT GROW STARTS HERE</p>
        <h2>
          Snap a photo.
          <br />
          <em>Save your plant.</em>
        </h2>
        <p className="premium-lead">Your AI master grower, in your pocket. Download MasterGrowbot AI free and start your 3-day Pro trial if eligible.</p>
        <AppActions location="final-download" trial />
        <p className="premium-fine">
          Pro trial for eligible new subscribers. Paid subscription after trial
          unless canceled.
        </p>

      </section>
    </>
  );
}
