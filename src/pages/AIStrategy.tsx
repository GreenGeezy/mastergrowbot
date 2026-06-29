import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Building2,
  Check,
  ChevronDown,
  FileText,
  FlaskConical,
  Landmark,
  Layers3,
  LineChart,
  Map,
  Microscope,
  Network,
  Quote,
  ShieldCheck,
  Sparkles,
  Sprout,
  Store,
  Users,
} from "lucide-react";
import CannabisGenomeScan from "@/components/landing/CannabisGenomeScan";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNav from "@/components/landing/LandingNav";
import SEOHead from "@/components/SEOHead";

export const WHOP_AI_OPPORTUNITY_MAP_URL = "PASTE_WHOP_999_CHECKOUT_LINK_HERE";
export const WHOP_AGENT_BUILDOUT_URL = "PASTE_WHOP_4999_OR_APPLICATION_LINK_HERE";

const bookingRedirectPath = "/ai-strategy/book";
const assetBase = "/images/ai-strategy";

const heroProof = [
  "Created Growbot, the first cannabis growing app on the Apple App Store",
  "Former CEO of Grownetics",
  "Founder of MasterGrowbot AI, rated 5.0 on the App Store",
  "A decade building cannabis technology and AI companies",
];

const authorityProof = [
  "Created Growbot, the first cannabis growing app on the Apple App Store",
  "Co-founder and former CEO of Grownetics, early cannabis AI cultivation technology",
  "Grownetics combined hardware, software, sensing, automation, and AI for advanced cannabis cultivation",
  "Winner of the University of Colorado New Venture Challenge IT Competition",
  "Founder of MasterGrowbot AI, rated 5.0 on the App Store",
  "A decade building and advising cannabis technology, cultivation, and AI companies",
];

const proofTimeline = [
  { year: "2014", label: "Growbot launches", detail: "First cannabis growing app on the Apple App Store." },
  { year: "2016", label: "Grownetics wins", detail: "CU Boulder New Venture Challenge IT Competition winner." },
  { year: "AI", label: "Cultivation intelligence", detail: "Hardware, sensing, automation, analytics, and AI for cannabis." },
  { year: "Now", label: "MasterGrowbot AI", detail: "AI strategy and tools built around real cannabis workflows." },
];

const testimonials = [
  {
    name: "Dane Matheson",
    role: "Forbes Business Dev Council",
    image: `${assetBase}/dane-testimonial.jpeg`,
    quote:
      "Super proud of our CEO of Grownetics Eli Duffy for speaking at the San Francisco Chamber of Commerce on the future of Canna-business, primarily the convergence of Artificial Intelligence and Cannabis.",
  },
  {
    name: "Sohum J Shah",
    role: "Cannabis Visionary",
    image: `${assetBase}/sohum-testimonial.jpeg`,
    quote:
      "I've been friends with Eli for close to a decade, seeing him lead Grownetics and Visicann to create the 1st ever Machine Learning Algorithms for growing and extracting Cannabis as Founder & CEO. It is fair to say that Eli is the undisputable OG of AI Cannabis.",
  },
  {
    name: "Nic Easley",
    role: "CEO of 3C Consulting",
    image: `${assetBase}/nic-testimonial.jpeg`,
    quote: "Please welcome to the stage Eli Duffy, the Steve Jobs of Cannabis.",
  },
  {
    name: "Saul Kaye",
    role: "Investor & Founder of iCan",
    image: `${assetBase}/saul-testimonial.jpeg`,
    quote: "I think Eli might be the smartest person in Cannabis.",
  },
];

const problemCards = [
  {
    title: "Too many AI tools, no clear priority",
    text: "Separate chatbots, automation apps, and data tools create noise when teams do not know which workflow matters first.",
    icon: Layers3,
  },
  {
    title: "SOPs and data trapped in documents",
    text: "Cultivation records, training docs, menus, batch notes, and sales follow-up stay buried instead of becoming useful AI context.",
    icon: FileText,
  },
  {
    title: "Teams losing time on repetitive work",
    text: "Managers answer the same questions, rewrite the same notes, and manually transfer knowledge that AI can help structure.",
    icon: Users,
  },
];

