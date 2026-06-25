import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Leaf, ShieldCheck, Star, Truck } from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNav from "@/components/landing/LandingNav";
import ParticleBackground from "@/components/landing/ParticleBackground";
import SEOHead from "@/components/SEOHead";

type CheckoutKey =
  | "NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL";

type GrowTechProduct = {
  name: string;
  badge: string;
  price: string;
  description: string;
  bestFor: string[];
  buttonLabel: string;
  image: string;
  alt: string;
  checkoutKey: CheckoutKey;
};

const checkoutUrls: Record<CheckoutKey, string | undefined> = {
  NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL: import.meta.env.NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL,
  NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL:
    import.meta.env.NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL,
  NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL:
    import.meta.env.NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL,
  NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL: import.meta.env.NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL,
};

const products: GrowTechProduct[] = [
  {
    name: "MasterGrowbot AI Scout Camera 10-20X",
    badge: "Premium",
    price: "$149",
    description:
      "Upgrade your plant photos before uploading them into MasterGrowbot AI. The Scout Camera 10-20X clips onto your iPhone or Android phone so you can capture sharper close-up photos of leaves, stems, buds, pest damage, trichomes, and plant health symptoms without losing the full plant context AI analysis needs.",
    bestFor: [
      "AI plant health scans",
      "Leaf and bud closeups",
      "Pest and disease photos",
      "Grow journal documentation",
      "Better photos before asking MasterGrowbot AI",
    ],
    buttonLabel: "Buy Now",
    image: "/images/grow-tech/ai-scout-camera-10-20x.png",
    alt: "MasterGrowbot AI Scout Camera 10-20X clipped onto a smartphone for cannabis plant close-up scans.",
    checkoutKey: "NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL",
  },
  {
    name: "MasterGrowbot AI Environment Monitor",
    badge: "Environment Data",
    price: "$89",
    description:
      "Track grow-room temperature, humidity, CO2, air quality, particulates, and VOC context before asking MasterGrowbot AI for plant health guidance. The Environment Monitor helps growers document grow-room conditions alongside plant photos and grow journal notes.",
    bestFor: [
      "Temperature monitoring",
      "Humidity monitoring",
      "CO2 context",
      "Air quality checks",
      "Better environmental notes for MasterGrowbot AI",
    ],
    buttonLabel: "Buy Now",
    image: "/images/grow-tech/climate-sensor.png",
    alt: "MasterGrowbot AI Environment Monitor tracking air quality, temperature, humidity, and CO2 in an indoor cannabis grow tent.",
    checkoutKey: "NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL",
  },
  {
    name: "MasterGrowbot AI Soil Health Meter 6-in-1",
    badge: "Soil Data",
    price: "$59",
    description:
      "Check soil moisture, pH, temperature, fertility, light, and air humidity context before asking MasterGrowbot AI for plant health guidance. The Soil Health Meter 6-in-1 helps growers document root-zone and environment readings for better grow journal notes, watering decisions, and AI scan context.",
    bestFor: [
      "Soil moisture checks",
      "pH context",
      "Temperature readings",
      "Fertility context",
      "Light and humidity notes",
      "Better grow journal data",
    ],
    buttonLabel: "Buy Now",
    image: "/images/grow-tech/root-zone-meter.png",
    alt: "MasterGrowbot AI Soil Health Meter 6-in-1 checking soil moisture and plant context in a cannabis fabric pot.",
    checkoutKey: "NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL",
  },
];

const bundle: GrowTechProduct = {
  name: "MasterGrowbot AI Grow Tech Kit",
  badge: "Save $50",
  price: "$247",
  description:
    "Get the full MasterGrowbot AI Grow Tech setup with the Scout Camera 10-20X, Environment Monitor, and Soil Health Meter 6-in-1. Built for growers who want better plant photos, better environment data, and better soil and light context for MasterGrowbot AI.",
  bestFor: [
    "Complete AI scan setup",
    "Better plant photos",
    "Environment data",
    "Soil and light context",
    "Premium grow documentation",
  ],
  buttonLabel: "Buy the Kit",
  image: "/images/grow-tech/grow-tech-kit.png",
  alt: "MasterGrowbot AI Grow Tech Kit with camera lens, environment monitor, and soil health meter.",
  checkoutKey: "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL",
};

const useCases = [
  {
    title: "Better close-up plant scans",
    text: "Capture clearer leaf, bud, and pest photos before uploading them into MasterGrowbot AI.",
  },
  {
    title: "More useful grow context",
    text: "Pair plant photos with soil and environment readings so the AI has better information to work with.",
  },
  {
    title: "Less guessing during the grow",
    text: "Use simple grow tech tools to document what changed before small issues become bigger problems.",
  },
];

const shippingCards = [
  {
    title: "1. Enter Delivery Details",
    text: "Whop asks for your delivery details before checkout so your order can be fulfilled correctly.",
  },
  {
    title: "2. Complete Secure Checkout",
    text: "Finish your one-time purchase through Whop's secure checkout.",
  },
  {
    title: "3. Receive Tracking",
    text: "After supplier dispatch, tracking details are sent by email or Whop support message.",
  },
];

const educationCards = [
  {
    title: "Better Photos",
    text: "Sharper plant images help MasterGrowbot AI review visible symptoms more clearly.",
  },
  {
    title: "Better Context",
    text: "Soil and environment readings help explain what the plant photo alone may not show.",
  },
  {
    title: "Better Decisions",
    text: "Use simple tools to document what changed before small grow issues become bigger problems.",
  },
];

