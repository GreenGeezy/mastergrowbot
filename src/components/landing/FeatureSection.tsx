import { useState } from "react";
import { ArrowRight, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { AppActions } from "./HeroSection";
import { appStoreUrl, playStoreUrl } from "./ctaLinks";
import IPMPlaybookSection from "./IPMPlaybookSection";
import NewsletterSignup from "./NewsletterSignup";
import { appFaqs } from "@/data/appFaqs";
import { trackEvent } from "@/lib/analytics";
import { growTechOfferUrl } from "@/lib/growTechAttribution";

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
  const [platform, setPlatform] = useState<"ios" | "android">(() =>
    typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent) ? "android" : "ios",
  );
  const item = experiences[active];
  return (
    <>
      <section id="app-experience" className="premium-section premium-wrap">
        <div className="premium-section-heading">
          <div>
            <p className="premium-eyebrow">BUILT AROUND YOUR GARDEN</p>
            <h2>
              See more.
              <br />
              <em>Understand more.</em>
            </h2>
          </div>
          <p>
            From your first plant to your next grow.
            <br />
            One place to observe, learn, and keep track.
          </p>
        </div>
        <div className="premium-experience">
          <div className="premium-experience-copy">
            <div
              className="premium-tabs"
              role="group"
              aria-label="Explore app features"
            >
              {experiences.map((entry, index) => (
                <button
                  key={entry.label}
                  aria-pressed={active === index}
                  onClick={() => {
                    setActive(index);
                    trackEvent("app_feature_select", { feature: entry.label });
                  }}
                >
                  {entry.label}
                </button>
              ))}
            </div>
            <div aria-live="polite">
              <p className="premium-eyebrow">
                0{active + 1} / THE APP EXPERIENCE
              </p>
              <h3>{item.title}</h3>
              <p className="premium-lead">{item.text}</p>
            </div>
            <a
              className="premium-text-link"
              href={appStoreUrl("feature-explorer")}
              data-cta-location="feature-explorer:ios"
            >
              Explore on the App Store <ArrowRight size={18} />
            </a>
            <a className="premium-text-link" href={playStoreUrl("feature-explorer")} data-cta-location="feature-explorer:android">Explore on Google Play <ArrowRight size={18} /></a>
            <p className="premium-fine">
              App previews shown. AI analysis can be imperfect; use it alongside
              your own observations.
            </p>
          </div>
          <div className="premium-preview">
            <img
              key={item.image}
              src={`/images/premium/app-${item.image}.webp`}
              alt={`${item.label}: supplied MasterGrowbot app preview`}
              width="700"
              height="1516"
              loading="lazy"
            />
          </div>
        </div>
      </section>
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
        <div className="premium-tabs plan-platforms" role="group" aria-label="Choose pricing platform">
          {(["ios", "android"] as const).map((value) => <button key={value} aria-pressed={platform === value} onClick={() => { setPlatform(value); trackEvent("app_pricing_platform_select", { platform: value }); }}>{value === "ios" ? "iPhone plans" : "Android plans"}</button>)}
        </div>
        <p className="premium-fine">US pricing in USD · {platform === "ios" ? "Apple App Store" : "Google Play"}</p>
        <div aria-live="polite" className={`premium-plans${platform === "android" ? " android-plans" : ""}`}>
          <article>
            <p className="premium-eyebrow">MASTERGROWBOT PRO</p>
            <h3>Turn plant questions into next steps.</h3>
            <p className="premium-price">
              {platform === "ios" ? "$99.99" : "$59.99"} <span>/ year</span>
            </p>
            <p>{platform === "ios" ? "Or $7.99 weekly / $29.99 monthly" : "Or $6.99 weekly"}</p>
            <p className="plan-value">{platform === "ios" ? "About $8.33/month. Billed as $99.99 once a year." : "About $5/month. Billed as $59.99 once a year."}</p>
            <ul>
              <li>Understand visible symptoms with AI photo analysis</li>
              <li>Keep observations together in your grow journal</li>
              <li>Plan your next steps with strain insights and tasks</li>
            </ul>
            <a
              className="premium-button"
              href={platform === "ios" ? appStoreUrl("pro-plan") : playStoreUrl("pro-plan")}
              data-cta-location={`pro-plan:${platform}`}
            >
              Try Pro free for 3 days <ArrowRight size={18} />
            </a>
            <p className="premium-fine">
              Eligible new subscribers only. Renews at your selected plan price
              unless canceled.
            </p>
          </article>
          {platform === "ios" && <article className="premium-plan-featured">
            <p className="premium-eyebrow">
              <Video size={17} /> MASTERGROWBOT PREMIUM
            </p>
            <h3>Give your AI the bigger picture.</h3>
            <p className="premium-price">
              $199 <span>/ year</span>
            </p>
            <p>Or $12.99 weekly / $49.99 monthly</p>
            <ul>
              <li>Everything included in Pro</li>
              <li>Record or upload short plant videos</li>
              <li>More visual context for AI analysis</li>
              <li>Expanded strain library and breeder information on iOS</li>
            </ul>
            <a
              className="premium-button secondary"
              href={appStoreUrl("premium-plan")}
              data-cta-location="premium-plan:ios"
            >
              Explore Premium on iPhone <ArrowRight size={18} />
            </a>
            <p className="premium-fine">
              Premium has no introductory free trial. Subscription renews unless
              canceled.
            </p>
          </article>}
        </div>
        <p className="premium-fine">
          Prices and availability may vary by region and platform. Confirm
          current pricing and terms in your app store. Manage or cancel through
          your store account.
        </p>
      </section>
      <section className="premium-wrap premium-hardware">
        <img
          src="/images/grow-tech/lens-launch/product.webp"
          alt="AI product illustration of the APEXEL macro lens and LED light"
          width="1000"
          height="1000"
          loading="lazy"
        />
        <div>
          <p className="premium-eyebrow">MEET GROWTECH</p>
          <h2>
            Better tools.
            <br />
            <em>A closer look.</em>
          </h2>
          <p>
            Get closer plant photos with the APEXEL 10–20X macro lens and LED light, plus the complete six-file MasterGrowbot digital kit.
          </p>
          <Link
            className="premium-button"
            to={growTechOfferUrl("homepage")}
            data-cta-location="homepage:hardware"
          >
            Explore the $119 lens + guide <ArrowRight size={18} />
          </Link>
          <p className="premium-fine">
            One-time package. Check compatibility and ordering availability.
          </p>
        </div>
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
      <IPMPlaybookSection />
      <section
        id="download"
        className="premium-section premium-wrap premium-final"
      >
        <p className="premium-eyebrow">YOUR NEXT GROW STARTS HERE</p>
        <h2>
          Your next plant check.
          <br />
          <em>A clearer next step.</em>
        </h2>
        <p className="premium-lead">Put AI photo insights and your grow journal in your pocket. Download MasterGrowbot and explore Pro with a 3-day trial if eligible.</p>
        <AppActions location="final-download" trial />
        <p className="premium-fine">
          Pro trial for eligible new subscribers. Paid subscription after trial
          unless canceled.
        </p>
        <NewsletterSignup />
      </section>
    </>
  );
}
