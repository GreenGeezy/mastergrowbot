import { Helmet } from "react-helmet-async";
import {
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
  Sparkles,
  Sprout,
  Store,
  Users,
} from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNav from "@/components/landing/LandingNav";
import SEOHead from "@/components/SEOHead";

export const WHOP_AI_OPPORTUNITY_MAP_URL = "PASTE_WHOP_999_CHECKOUT_LINK_HERE";
export const WHOP_AGENT_BUILDOUT_URL = "PASTE_WHOP_4999_OR_APPLICATION_LINK_HERE";

const bookingRedirectPath = "/ai-strategy/book";
const assetBase = "/images/ai-strategy";

const trustItems = [
  "Award-winning cannabis AI founder",
  "$1M+ enterprise cultivation contracts",
  "Nearly $2M in venture funding",
  "10+ person technical team",
  "Cannabis AI, automation, and machine learning since Grownetics",
];

const proofStatements = [
  "Eli Duffy co-founded and led Grownetics, an early cannabis AI and cultivation technology company.",
  "Grownetics combined hardware, software, sensing, automation, analytics, and machine learning for cannabis cultivation.",
  "Eli raised just under $2M in venture funding.",
  "Eli closed $1M+ in enterprise cultivation contracts/sales.",
  "Eli led a 10+ person technical team.",
  "Grownetics won the University of Colorado New Venture Challenge Information Technology Competition.",
  "Grownetics earned coverage from New Cannabis Ventures, PR Newswire, AgFunderNews, and The Manufacturer.",
];

const testimonials = [
  {
    name: "Dane Matheson",
    role: "Forbes Business Dev Council",
    image: `${assetBase}/dane-testimonial.jpeg`,
    quote:
      "Super proud of our CEO of Grownetics Eli Duffy for speaking at the San Francisco Chamber of Commerce on the future of Canna-business primarily the convergence of Artificial Intelligence and Cannabis.",
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
    title: "Valuable SOPs and data trapped in documents and spreadsheets",
    text: "Cultivation records, training docs, menus, batch notes, and sales follow-up stay buried instead of becoming useful AI context.",
    icon: FileText,
  },
  {
    title: "Teams losing time on repetitive decisions, training, reporting, and follow-up",
    text: "Managers answer the same questions, rewrite the same notes, and manually transfer knowledge that AI can help structure.",
    icon: Users,
  },
];

