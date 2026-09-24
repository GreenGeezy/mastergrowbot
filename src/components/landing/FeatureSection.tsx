import { useState } from "react";
import { ArrowRight, Camera, NotebookPen, ScanLine, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { AppActions } from "./HeroSection";
import { appStoreUrl } from "./ctaLinks";
import IPMPlaybookSection from "./IPMPlaybookSection";
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
    text: "Explore 300 strain profiles on iOS, or add your own genetics. Keep the information that matters to your grow close at hand.",
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
      <section className="premium-section premium-light">
        <div className="premium-wrap">
          <p className="premium-eyebrow">A SIMPLE ROUTINE. A BETTER RECORD.</p>
          <h2>Your grow, all in one place.</h2>
          <div className="premium-steps">
            {[
              {
                icon: Camera,
                title: "Capture the moment",
                text: "Take a plant photo when something catches your eye.",
              },
              {
                icon: ScanLine,
                title: "Get another perspective",
                text: "Review AI insights and a shareable plant health report.",
              },
              {
                icon: NotebookPen,
                title: "Keep the story",
                text: "Record notes and photos in your grow journal over time.",
              },
            ].map(({ icon: Icon, title, text }, index) => (
              <article key={title}>
                <div>
                  <Icon size={25} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="app-plans" className="premium-section premium-wrap">
        <div className="premium-section-heading">
          <div>
            <p className="premium-eyebrow">CHOOSE YOUR PERSPECTIVE</p>
            <h2>
              Start with Pro.
              <br />
              <em>See more with Premium.</em>
            </h2>
          </div>
          <p>
            Choose your subscription inside the app.
            <br />
            US iOS pricing shown below.
          </p>
        </div>
        <div className="premium-plans">
          <article>
            <p className="premium-eyebrow">MASTERGROWBOT PRO</p>
            <h3>Your everyday grow companion.</h3>
            <p className="premium-price">
              $99.99 <span>/ year</span>
            </p>
            <p>Or $7.99 weekly / $29.99 monthly</p>
            <ul>
              <li>Photo-based plant analysis</li>
              <li>Grow journal and plant records</li>
              <li>Strain intelligence and personalized tasks</li>
            </ul>
            <a
              className="premium-button"
              href={appStoreUrl("pro-plan")}
              data-cta-location="pro-plan:ios"
            >
              Try Pro free for 3 days <ArrowRight size={18} />
            </a>
            <p className="premium-fine">
              Eligible new subscribers only. Renews at your selected plan price
              unless canceled.
            </p>
          </article>
          <article className="premium-plan-featured">
            <p className="premium-eyebrow">
              <Video size={17} /> MASTERGROWBOT PREMIUM
            </p>
            <h3>A wider view of your plants.</h3>
            <p className="premium-price">
              $199 <span>/ year</span>
            </p>
            <p>Or $12.99 weekly / $49.99 monthly</p>
            <ul>
              <li>Everything included in Pro</li>
              <li>Record or upload short plant videos</li>
              <li>More visual context for AI analysis</li>
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
          </article>
        </div>
        <p className="premium-fine">
          Prices and availability may vary by region and platform. Confirm
          current pricing and terms in your app store. Manage or cancel through
          your store account.
        </p>
      </section>
      <section className="premium-wrap premium-hardware">
        <img
          src="/images/premium/grow-tech-kit.webp"
          alt="GrowTech camera, environment monitor and soil meter product illustration"
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
            Round out your existing setup with a close-up camera, environment
            monitor, and soil meter. Each works independently, with no app
            subscription required.
          </p>
          <Link
            className="premium-button"
            to="/grow-tech"
            data-cta-location="homepage:hardware"
          >
            Explore the $247 kit <ArrowRight size={18} />
          </Link>
          <p className="premium-fine">
            Save $50 versus individual tools. Free US & Canada shipping.
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
          Meet your new
          <br />
          <em>growing companion.</em>
        </h2>
        <AppActions location="final-download" />
        <p className="premium-fine">
          Pro trial for eligible new subscribers. Paid subscription after trial
          unless canceled.
        </p>
        <NewsletterSignup />
      </section>
    </>
  );
}
