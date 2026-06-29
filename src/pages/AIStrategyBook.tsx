import { ArrowRight, CalendarDays, Clock, ShieldCheck } from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNav from "@/components/landing/LandingNav";
import SEOHead from "@/components/SEOHead";

export const BOOKING_URL = "PASTE_HIDDEN_GOOGLE_CALENDAR_OR_ZOOM_SCHEDULER_LINK_HERE";

export default function AIStrategyBook() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020403] text-white">
      <SEOHead
        title="Book Your Cannabis AI Strategy Call | MasterGrowbot AI"
        description="Schedule your private MasterGrowbot AI Opportunity Map strategy session."
        canonicalUrl="https://www.mastergrowbot.com/ai-strategy/book"
        ogImage="https://www.mastergrowbot.com/images/ai-strategy/cannabis-ai-strategy-bg.png"
      />
      <LandingNav />
      <main className="relative z-10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(29,185,84,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(29,185,84,0.06)_1px,transparent_1px)] bg-[size:42px_42px] opacity-35" />
        <section className="mx-auto max-w-3xl rounded-lg border border-landing-green/24 bg-white/[0.035] p-6 shadow-2xl shadow-black/35 sm:p-10">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-landing-green/25 bg-landing-green/10 text-landing-green">
            <CalendarDays className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase text-landing-green">Purchase Complete</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-5xl">
            Your Cannabis AI Opportunity Map purchase is complete.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/68">
            Use the booking link below to schedule your 60-minute strategy session.
          </p>
          <a
            href={BOOKING_URL}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-landing-green px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-landing-green/90 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black sm:w-auto"
          >
            Schedule My Strategy Call
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/[0.08] bg-black/35 p-4">
              <Clock className="mb-3 h-5 w-5 text-gold" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-white/64">
                Please book at least 72 hours in advance. Sessions are available Monday through Friday, 10 a.m. to 2
                p.m. CT.
              </p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-black/35 p-4">
              <ShieldCheck className="mb-3 h-5 w-5 text-landing-green" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-white/64">
                Keep private SOPs, facility details, and business documents out of shared materials until any requested
                NDA is in place.
              </p>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