const offers = [
  {
    title: "Cannabis AI Opportunity Map",
    price: "$899",
    originalPrice: "$999",
    savings: "Save $100",
    scarcity: "Only 1 strategy spot left",
    saleNote: "Limited launch rate for the next cannabis operator ready to map high-value AI opportunities.",
    subtitle: "A 60-minute private strategy call plus a custom 10-page AI roadmap for your cannabis business.",
    includes: [
      "60-minute private strategy session",
      "Custom 10-page AI Opportunity Map",
      "Top 5 AI opportunities ranked by impact and difficulty",
      "Quick-win automations for the next 7 to 30 days",
      "Custom AI agent concepts",
      "Data, SOP, and workflow readiness score",
      "Recommended AI tools and implementation roadmap",
      "Report delivered within 5 business days",
    ],
    cta: "Book $899 AI Opportunity Map",
    href: WHOP_AI_OPPORTUNITY_MAP_URL,
    featured: true,
  },
  {
    title: "Custom Cannabis AI Agent Buildout",
    price: "Starting at $4,499",
    originalPrice: "$4,999",
    savings: "Save $500",
    scarcity: "Only 1 buildout spot left",
    saleNote: "Priority implementation pricing for one cannabis company ready to move from roadmap to agent build.",
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

const reportPages = [
  "Executive AI Opportunity Summary",
  "Business Workflow Snapshot",
  "AI Opportunity Heatmap",
  "Quick-Win Automations",
  "Custom AI Agent Concepts",
  "Data & SOP Readiness Score",
  "Recommended AI Stack",
  "Human Review & Risk Controls",
  "30/60/90-Day Implementation Roadmap",
  "Next-Step Build Plan",
];

const operatorCards = [
  {
    title: "Cultivation",
    icon: Sprout,
    workflows: [
      "AI scouting assistant",
      "Grower SOP assistant",
      "Room-check workflow",
      "IPM decision support",
      "Crop steering notes agent",
    ],
  },
  {
    title: "Extraction",
    icon: FlaskConical,
    workflows: [
      "Batch documentation assistant",
      "Extraction SOP lookup",
      "QA checklist generator",
      "Shift handoff summarizer",
      "Yield variance review agent",
    ],
  },
  {
    title: "Dispensary",
    icon: Store,
    workflows: [
      "Budtender training assistant",
      "Customer FAQ agent",
      "Menu content generator",
      "Review response workflow",
      "Loyalty campaign assistant",
    ],
  },
  {
    title: "Cloning & Breeding",
    icon: Microscope,
    workflows: [
      "Phenotype comparison agent",
      "Mother plant tracking",
      "Clone quarantine workflow",
      "Cultivar documentation",
      "Propagation SOP assistant",
    ],
  },
  {
    title: "Brand & Wholesale",
    icon: Building2,
    workflows: [
      "Wholesale sales follow-up agent",
      "Buyer qualification workflow",
      "CRM note summarizer",
      "Product one-sheet generator",
      "Trade-show lead follow-up",
    ],
  },
  {
    title: "Investor / Consultant",
    icon: Landmark,
    workflows: [
      "AI opportunity due diligence",
      "Portfolio company workflow review",
      "Market positioning",
      "Automation roadmap",
      "Internal knowledge assistant",
    ],
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
      "No. The $899 launch-rate report is designed to show what is practical now, what needs technical support, and what should wait.",
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
      ? "bg-landing-green text-black hover:bg-landing-green/90 hover:shadow-lg hover:shadow-landing-green/20"
      : "border border-white/14 bg-white/[0.03] text-white/82 hover:border-landing-green/45 hover:text-landing-green";

  return (
    <a
      href={href}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black sm:w-auto ${classes}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function HeroSection() {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
      <div className="absolute inset-0 -z-10 opacity-45">
        <img
          src={`${assetBase}/cannabis-ai-strategy-bg.png`}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          width={1600}
          height={900}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020403_0%,rgba(2,4,3,0.9)_38%,rgba(2,4,3,0.64)_100%)]" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(29,185,84,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(29,185,84,0.07)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40" />

      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-landing-green/28 bg-black/55 px-3 py-1 text-xs font-semibold uppercase text-landing-green backdrop-blur">
            <BrainCircuit className="h-3.5 w-3.5" aria-hidden="true" />
            Cannabis AI Advisory
          </div>
          <h1 className="max-w-5xl text-4xl font-bold leading-[1.05] text-white font-sans sm:text-5xl lg:text-7xl">
            Cannabis AI Strategy & Custom Agents
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70 sm:text-xl">
            A private AI strategy sprint for cannabis companies ready to save time, improve workflows, train teams
            faster, and identify the highest-value AI opportunities before wasting money on random tools.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaButton href={WHOP_AI_OPPORTUNITY_MAP_URL}>Book $899 AI Opportunity Map</CtaButton>
            <CtaButton href={WHOP_AGENT_BUILDOUT_URL} variant="secondary">
              Apply for Custom AI Agent Buildout
            </CtaButton>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {trustItems.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-white/[0.08] bg-black/45 p-4 text-sm font-medium leading-relaxed text-white/70 backdrop-blur"
            >
              <Check className="mb-3 h-4 w-4 text-landing-green" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AuthorityVideoSection() {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div>
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
        </div>
        <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-black/55 shadow-2xl shadow-black/45">
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
      </div>
    </section>
  );
}

function SocialProofSection() {
  return (
    <section className="relative z-10 border-y border-white/[0.06] bg-[#030806] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <SectionLabel>Industry Proof</SectionLabel>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
              Cannabis AI credibility with receipts.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/62">
              The strategy sprint is built on years of cannabis technology, cultivation intelligence, venture-backed
              execution, and industry recognition.
            </p>
            <div className="mt-6 overflow-hidden rounded-lg border border-gold/20 bg-black/45">
              <img
                src={`${assetBase}/best-technology-awards.png`}
                alt="University of Colorado Boulder New Venture Challenge Best Technology Awards recognition screenshot."
                className="w-full object-cover"
                loading="lazy"
                width={1171}
                height={675}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {proofStatements.map((statement) => (
              <div key={statement} className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-4">
                <BadgeCheck className="mb-3 h-4 w-4 text-gold" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-white/66">{statement}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.035] shadow-xl shadow-black/20"
            >
              <img
                src={testimonial.image}
                alt={`${testimonial.name} testimonial about Eli Duffy and cannabis AI.`}
                className="w-full object-cover"
                loading="lazy"
                width={520}
                height={520}
              />
              <div className="p-5">
                <p className="text-sm leading-relaxed text-white/68">"{testimonial.quote}"</p>
                <p className="mt-4 text-sm font-semibold text-white">{testimonial.name}</p>
                <p className="mt-1 text-xs text-white/45">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 text-sm text-white/45">Testimonials shown from public/past industry recognition.</p>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <SectionLabel>Why This Exists</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
            Cannabis companies do not need more random AI tools. They need the right AI roadmap.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/64">
            Most cannabis operators know AI matters, but do not know what to build first, what to avoid, or how to turn
            AI into practical value. Generic AI consultants do not understand cultivation, extraction, dispensary
            operations, compliance pressure, SOPs, strain data, grower workflows, or cannabis sales cycles.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {problemCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-6">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-landing-green/20 bg-landing-green/10 text-landing-green">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold leading-snug text-white font-sans">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{card.text}</p>
              </article>
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
        <div className="mb-10 max-w-3xl">
          <SectionLabel>Consulting Offers</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
            Start with strategy. Build only what is worth building.
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {offers.map((offer) => (
            <article
              key={offer.title}
              className={`rounded-lg border p-6 shadow-2xl shadow-black/25 sm:p-8 ${
                offer.featured
                  ? "border-landing-green/35 bg-landing-green/8"
                  : "border-white/[0.08] bg-white/[0.035]"
              }`}
            >
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-gold/35 bg-gold/14 px-3 py-1 text-xs font-bold uppercase text-gold">
                  {offer.savings}
                </span>
                <span className="inline-flex rounded-full border border-landing-green/35 bg-landing-green/12 px-3 py-1 text-xs font-bold uppercase text-landing-green">
                  {offer.scarcity}
                </span>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase text-landing-green">
                    {offer.featured ? "Strategy Sprint" : "Implementation"}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold leading-tight text-white font-sans sm:text-3xl">
                    {offer.title}
                  </h3>
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-black/35 p-4 text-left sm:min-w-48 sm:text-right">
                  <p className="text-xs font-semibold uppercase text-white/42">Launch sale price</p>
                  <div className="mt-1 flex flex-wrap items-end gap-2 sm:justify-end">
                    <p className="text-3xl font-bold text-white font-sans">{offer.price}</p>
                    <p className="pb-1 text-sm font-semibold text-white/38 line-through">{offer.originalPrice}</p>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-gold">{offer.savings} today</p>
                </div>
              </div>
              <p className="mt-4 rounded-lg border border-gold/18 bg-gold/8 p-3 text-sm font-medium leading-relaxed text-white/72">
                {offer.saleNote}
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/66">{offer.subtitle}</p>
              <ul className="mt-6 space-y-3">
                {offer.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/68">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-landing-green" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <CtaButton href={offer.href} variant={offer.featured ? "primary" : "secondary"}>
                  {offer.cta}
                </CtaButton>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 rounded-lg border border-gold/20 bg-gold/8 p-4 text-sm leading-relaxed text-white/68">
          The $899 strategy fee can be credited toward a $4,499 agent buildout if the client moves forward within 7 days
          of receiving the report.
        </p>
      </div>
    </section>
  );
}

function ReportPreviewSection() {
  return (
    <section className="relative z-10 border-y border-white/[0.06] bg-[#020706] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionLabel>Report Preview</SectionLabel>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
              What Your 10-Page AI Opportunity Map Includes
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/62">
              A concise operator-facing roadmap that ranks opportunities, clarifies risk controls, and shows what can
              move in the next 7, 30, 60, and 90 days.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {reportPages.map((page, index) => (
              <div
                key={page}
                className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-4 shadow-inner shadow-white/[0.02]"
              >
                <p className="text-xs font-semibold uppercase text-gold">Page {String(index + 1).padStart(2, "0")}</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-white">{page}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-landing-green/18 bg-landing-green/7 p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-landing-green">AI Opportunity Heatmap</p>
                <h3 className="mt-2 text-xl font-semibold text-white font-sans">Impact vs. difficulty preview</h3>
              </div>
              <LineChart className="h-6 w-6 text-landing-green" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["SOP Assistant", "Sales Follow-up", "QA Checklist", "Room Notes", "Menu Content", "Data Cleanup"].map(
                (item, index) => (
                  <div
                    key={item}
                    className={`min-h-20 rounded-md border p-3 text-xs font-semibold leading-relaxed ${
                      index < 2
                        ? "border-landing-green/35 bg-landing-green/18 text-white"
                        : index < 4
                          ? "border-gold/25 bg-gold/10 text-white/78"
                          : "border-white/10 bg-black/35 text-white/58"
                    }`}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="rounded-lg border border-gold/18 bg-gold/7 p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-gold">30/60/90 Roadmap</p>
                <h3 className="mt-2 text-xl font-semibold text-white font-sans">Sequenced build path</h3>
              </div>
              <Map className="h-6 w-6 text-gold" aria-hidden="true" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["30 days: quick wins", "60 days: prototype", "90 days: team rollout"].map((item) => (
                <div key={item} className="rounded-md border border-white/10 bg-black/35 p-4 text-sm text-white/70">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-5 text-sm text-white/45">
          Sample report preview. Final report is customized to your business type, workflows, tools, and goals.
        </p>
      </div>
    </section>
  );
}

function OperatorSection() {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <SectionLabel>Operator Fit</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
            Built for Every Cannabis Operator
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {operatorCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-6">
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
        <div className="mb-10 max-w-3xl">
          <SectionLabel>Process</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">How it works</h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step} className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-5">
              <p className="text-sm font-semibold text-landing-green">Step {index + 1}</p>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-white/76">{step}</p>
            </li>
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
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="mt-3 text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">Common questions</h2>
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
      <div className="mx-auto max-w-5xl rounded-lg border border-landing-green/24 bg-landing-green/8 p-6 text-center shadow-2xl shadow-black/30 sm:p-10">
        <SectionLabel>Next Step</SectionLabel>
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight text-white font-sans sm:text-4xl">
          Ready to see where AI can actually create value in your cannabis business?
        </h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <CtaButton href={WHOP_AI_OPPORTUNITY_MAP_URL}>Book $899 AI Opportunity Map</CtaButton>
          <CtaButton href={WHOP_AGENT_BUILDOUT_URL} variant="secondary">
            Apply for Agent Buildout
          </CtaButton>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-white/52">
          For legal cannabis businesses, licensed operators, brands, consultants, and investors. AI systems should be
          used with human review and in accordance with applicable laws and regulations.
        </p>
      </div>
    </section>
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
        <SocialProofSection />
        <ProblemSection />
        <OffersSection />
        <ReportPreviewSection />
        <OperatorSection />
        <HowItWorksSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-landing-green/18 bg-black/92 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl sm:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white">AI Opportunity Map: $899</p>
          <a
            href={WHOP_AI_OPPORTUNITY_MAP_URL}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-landing-green px-4 py-2.5 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-landing-green"
          >
            Book $899
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
      <span className="sr-only">Post-purchase booking path: {bookingRedirectPath}</span>
    </div>
  );
}