const offers = [
  {
    eyebrow: "Founder Launch Rate",
    title: "Cannabis AI Opportunity Map",
    price: "$899",
    originalPrice: "$999",
    capacity: "Limited advisory slots",
    subtitle: "A private strategy call plus a custom 10-page AI roadmap for your cannabis business.",
    includes: [
      "Private 60-minute cannabis AI strategy session",
      "Custom 10-page AI Opportunity Map",
      "Top AI opportunities ranked by impact and difficulty",
      "Quick-win automations for the next 7 to 30 days",
      "Custom AI agent concepts",
      "Data, SOP, and workflow readiness score",
      "Recommended tools and implementation roadmap",
      "Report delivered within 5 business days",
    ],
    cta: "Book AI Opportunity Map",
    href: WHOP_AI_OPPORTUNITY_MAP_URL,
    featured: true,
  },
  {
    eyebrow: "Implementation Buildout",
    title: "Custom Cannabis AI Agent Buildout",
    price: "Starting at $4,499",
    originalPrice: "$4,999",
    capacity: "Limited buildout capacity",
    subtitle: "For cannabis companies ready to move from strategy to implementation.",
    includes: [
      "AI agent design workshop",
      "Custom agent architecture",
      "Prompt system and workflow logic",
      "Platform recommendation: OpenAI, Claude, or open-source stack",
      "Prototype or guided implementation",
      "Team training call",
      "Agent operating guide",
      "Two revision rounds",
    ],
    cta: "Apply for Agent Buildout",
    href: WHOP_AGENT_BUILDOUT_URL,
    featured: false,
  },
];

const reportSlides = [
  {
    title: "Cannabis AI Opportunity Map",
    label: "Cover",
    content: ["Business type", "Strategy session summary", "AI roadmap snapshot"],
  },
  {
    title: "Executive AI Opportunity Summary",
    label: "Page 01",
    content: ["Top priorities", "Business impact", "Implementation effort"],
  },
  {
    title: "AI Opportunity Heatmap",
    label: "Page 03",
    content: ["High-impact workflows", "Quick wins", "Technical lift"],
  },
  {
    title: "Custom AI Agent Concepts",
    label: "Page 05",
    content: ["Agent jobs-to-be-done", "Inputs and outputs", "Human review points"],
  },
  {
    title: "Data & SOP Readiness Score",
    label: "Page 06",
    content: ["Document quality", "Data access", "Workflow maturity"],
  },
  {
    title: "Human Review & Risk Controls",
    label: "Page 08",
    content: ["Approval paths", "Compliance boundaries", "Escalation logic"],
  },
  {
    title: "30/60/90-Day Implementation Roadmap",
    label: "Page 09",
    content: ["Quick wins", "Prototype plan", "Team rollout"],
  },
  {
    title: "Next-Step Build Plan",
    label: "Page 10",
    content: ["Recommended buildout", "Tool stack", "Training plan"],
  },
];

const operatorCards = [
  {
    title: "Cultivation",
    icon: Sprout,
    workflows: ["AI scouting assistant", "Grower SOP assistant", "Room-check workflow", "IPM decision support"],
  },
  {
    title: "Extraction",
    icon: FlaskConical,
    workflows: ["Batch documentation assistant", "Extraction SOP lookup", "QA checklist generator", "Yield variance review agent"],
  },
  {
    title: "Dispensary",
    icon: Store,
    workflows: ["Budtender training assistant", "Customer FAQ agent", "Menu content generator", "Review response workflow"],
  },
  {
    title: "Cloning & Breeding",
    icon: Microscope,
    workflows: ["Phenotype comparison agent", "Mother plant tracking", "Clone quarantine workflow", "Propagation SOP assistant"],
  },
  {
    title: "Brand & Wholesale",
    icon: Building2,
    workflows: ["Wholesale sales follow-up agent", "Buyer qualification workflow", "CRM note summarizer", "Trade-show lead follow-up"],
  },
  {
    title: "Investor / Consultant",
    icon: Landmark,
    workflows: ["AI opportunity due diligence", "Portfolio company workflow review", "Automation roadmap", "Internal knowledge assistant"],
  },
];

const steps = [
  "Purchase through Whop",
  "Complete short checkout intake",
  "Book your 60-minute strategy call",
  "Meet with Eli and map your highest-value AI opportunities",
  "Receive your custom 10-page AI Opportunity Map within 5 business days",
];