function RatingLine() {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1" aria-label="Five star product pick">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
        ))}
      </div>
      <p className="text-xs font-medium text-white/50">Premium grow-tech pick</p>
    </div>
  );
}

function CheckoutButton({ product, className = "" }: { product: GrowTechProduct; className?: string }) {
  const checkoutUrl = checkoutUrls[product.checkoutKey];

  if (!checkoutUrl) {
    return (
      <div className={className}>
        <button
          type="button"
          disabled
          className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold text-white/45"
        >
          {product.buttonLabel}
        </button>
        <p className="mt-2 text-xs font-medium text-amber-200/80">Checkout link coming soon.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <a
        href={checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-landing-green px-4 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-landing-green/90 hover:shadow-lg hover:shadow-landing-green/20 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black"
      >
        {product.buttonLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
      <p className="mt-2 text-xs font-medium text-white/45">
        Shipping details are collected during Whop checkout before payment.
      </p>
    </div>
  );
}

function ProductCard({ product }: { product: GrowTechProduct }) {
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
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-landing-green/30 bg-black/65 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
          <Truck className="h-3.5 w-3.5 text-landing-green" aria-hidden="true" />
          100% Free Shipping
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold leading-snug tracking-tight text-white font-sans">{product.name}</h2>
          <RatingLine />
          <p className="text-3xl font-semibold text-white">{product.price}</p>
          <p className="text-sm leading-relaxed text-white/62">{product.description}</p>
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

        <CheckoutButton product={product} className="mt-auto pt-6" />
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
              Grow workflows
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
              What Growers Use It For
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
                Use case {activeIndex + 1} of {useCases.length}
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

export default function GrowTech() {
  const productJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [...products, bundle].map((product) => ({
        "@type": "Product",
        name: product.name,
        description: product.description,
        brand: {
          "@type": "Brand",
          name: "MasterGrowbot AI",
        },
        image: `https://www.mastergrowbot.com${product.image}`,
        offers: {
          "@type": "Offer",
          price: product.price.replace("$", ""),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
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
        description="Shop MasterGrowbot AI Grow Tech for plant cameras, environment monitors, soil health meters, and better AI-assisted cannabis plant analysis."
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
                Live grow hardware
              </div>
              <div className="space-y-5">
                <h1 className="text-4xl font-bold leading-[1.06] tracking-tight text-white font-sans sm:text-5xl lg:text-7xl">
                  Grow Tech for Better AI Plant Scans
                </h1>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/62 sm:text-xl lg:mx-0">
                  Upgrade your plant photos, grow-room environment data, and soil context with MasterGrowbot AI-ready
                  tools built for serious cannabis growers.
                </p>
              </div>
              <p className="mx-auto max-w-xl text-sm font-medium text-white/45 lg:mx-0">
                100% free shipping on every MasterGrowbot AI Grow Tech product.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#products"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-landing-green px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-landing-green/90 hover:shadow-lg hover:shadow-landing-green/20 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black sm:w-auto"
                >
                  Shop Grow Tech
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
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
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-landing-green">
                    Complete setup
                  </p>
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
                AI-ready grow hardware
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
                Tools for cleaner scan inputs and better grow notes
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.name} product={product} />
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
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="inline-flex w-fit rounded-full border border-landing-green/35 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-landing-green">
                  {bundle.badge}
                </span>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-landing-green/25 bg-black/35 px-3 py-1 text-xs font-semibold text-white/75">
                  <Truck className="h-3.5 w-3.5 text-landing-green" aria-hidden="true" />
                  100% Free Shipping
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">{bundle.name}</h2>
              <div className="mt-3">
                <RatingLine />
              </div>
              <p className="mt-4 text-4xl font-semibold text-white">{bundle.price}</p>
              <p className="mt-2 text-sm font-semibold text-landing-green">
                Individual total is $297. Bundle price is $247.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/62">{bundle.description}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {bundle.bestFor.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-white/65">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-landing-green" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <CheckoutButton product={bundle} className="mt-7 sm:w-fit" />
            </div>
          </div>
        </section>

        <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">
                Fulfillment
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
                How Shipping Works
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {shippingCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-xl shadow-black/20 backdrop-blur-xl"
                >
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-landing-green/12 text-landing-green">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-white font-sans">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{card.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.035] p-5 text-sm leading-relaxed text-white/56 backdrop-blur-xl">
              Orders are fulfilled through third-party suppliers. Packaging, shipping speed, and carrier updates may
              vary. Tracking information will be sent after supplier dispatch.
            </p>
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
          <div className="mx-auto max-w-4xl space-y-5 rounded-xl border border-white/[0.08] bg-white/[0.035] p-6 text-sm leading-relaxed text-white/58 backdrop-blur-xl sm:p-8">
            <p>
              MasterGrowbot AI Grow Tech products help capture better plant images and grow-room context. They do not
              diagnose plant issues by themselves. Upload clear photos and relevant grow details into MasterGrowbot AI
              for plant health analysis and grow guidance.
            </p>
            <p>
              Orders are fulfilled through third-party suppliers. Packaging, shipping speed, and carrier updates may
              vary. Tracking information will be sent after supplier dispatch.
            </p>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
