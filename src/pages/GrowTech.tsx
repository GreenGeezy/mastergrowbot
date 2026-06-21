import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Leaf, Mail, Star, X } from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNav from "@/components/landing/LandingNav";
import ParticleBackground from "@/components/landing/ParticleBackground";
import SEOHead from "@/components/SEOHead";

type GrowTechProduct = {
  name: string;
  badge: string;
  price: string;
  shortDescription: string;
  fullDescription: string;
  bestFor: string[];
  buttonLabel: string;
  image: string;
  alt: string;
};

const products: GrowTechProduct[] = [
  {
    name: "MasterGrowbot AI Scout Camera 10-20X",
    badge: "Premium",
    price: "$149",
    shortDescription: "The premium phone camera lens for better MasterGrowbot AI plant scans.",
    fullDescription:
      "Capture sharper close-up photos of leaves, stems, buds, pest damage, trichomes, and plant health symptoms without losing the full plant context your AI analysis needs.",
    bestFor: [
      "AI plant health scans",
      "Leaf and bud closeups",
      "Pest and disease photos",
      "Grow journal documentation",
      "Better photos before asking MasterGrowbot AI",
    ],
    buttonLabel: "Notify Me",
    image: "/images/grow-tech/ai-scout-camera-10-20x.png",
    alt: "MasterGrowbot AI Scout Camera 10-20X clipped onto a smartphone for cannabis plant close-up scans.",
  },
  {
    name: "MasterGrowbot AI Climate Sensor",
    badge: "Environment",
    price: "$89",
    shortDescription: "Track grow-room temperature and humidity for better MasterGrowbot AI plant guidance.",
    fullDescription:
      "Track temperature and humidity so MasterGrowbot AI users can add better grow-room context to plant health scans, watering decisions, mold-risk checks, and flower-stage monitoring.",
    bestFor: [
      "Temperature tracking",
      "Humidity tracking",
      "Mold-risk context",
      "Flower-stage monitoring",
      "Better AI grow guidance",
    ],
    buttonLabel: "Notify Me",
    image: "/images/grow-tech/climate-sensor.png",
    alt: "MasterGrowbot AI Climate Sensor tracking temperature and humidity in an indoor cannabis grow tent.",
  },
  {
    name: "MasterGrowbot AI Root Zone Meter",
    badge: "Root Data",
    price: "$49",
    shortDescription: "A simple root-zone meter for better watering decisions and stronger AI grow context.",
    fullDescription:
      "Check soil moisture and root-zone conditions before asking MasterGrowbot AI for plant health guidance. Designed to help growers reduce guesswork around watering, overwatering risk, seedlings, veg plants, and grow journal notes.",
    bestFor: [
      "Watering decisions",
      "Root-zone checks",
      "Overwatering prevention",
      "Seedlings and veg plants",
      "Better grow journal notes",
    ],
    buttonLabel: "Notify Me",
    image: "/images/grow-tech/root-zone-meter.png",
    alt: "MasterGrowbot AI Root Zone Meter checking soil moisture in a cannabis fabric pot.",
  },
];

const bundle: GrowTechProduct = {
  name: "MasterGrowbot AI Grow Tech Kit",
  badge: "Best Setup",
  price: "$249",
  shortDescription:
    "Includes the MasterGrowbot AI Scout Camera 10-20X, MasterGrowbot AI Climate Sensor, and MasterGrowbot AI Root Zone Meter for growers who want better photos, better grow data, and better AI plant guidance.",
  fullDescription:
    "Includes the MasterGrowbot AI Scout Camera 10-20X, MasterGrowbot AI Climate Sensor, and MasterGrowbot AI Root Zone Meter for growers who want better photos, better grow data, and better AI plant guidance.",
  bestFor: [
    "Complete AI scan setup",
    "Better plant photos",
    "Grow-room climate tracking",
    "Root-zone context",
    "Premium grow documentation",
  ],
  buttonLabel: "Join Bundle Waitlist",
  image: "/images/grow-tech/grow-tech-kit.png",
  alt: "MasterGrowbot AI Grow Tech Kit with camera lens, climate sensor, and root-zone meter.",
};

const useCases = [
  {
    title: "Better close-up plant scans",
    text: "Capture clearer leaf, bud, and pest photos before uploading them into MasterGrowbot AI.",
  },
  {
    title: "More useful grow context",
    text: "Pair plant photos with root-zone and climate notes so the AI has better information to work with.",
  },
  {
    title: "Less guessing during the grow",
    text: "Use simple grow tech tools to document what changed before small issues become harvest problems.",
  },
];