const faqs = [
  {
    question: "Do I need technical staff?",
    answer:
      "No. The $899 founder launch-rate report is designed to show what is practical now, what needs technical support, and what should wait.",
  },
  {
    question: "Which AI platform should I choose?",
    answer:
      "The report can evaluate OpenAI, Claude, or open-source options based on your workflows, data, budget, and implementation needs.",
  },
  {
    question: "Can you sign an NDA?",
    answer:
      "Yes. If you want Eli to review private SOPs, internal data, menus, facility workflows, or business documents, request an NDA before sharing materials.",
  },
  {
    question: "Is this legal or compliance advice?",
    answer:
      "No. This is AI strategy and workflow consulting. All cannabis businesses are responsible for following local regulations, legal requirements, and compliance policies.",
  },
  {
    question: "Can the $899 be credited toward a custom buildout?",
    answer:
      "Yes. If you move forward within 7 days of receiving your report, the $899 strategy fee can be credited toward the $4,499 Custom Cannabis AI Agent Buildout.",
  },
  {
    question: "What happens after I pay?",
    answer:
      "You will be redirected to a private booking page where you can schedule your 60-minute strategy session. After the call, you will receive your custom report within 5 business days.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold uppercase text-landing-green">{children}</p>;
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.94, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.38, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function CtaButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const classes =
    variant === "primary"
      ? "bg-landing-green text-black shadow-[0_0_30px_rgba(29,185,84,0.22)] hover:bg-landing-green/90 hover:shadow-[0_0_42px_rgba(29,185,84,0.34)]"
      : "border border-white/14 bg-white/[0.035] text-white/82 hover:border-landing-green/45 hover:text-landing-green";

  return (
    <a
      href={href}
      className={`group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg px-5 py-3.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black sm:w-auto ${classes}`}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-0 transition duration-700 group-hover:translate-x-full group-hover:opacity-100" />
      <span className="relative">{children}</span>
      <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
    </a>
  );
}

function HeroSection() {
  return (
    <section className="relative z-10 overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(29,185,84,0.2),transparent_28%),radial-gradient(circle_at_80%_35%,rgba(255,215,0,0.1),transparent_28%),linear-gradient(180deg,#020403_0%,#030806_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(29,185,84,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(29,185,84,0.06)_1px,transparent_1px)] bg-[size:44px_44px] opacity-45 motion-safe:animate-[pulse_7s_ease-in-out_infinite]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#020403] to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <Reveal>
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-landing-green/28 bg-black/55 px-3 py-1 text-xs font-semibold uppercase text-landing-green backdrop-blur">
              <BrainCircuit className="h-3.5 w-3.5" aria-hidden="true" />
              Cannabis AI Advisory
            </div>
            <h1 className="max-w-5xl text-4xl font-bold leading-[1.05] text-white font-sans sm:text-5xl lg:text-7xl">
              Cannabis AI Strategy & Custom Agents
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/72 sm:text-xl">
              A private AI strategy sprint for cannabis companies ready to save time, train teams faster, improve
              workflows, and identify the highest-value AI opportunities before wasting money on random tools.
            </p>
            <div className="mt-6 rounded-lg border border-gold/20 bg-gold/8 p-4 text-sm font-semibold leading-relaxed text-white/72">
              Tomorrow's cannabis winners will not be the companies using the most AI tools. They will be the companies
              that know exactly which workflows to automate first.
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaButton href={WHOP_AI_OPPORTUNITY_MAP_URL}>Book AI Opportunity Map</CtaButton>
              <CtaButton href={WHOP_AGENT_BUILDOUT_URL} variant="secondary">
                Apply for Agent Buildout
              </CtaButton>
            </div>
            <p className="mt-3 text-sm font-medium text-white/48">
              Paid strategy call. Custom 10-page report delivered within 5 business days.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <CannabisGenomeScan />
        </Reveal>
      </div>

      <Reveal className="mx-auto mt-12 grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4" delay={0.2}>
        {heroProof.map((item) => (
          <div
            key={item}
            className="rounded-lg border border-white/[0.08] bg-black/45 p-4 text-sm font-medium leading-relaxed text-white/70 backdrop-blur"
          >
            <Check className="mb-3 h-4 w-4 text-landing-green" aria-hidden="true" />
            {item}
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function AuthorityVideoSection() {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-center">
        <Reveal>
          <SectionLabel>Founder Authority</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
            Built by one of the original cannabis AI pioneers.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/64">
            Watch Eli Duffy present Grownetics, machine learning, and cannabis cultivation intelligence at Boulder
            Theater.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Machine learning for cultivation", "Automation-first cannabis workflows"].map((label) => (
              <div key={label} className="rounded-lg border border-landing-green/18 bg-landing-green/7 p-4">
                <Sparkles className="mb-3 h-4 w-4 text-landing-green" aria-hidden="true" />
                <p className="text-sm font-semibold text-white/78">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-lg border border-white/[0.1] bg-black/55 shadow-2xl shadow-black/45 transition hover:border-landing-green/28">
            <video
              className="aspect-video w-full bg-black object-cover"
              controls
              preload="metadata"
              poster={`${assetBase}/eli-banner-pics.png`}
            >
              <source src={`${assetBase}/eli-duffy-boulder-theater-presentation.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AuthorityProofSection() {
  return (
    <section className="relative z-10 border-y border-white/[0.06] bg-[#030806] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 max-w-3xl">
          <SectionLabel>Award-Winning Cannabis AI Credibility</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
            Authority Ledger
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/62">
            A tighter look at the founder-level proof behind the strategy offer.
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="rounded-lg border border-gold/22 bg-[linear-gradient(145deg,rgba(255,215,0,0.1),rgba(29,185,84,0.05),rgba(255,255,255,0.025))] p-4 shadow-2xl shadow-gold/5">
              <div className="overflow-hidden rounded-md border border-white/[0.08] bg-black/55">
                <img
                  src={`${assetBase}/best-technology-awards.png`}
                  alt="University of Colorado Boulder New Venture Challenge Best Technology Awards recognition."
                  className="w-full object-cover"
                  loading="lazy"
                  width={1171}
                  height={675}
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {proofTimeline.map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/[0.08] bg-black/42 p-4">
                    <p className="text-xs font-bold uppercase text-gold">{item.year}</p>
                    <h3 className="mt-1 text-sm font-semibold text-white">{item.label}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/54">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="grid gap-3 sm:grid-cols-2">
            {authorityProof.map((statement, index) => (
              <motion.div
                key={statement}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-5 shadow-xl shadow-black/15"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <BadgeCheck className="h-5 w-5 text-gold" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase text-white/32">Proof {index + 1}</span>
                </div>
                <p className="text-sm leading-relaxed text-white/70">{statement}</p>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const activeCards = useMemo(() => {
    return [0, 1, 2].map((offset) => testimonials[(index + offset) % testimonials.length]);
  }, [index]);

  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <SectionLabel>Industry Recognition</SectionLabel>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
              What cannabis leaders have said about Eli.
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => setIndex((value) => (value - 1 + testimonials.length) % testimonials.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-white/70 transition hover:border-landing-green/40 hover:text-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => setIndex((value) => (value + 1) % testimonials.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-white/70 transition hover:border-landing-green/40 hover:text-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.28 }}
              className="grid gap-5 md:grid-cols-3"
            >
              {activeCards.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="relative min-h-[300px] overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.035] p-6 shadow-xl shadow-black/20"
                >
                  <img
                    src={testimonial.image}
                    alt={`${testimonial.name} profile source image.`}
                    className="absolute right-4 top-4 h-16 w-16 rounded-full border border-white/12 object-cover object-top opacity-90"
                    loading="lazy"
                    width={96}
                    height={96}
                  />
                  <Quote className="h-8 w-8 text-gold" aria-hidden="true" />
                  <p className="mt-6 pr-12 text-base leading-relaxed text-white/72">"{testimonial.quote}"</p>
                  <div className="mt-6 border-t border-white/[0.08] pt-4">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="mt-1 text-sm text-white/45">{testimonial.role}</p>
                  </div>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-center gap-2" aria-label="Testimonial pagination">
          {testimonials.map((testimonial, dotIndex) => (
            <button
              key={testimonial.name}
              type="button"
              aria-label={`Show testimonial ${dotIndex + 1}`}
              onClick={() => setIndex(dotIndex)}
              className={`h-2.5 rounded-full transition ${
                dotIndex === index ? "w-8 bg-landing-green" : "w-2.5 bg-white/18 hover:bg-white/35"
              }`}
            />
          ))}
        </div>
        <p className="mt-5 text-center text-sm text-white/42">
          Testimonials shown from public/past industry recognition.
        </p>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-4xl">
          <SectionLabel>Why This Exists</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
            Cannabis companies do not need more random AI tools. They need the right AI roadmap.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/64">
            Most cannabis operators know AI matters, but do not know what to build first, what to avoid, or how to turn
            AI into practical value. Generic AI consultants do not understand cultivation, extraction, dispensary
            operations, compliance pressure, SOPs, strain data, grower workflows, or cannabis sales cycles.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {problemCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={index * 0.06}>
                <article className="h-full rounded-lg border border-white/[0.08] bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-landing-green/28">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-landing-green/20 bg-landing-green/10 text-landing-green">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold leading-snug text-white font-sans">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{card.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OffersSection() {
  return (
    <section id="offers" className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 max-w-3xl">
          <SectionLabel>Consulting Offers</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
            Start with strategy. Build only what is worth building.
          </h2>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-2">
          {offers.map((offer, index) => (
            <Reveal key={offer.title} delay={index * 0.08}>
              <article
                className={`relative h-full overflow-hidden rounded-lg border p-6 shadow-2xl shadow-black/25 transition hover:-translate-y-1 sm:p-8 ${
                  offer.featured
                    ? "border-landing-green/35 bg-[linear-gradient(145deg,rgba(29,185,84,0.14),rgba(255,255,255,0.035))]"
                    : "border-white/[0.08] bg-white/[0.035]"
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-landing-green/70 to-transparent" />
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full border border-gold/35 bg-gold/12 px-3 py-1 text-xs font-bold uppercase text-gold">
                    {offer.eyebrow}
                  </span>
                  <span className="inline-flex rounded-full border border-landing-green/35 bg-landing-green/10 px-3 py-1 text-xs font-bold uppercase text-landing-green">
                    {offer.capacity}
                  </span>
                </div>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold leading-tight text-white font-sans sm:text-3xl">
                      {offer.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-white/64">{offer.subtitle}</p>
                  </div>
                  <div className="rounded-lg border border-white/[0.08] bg-black/40 p-4 text-left sm:min-w-52 sm:text-right">
                    <p className="text-xs font-semibold uppercase text-white/42">Launch pricing</p>
                    <p className="mt-1 text-3xl font-bold leading-tight text-white font-sans">{offer.price}</p>
                    <p className="mt-1 text-sm font-semibold text-white/42">
                      Normally <span className="line-through">{offer.originalPrice}</span>
                    </p>
                  </div>
                </div>
                <ul className="mt-7 space-y-3">
                  {offer.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/68">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-landing-green" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <CtaButton href={offer.href} variant={offer.featured ? "primary" : "secondary"}>
                    {offer.cta}
                  </CtaButton>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 rounded-lg border border-gold/20 bg-gold/8 p-4 text-sm leading-relaxed text-white/70">
            Your $899 strategy fee can be credited toward a Custom AI Agent Buildout if you move forward within 7 days
            of receiving your report.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ReportPreviewCarousel() {
  const [index, setIndex] = useState(0);
  const slide = reportSlides[index];

  return (
    <section className="relative z-10 border-y border-white/[0.06] bg-[#020706] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 max-w-3xl">
          <SectionLabel>Preview the AI Opportunity Map</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
            A premium 10-page strategy report customized to your cannabis business, workflows, tools, and goals.
          </h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <Reveal>
            <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-landing-green/24 bg-black/55 p-5 shadow-2xl shadow-black/35">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(29,185,84,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(29,185,84,0.06)_1px,transparent_1px)] bg-[size:30px_30px] opacity-45" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.title}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="relative z-10 flex min-h-[380px] flex-col justify-between rounded-lg border border-white/[0.08] bg-[#04100c]/90 p-6"
                >
                  <div>
                    <div className="mb-8 flex items-center justify-between">
                      <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold uppercase text-gold">
                        {slide.label}
                      </span>
                      <span className="text-xs font-bold uppercase text-white/34">MasterGrowbot AI</span>
                    </div>
                    <h3 className="text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">{slide.title}</h3>
                    <div className="mt-8 grid gap-3">
                      {slide.content.map((item, itemIndex) => (
                        <div key={item} className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-4">
                          <p className="text-xs font-bold uppercase text-landing-green">
                            Module {String(itemIndex + 1).padStart(2, "0")}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white/78">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-2">
                    {["Impact", "Difficulty", "Readiness"].map((item, itemIndex) => (
                      <div key={item} className="rounded-md border border-white/10 bg-black/35 p-3">
                        <p className="text-[10px] font-bold uppercase text-white/36">{item}</p>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-landing-green to-gold"
                            style={{ width: `${48 + itemIndex * 18}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-between rounded-lg border border-white/[0.08] bg-white/[0.035] p-5">
              <div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous report preview"
                    onClick={() => setIndex((value) => (value - 1 + reportSlides.length) % reportSlides.length)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-black/35 text-white/70 transition hover:border-landing-green/40 hover:text-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next report preview"
                    onClick={() => setIndex((value) => (value + 1) % reportSlides.length)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-black/35 text-white/70 transition hover:border-landing-green/40 hover:text-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-5 grid gap-2">
                  {reportSlides.map((item, itemIndex) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setIndex(itemIndex)}
                      className={`rounded-lg border p-3 text-left transition ${
                        itemIndex === index
                          ? "border-landing-green/36 bg-landing-green/10"
                          : "border-white/[0.08] bg-black/24 hover:border-white/18"
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase text-gold">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-white/72">{item.title}</p>
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-5 rounded-lg border border-gold/18 bg-gold/8 p-4 text-sm leading-relaxed text-white/58">
                Sample preview only. Final report is customized after your paid strategy session.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function OperatorSection() {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 max-w-3xl">
          <SectionLabel>Operator Fit</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
            Built for Every Cannabis Operator
          </h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {operatorCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={index * 0.04}>
                <article className="h-full rounded-lg border border-white/[0.08] bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-landing-green/28">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-landing-green/20 bg-landing-green/10 text-landing-green">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-white font-sans">{card.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {card.workflows.map((workflow) => (
                      <li key={workflow} className="flex gap-2 text-sm leading-relaxed text-white/62">
                        <Network className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" aria-hidden="true" />
                        <span>{workflow}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="relative z-10 border-y border-white/[0.06] bg-[#030806] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 max-w-3xl">
          <SectionLabel>Process</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">How it works</h2>
        </Reveal>
        <ol className="grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <Reveal key={step} delay={index * 0.04}>
              <li className="h-full rounded-lg border border-white/[0.08] bg-white/[0.035] p-5">
                <p className="text-sm font-semibold text-landing-green">Step {index + 1}</p>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-white/76">{step}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">Common questions</h2>
        </Reveal>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-white/[0.08] bg-white/[0.035] p-5 open:border-landing-green/25"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-white font-sans">
                {faq.question}
                <ChevronDown className="h-5 w-5 shrink-0 text-landing-green transition group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-white/62">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="relative z-10 px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal>
        <div className="mx-auto max-w-5xl rounded-lg border border-landing-green/24 bg-[linear-gradient(145deg,rgba(29,185,84,0.12),rgba(255,215,0,0.05),rgba(255,255,255,0.025))] p-6 text-center shadow-2xl shadow-black/30 sm:p-10">
          <SectionLabel>Next Step</SectionLabel>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
            Ready to see where AI can actually create value in your cannabis business?
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <CtaButton href={WHOP_AI_OPPORTUNITY_MAP_URL}>Book AI Opportunity Map</CtaButton>
            <CtaButton href={WHOP_AGENT_BUILDOUT_URL} variant="secondary">
              Apply for Agent Buildout
            </CtaButton>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-white/52">
            For legal cannabis businesses, licensed operators, brands, consultants, and investors. AI systems should be
            used with human review and in accordance with applicable laws and regulations.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-landing-green/18 bg-black/92 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl transition duration-300 sm:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Book AI Opportunity Map</p>
          <p className="text-xs text-landing-green">$899 founder launch rate</p>
        </div>
        <a
          href={WHOP_AI_OPPORTUNITY_MAP_URL}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-landing-green px-4 py-2.5 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-landing-green"
        >
          Book
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export default function AIStrategy() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020403] text-white">
      <SEOHead
        title="Cannabis AI Strategy & Custom Agents | MasterGrowbot AI"
        description="Book a private cannabis AI strategy session with Eli Duffy and receive a custom 10-page AI Opportunity Map for your cultivation, extraction lab, dispensary, brand, or cannabis operation."
        canonicalUrl="https://www.mastergrowbot.com/ai-strategy"
        ogImage="https://www.mastergrowbot.com/images/ai-strategy/cannabis-ai-strategy-bg.png"
      />
      <Helmet>
        <meta property="og:title" content="Cannabis AI Strategy & Custom Agents | MasterGrowbot AI" />
        <meta
          property="og:description"
          content="Book a private cannabis AI strategy session with Eli Duffy and receive a custom 10-page AI Opportunity Map for your cultivation, extraction lab, dispensary, brand, or cannabis operation."
        />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <LandingNav />
      <main>
        <HeroSection />
        <AuthorityVideoSection />
        <AuthorityProofSection />
        <TestimonialsCarousel />
        <ProblemSection />
        <OffersSection />
        <ReportPreviewCarousel />
        <OperatorSection />
        <HowItWorksSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
      <MobileStickyCta />
      <span className="sr-only">Post-purchase booking path: {bookingRedirectPath}</span>
    </div>
  );
}
