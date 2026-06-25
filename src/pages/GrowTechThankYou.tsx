import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Mail, PackageCheck, Truck } from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNav from "@/components/landing/LandingNav";
import ParticleBackground from "@/components/landing/ParticleBackground";
import SEOHead from "@/components/SEOHead";
import { appStoreUrl } from "@/components/landing/ctaLinks";

const nextSteps = [
  {
    title: "1. Check Your Email",
    text: "Your Whop receipt and order details are sent to the email address used during checkout.",
    icon: Mail,
  },
  {
    title: "2. Shipment Prepared",
    text: "Your order is prepared through our supplier network using the delivery details entered at checkout.",
    icon: PackageCheck,
  },
  {
    title: "3. Tracking Sent",
    text: "Tracking details and estimated delivery information are emailed after supplier dispatch.",
    icon: Truck,
  },
];

export default function GrowTechThankYou() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <SEOHead
        title="Thank You | MasterGrowbot AI Grow Tech"
        description="Thank you for your MasterGrowbot AI Grow Tech order. Check your email for receipt, order details, and delivery updates."
        canonicalUrl="https://www.mastergrowbot.com/grow-tech/thank-you"
        ogImage="https://www.mastergrowbot.com/images/grow-tech/grow-tech-kit.png"
      />
      <ParticleBackground />
      <LandingNav />

      <main className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-landing-green/20 bg-gradient-to-br from-landing-green/12 via-white/[0.035] to-white/[0.02] p-6 text-center shadow-2xl shadow-landing-green/10 backdrop-blur-xl sm:p-10">
            <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-landing-green/15 text-landing-green">
              <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white font-sans sm:text-5xl">
              Thank you for your MasterGrowbot AI Grow Tech order
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/64">
              Your purchase has been received. Please check the email address you entered at checkout for your receipt,
              order details, and delivery updates.
            </p>
            <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-white/[0.08] bg-black/35 p-5 text-left text-sm leading-relaxed text-white/58">
              <p>
                We are preparing your MasterGrowbot AI Grow Tech order for fulfillment. Once your product ships,
                tracking details and estimated delivery information will be sent to the email address used during
                checkout.
              </p>
              <p className="mt-4">
                Please check your inbox and spam folder so you do not miss important order updates.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-6xl">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">
              What happens next
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
              Order updates from checkout to tracking
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {nextSteps.map(({ title, text, icon: Icon }) => (
              <article
                key={title}
                className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-xl shadow-black/20 backdrop-blur-xl"
              >
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-landing-green/12 text-landing-green">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-white font-sans">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-4xl text-center">
          <p className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-6 text-sm leading-relaxed text-white/60 backdrop-blur-xl">
            Need help with your order? Email{" "}
            <a href="mailto:support@mastergrowbot.com" className="font-semibold text-landing-green hover:underline">
              support@mastergrowbot.com
            </a>{" "}
            and one of our dedicated team members will get back to you shortly to assist you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/grow-tech"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-landing-green px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-landing-green/90 hover:shadow-lg hover:shadow-landing-green/20 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black sm:w-auto"
            >
              Return to Grow Tech
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={appStoreUrl("grow_tech_thank_you")}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/10 px-5 py-3.5 text-sm font-semibold text-white/75 transition hover:border-landing-green/40 hover:text-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green sm:w-auto"
            >
              Open MasterGrowbot AI
            </a>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