const educationCards = [
  {
    title: "Better Photos",
    text: "Sharper plant images help MasterGrowbot AI review visible symptoms more clearly.",
  },
  {
    title: "Better Context",
    text: "Root-zone and climate notes help explain what the plant photo alone may not show.",
  },
  {
    title: "Better Decisions",
    text: "Use simple tools to document what changed before small grow issues become bigger problems.",
  },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RatingPreview() {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1" aria-label="Five star early access preview">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
        ))}
      </div>
      <p className="text-xs font-medium text-white/45">Early access preview</p>
    </div>
  );
}

function ProductCard({
  product,
  onNotify,
}: {
  product: GrowTechProduct;
  onNotify: (productName: string) => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-landing-green/35 hover:bg-white/[0.055] hover:shadow-landing-green/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-emerald-950/40 via-black to-black">
        <img
          src={product.image}
          alt={product.alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          width={900}
          height={675}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-landing-green/35 bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-landing-green backdrop-blur">
          {product.badge}
        </span>
        <span className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/65 px-3 py-1 text-xs font-semibold text-white/70 backdrop-blur">
          Coming Soon
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold leading-snug tracking-tight text-white font-sans">
            {product.name}
          </h2>
          <RatingPreview />
          <p className="text-3xl font-semibold text-white">{product.price}</p>
          <p className="text-sm font-medium text-landing-green">{product.shortDescription}</p>
          <p className="text-sm leading-relaxed text-white/58">{product.fullDescription}</p>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Best for</p>
          <ul className="space-y-2">
            {product.bestFor.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-white/62">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-landing-green" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => onNotify(product.name)}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-landing-green px-4 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-landing-green/90 hover:shadow-lg hover:shadow-landing-green/20 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black"
        >
          {product.buttonLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function UseCaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = useCases[activeIndex];

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + useCases.length) % useCases.length);
  };

  return (
    <section id="use-cases" className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">
              Use-case preview
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
              What Growers Will Use It For
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-landing-green/40 hover:text-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green"
              aria-label="Previous use case"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-landing-green/40 hover:text-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green"
              aria-label="Next use case"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Placeholder use case {activeIndex + 1} of {useCases.length}
              </p>
              <h3 className="text-2xl font-semibold text-white font-sans">{active.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-white/60">{active.text}</p>
            </div>
            <div className="flex gap-2">
              {useCases.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-landing-green ${
                    index === activeIndex ? "w-9 bg-landing-green" : "w-2.5 bg-white/20 hover:bg-white/35"
                  }`}
                  aria-label={`Show ${item.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WaitlistModal({
  productName,
  onClose,
}: {
  productName: string | null;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!productName) {
      return;
    }

    setEmail("");
    setError("");
    setSuccess(false);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [productName]);

  useEffect(() => {
    if (!productName) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, productName]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productName) {
      return;
    }

    const normalizedEmail = email.trim();

    if (!emailPattern.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    const lead = {
      email: normalizedEmail,
      interestProduct: productName,
      sourcePage: "/grow-tech",
      sourceForm: "grow_tech_waitlist",
      utm_source: "website",
      utm_medium: "organic",
      utm_campaign: "grow_tech_waitlist",
      utm_content: productName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
    };

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });

      if (!response.ok) {
        if (import.meta.env.DEV && response.status === 404) {
          console.info("Grow Tech newsletter lead (local dev fallback):", lead);
          setSuccess(true);
          setEmail("");
          return;
        }

        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setSuccess(true);
      setEmail("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!productName) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#07110c] p-6 text-white shadow-2xl shadow-landing-green/10 sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="grow-tech-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-landing-green"
          aria-label="Close coming soon modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-landing-green/12 text-landing-green">
          <Mail className="h-5 w-5" aria-hidden="true" />
        </div>

        <h2 id="grow-tech-modal-title" className="text-2xl font-semibold tracking-tight text-white font-sans">
          Coming Soon
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Enter your email and we'll let you know when this MasterGrowbot AI Grow Tech product is ready.
        </p>
        <p className="mt-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/55">
          {productName}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input type="hidden" name="productName" value={productName} />
          <div>
            <label htmlFor="grow-tech-email" className="mb-2 block text-sm font-medium text-white/75">
              Email
            </label>
            <input
              ref={inputRef}
              id="grow-tech-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-black/45 px-4 py-3 text-white placeholder:text-white/30 transition focus:border-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green/40"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "grow-tech-email-error" : undefined}
              required
            />
          </div>

          {error && (
            <p id="grow-tech-email-error" className="text-sm font-medium text-red-300">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg border border-landing-green/30 bg-landing-green/10 px-3 py-2 text-sm font-medium text-landing-green">
              You're on the list. We'll email you when this product is ready.
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-landing-green px-4 py-3 text-sm font-semibold text-black transition hover:bg-landing-green/90 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Notify Me"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-white/70 transition hover:border-white/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-landing-green"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GrowTech() {
  const [selectedProductName, setSelectedProductName] = useState<string | null>(null);

  const productJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [...products, bundle].map((product) => ({
        "@type": "Product",
        name: product.name,
        description: product.shortDescription,
        brand: {
          "@type": "Brand",
          name: "MasterGrowbot AI",
        },
        image: `https://www.mastergrowbot.com${product.image}`,
        offers: {
          "@type": "Offer",
          price: product.price.replace("$", ""),
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          url: "https://www.mastergrowbot.com/grow-tech",
        },
      })),
    }),
    [],
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <SEOHead
        title="MasterGrowbot AI Grow Tech | AI Plant Cameras and Grow Tools"
        description="MasterGrowbot AI Grow Tech helps cannabis growers capture better plant photos, track grow-room conditions, monitor root-zone data, and improve AI-assisted plant health analysis."
        canonicalUrl="https://www.mastergrowbot.com/grow-tech"
        ogImage="https://www.mastergrowbot.com/images/grow-tech/grow-tech-kit.png"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      </Helmet>

      <ParticleBackground />
      <LandingNav />

      <main>
        <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-landing-green/25 bg-landing-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-landing-green">
                <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
                Coming soon
              </div>
              <div className="space-y-5">
                <h1 className="text-4xl font-bold leading-[1.06] tracking-tight text-white font-sans sm:text-5xl lg:text-7xl">
                  Grow Tech for Better AI Plant Scans
                </h1>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/62 sm:text-xl lg:mx-0">
                  Upgrade your plant photos, grow-room environment data, and root-zone context with MasterGrowbot
                  AI-ready tools built for serious cannabis growers.
                </p>
              </div>
              <p className="mx-auto max-w-xl text-sm font-medium text-white/45 lg:mx-0">
                Coming soon. Join the waitlist to get notified when MasterGrowbot AI Grow Tech is ready.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={() => setSelectedProductName(bundle.name)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-landing-green px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-landing-green/90 hover:shadow-lg hover:shadow-landing-green/20 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black sm:w-auto"
                >
                  Join the Grow Tech Waitlist
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <a
                  href="#products"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-white/10 px-5 py-3.5 text-sm font-semibold text-white/75 transition hover:border-landing-green/40 hover:text-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green sm:w-auto"
                >
                  Explore Products
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-6 rounded-full bg-landing-green/10 blur-3xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/40 backdrop-blur-xl">
                <img
                  src={bundle.image}
                  alt={bundle.alt}
                  className="aspect-[4/3] w-full object-cover"
                  loading="eager"
                  width={1000}
                  height={750}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-landing-green">Bundle preview</p>
                  <p className="mt-1 text-lg font-semibold text-white">{bundle.name}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">
                Early access hardware
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
                MasterGrowbot AI-ready tools for cleaner scan inputs
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.name} product={product} onNotify={setSelectedProductName} />
              ))}
            </div>
          </div>
        </section>

        <UseCaseCarousel />

        <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 rounded-xl border border-landing-green/20 bg-gradient-to-br from-landing-green/12 via-white/[0.035] to-white/[0.02] p-5 shadow-2xl shadow-landing-green/10 backdrop-blur-xl sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
              <img
                src={bundle.image}
                alt={bundle.alt}
                className="aspect-[4/3] h-full w-full object-cover"
                loading="lazy"
                width={900}
                height={675}
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="mb-3 inline-flex w-fit rounded-full border border-landing-green/35 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-landing-green">
                {bundle.badge}
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">{bundle.name}</h2>
              <RatingPreview />
              <p className="mt-4 text-4xl font-semibold text-white">{bundle.price}</p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/62">{bundle.shortDescription}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {bundle.bestFor.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-white/65">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-landing-green" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setSelectedProductName(bundle.name)}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-landing-green px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-landing-green/90 hover:shadow-lg hover:shadow-landing-green/20 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black sm:w-fit"
              >
                Join Bundle Waitlist
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">
                Better inputs
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
                Why Grow Tech Helps MasterGrowbot AI
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {educationCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-xl shadow-black/20 backdrop-blur-xl"
                >
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-landing-green/12 text-landing-green">
                    <Leaf className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-white font-sans">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 px-4 pb-20 sm:px-6 sm:pb-28">
          <div className="mx-auto max-w-4xl rounded-xl border border-white/[0.08] bg-white/[0.035] p-6 text-sm leading-relaxed text-white/58 backdrop-blur-xl sm:p-8">
            MasterGrowbot AI Grow Tech products help capture better plant images and grow-room context. They do
            not diagnose plant issues by themselves. Upload clear photos and relevant grow details into MasterGrowbot
            AI for plant health analysis and grow guidance.
          </div>
        </section>
      </main>

      <LandingFooter />
      <WaitlistModal productName={selectedProductName} onClose={() => setSelectedProductName(null)} />
    </div>
  );
}
