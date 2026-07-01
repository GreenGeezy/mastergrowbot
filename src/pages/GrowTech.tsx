import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Copy,
  CreditCard,
  Headphones,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNav from "@/components/landing/LandingNav";
import ParticleBackground from "@/components/landing/ParticleBackground";
import EmbeddedGrowTechCheckout from "@/components/grow-tech/EmbeddedGrowTechCheckout";
import SEOHead from "@/components/SEOHead";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  trackGrowTechBeginCheckout,
  trackGrowTechCheckoutOpened,
  trackGrowTechSelectItem,
} from "@/lib/analytics";

type CheckoutKey =
  | "NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL";

type PlanKey =
  | "NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID";

type GrowTechProduct = {
  name: string;
  displayName?: string;
  productId: string;
  badge: string;
  price: string;
  numericPrice: number;
  salePrice: string;
  description: string;
  whyBuy: string;
  bestFor: string[];
  dataCollected: string;
  comparisonBestFor: string;
  aiHelp: string;
  schemaDescription: string;
  sku: string;
  category: string;
  buttonLabel: string;
  image: string;
  alt: string;
  planKey: PlanKey;
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

const planIds: Record<PlanKey, string | undefined> = {
  NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID,
  NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID,
  NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID,
  NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID,
};

const JULY_PROMO_CODE = "AIGROWTECH";
const JULY_PROMO_COPY = "Valid through July 31";
const INDIVIDUAL_FULL_TOTAL = "$297";
const KIT_SALE_PRICE = "$197.60";
const KIT_FULL_PRICE_SAVINGS = "$99.40";

const products: GrowTechProduct[] = [
  {
    name: "MasterGrowbot AI Scout Camera 10-20X",
    productId: "growtech_scout_camera_10_20x",
    badge: "Premium",
    price: "$149",
    numericPrice: 149,
    salePrice: "$119.20",
    description:
      "Capture sharper close-up photos of leaves, buds, pests, trichomes, and plant symptoms for better inspection, documentation, and grow journal records.",
    whyBuy: "Sharper plant photos for better grow records.",
    bestFor: ["Plant inspection photos", "Leaf and bud closeups", "Pest and disease photos", "Grow journal documentation"],
    dataCollected: "Leaf, bud, pest, and trichome images",
    comparisonBestFor: "Clearer close-up plant photos",
    aiHelp: "Captures clearer close-up photos for inspection, documentation, grow journals, and optional AI-assisted review.",
    schemaDescription:
      "A 10-20X phone camera lens for clearer plant inspection photos, pest documentation, trichome closeups, and grow journal records.",
    sku: "MGB-AI-SCOUT-10-20X",
    category: "Plant health scan camera",
    buttonLabel: "Buy Now",
    image: "/images/grow-tech/ai-scout-camera-10-20x.png",
    alt: "MasterGrowbot AI Scout Camera 10-20X clipped onto a smartphone for cannabis plant close-up scans.",
    planKey: "NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID",
    checkoutKey: "NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL",
  },
  {
    name: "MasterGrowbot AI Environment Monitor",
    productId: "growtech_environment_monitor",
    badge: "Environment Data",
    price: "$89",
    numericPrice: 89,
    salePrice: "$71.20",
    description:
      "Track grow-room temperature, humidity, CO2, and air-quality context so you can document conditions and spot environment changes faster.",
    whyBuy: "Better grow-room context for better decisions.",
    bestFor: ["Temperature monitoring", "Humidity monitoring", "CO2 context", "Air quality checks", "Grow-room records"],
    dataCollected: "Temperature, humidity, CO2, air quality, particulates, VOC context",
    comparisonBestFor: "Grow-room environment context",
    aiHelp: "Adds temperature, humidity, CO2, and air-quality context to grow-room records and troubleshooting notes.",
    schemaDescription:
      "A grow-room environment monitor for tracking temperature, humidity, CO2, and air-quality context for cultivation records.",
    sku: "MGB-AI-ENV-MONITOR",
    category: "Grow room environment monitor",
    buttonLabel: "Buy Now",
    image: "/images/grow-tech/climate-sensor.png",
    alt: "MasterGrowbot AI Environment Monitor tracking air quality, temperature, humidity, and CO2 in an indoor cannabis grow tent.",
    planKey: "NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID",
    checkoutKey: "NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL",
  },
  {
    name: "MasterGrowbot AI Soil Health Meter 6-in-1",
    displayName: "MasterGrowbot AI Soil Health Meter 6-in-1",
    productId: "growtech_soil_health_meter_6_in_1",
    badge: "Soil Data",
    price: "$59",
    numericPrice: 59,
    salePrice: "$47.20",
    description:
      "Check soil moisture, pH, temperature, fertility, light, and humidity context so you can document root-zone and grow conditions more clearly.",
    whyBuy: "Quick soil and light context for grow notes.",
    bestFor: ["Soil moisture checks", "pH context", "Temperature readings", "Light and humidity notes", "Root-zone documentation"],
    dataCollected: "Soil moisture, pH, temperature, fertility, light, air humidity",
    comparisonBestFor: "Soil, light, and root-zone context",
    aiHelp: "Adds soil, light, and root-zone readings to grow notes and watering decisions.",
    schemaDescription:
      "A 6-in-1 soil health meter for checking soil moisture, pH, temperature, fertility, light, and humidity context.",
    sku: "MGB-AI-SOIL-6IN1",
    category: "Soil health meter for cannabis",
    buttonLabel: "Buy Now",
    image: "/images/grow-tech/root-zone-meter.png",
    alt: "MasterGrowbot AI Soil Health Meter 6-in-1 checking soil moisture and plant context in a cannabis fabric pot.",
    planKey: "NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID",
    checkoutKey: "NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL",
  },
];

const bundle: GrowTechProduct = {
  name: "MasterGrowbot AI Grow Tech Kit",
  productId: "growtech_kit",
  badge: "Save $50",
  price: "$247",
  numericPrice: 247,
  salePrice: KIT_SALE_PRICE,
  description:
    "Get the full MasterGrowbot AI Grow Tech setup with the Scout Camera 10-20X, Environment Monitor, and Soil Health Meter 6-in-1. Built for growers who want sharper plant photos, better environment records, and clearer soil and light context in one kit.",
  whyBuy: "The complete grow documentation setup with $50 bundle savings.",
  bestFor: [
    "Complete grow documentation setup",
    "Sharper plant photos",
    "Environment data",
    "Soil and light context",
    "Premium grow records",
  ],
  dataCollected: "Photos, environment data, soil and light context",
  comparisonBestFor: "Complete grow documentation setup",
  aiHelp: "Combines plant photos, environment readings, and soil context into one grow documentation setup.",
  schemaDescription:
    "A cannabis grow hardware kit with a plant inspection camera, environment monitor, and soil health meter for better grow documentation.",
  sku: "MGB-AI-GROW-TECH-KIT",
  category: "Cannabis grow tech kit",
  buttonLabel: "Buy the Kit and Save 20%",
  image: "/images/grow-tech/grow-tech-kit.png",
  alt: "MasterGrowbot AI Grow Tech Kit with camera lens, environment monitor, and soil health meter.",
  planKey: "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID",
  checkoutKey: "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL",
};

const useCases = [
  {
    title: "Better plant inspection photos",
    text: "Capture clearer leaf, bud, pest, and trichome photos for grow records, troubleshooting, and journal updates.",
  },
  {
    title: "Cleaner grow-room records",
    text: "Track temperature, humidity, CO2, and air-quality context so environment changes are easier to document.",
  },
  {
    title: "More useful soil notes",
    text: "Check soil, light, and root-zone context before watering decisions, grow updates, or plant health reviews.",
  },
];

const trustStripItems = [
  { text: "Secure checkout powered by Whop", icon: ShieldCheck },
  { text: "100% free shipping", icon: Truck },
  { text: "Cards, Apple Pay, and local payment methods supported", icon: CreditCard },
  { text: "Tracking sent after supplier dispatch", icon: PackageCheck },
];

const trustCards = [
  {
    title: "Secure Whop Checkout",
    text: "Complete your one-time purchase through Whop's hosted checkout with supported card, Apple Pay, and local payment options.",
    icon: ShieldCheck,
  },
  {
    title: "100% Free Shipping",
    text: "Every MasterGrowbot AI Grow Tech product includes free shipping, with no surprise shipping charge added on the product page.",
    icon: Truck,
  },
  {
    title: "Delivery Details at Checkout",
    text: "Whop asks for your delivery name, address, country, and delivery phone before payment so your order can be fulfilled correctly.",
    icon: CreditCard,
  },
  {
    title: "Tracking After Dispatch",
    text: "After your order ships, tracking details are sent by email or Whop support message.",
    icon: PackageCheck,
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
    text: "Sharper plant images help growers document visible symptoms, pest pressure, trichomes, and plant changes more clearly.",
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

const faqs = [
  {
    question: "How do I use the July sale code?",
    answer:
      "Click Buy Now, choose your GrowTech product, and enter AIGROWTECH in the promo code field at Whop checkout to save 20%. The July sale is valid through July 31.",
  },
  {
    question: "Is the 20% discount automatic?",
    answer: "No. Enter AIGROWTECH in the promo code field at checkout to apply the July sale discount.",
  },
  {
    question: "Where do I enter my shipping address?",
    answer: "Shipping address and delivery details are collected during Whop checkout before payment.",
  },
  {
    question: "When do I get tracking?",
    answer:
      "Tracking is sent by email or Whop support message after supplier dispatch. Tracking can take 24 to 72 hours to update after the carrier receives the package.",
  },
  {
    question: "Do I need another app to use these products?",
    answer:
      "No. The Scout Camera, Environment Monitor, and Soil Health Meter can be used on their own for plant photos, grow-room readings, and grow records. MasterGrowbot AI is optional if you want AI-assisted plant health guidance.",
  },
  {
    question: "Do these tools diagnose plant problems?",
    answer:
      "No. These tools help capture better plant images and grow context. Growers can use the information for inspection, documentation, and troubleshooting. MasterGrowbot AI users can also upload photos and readings into the app for AI-assisted guidance.",
  },
  {
    question: "Do I need to use MasterGrowbot AI to buy these?",
    answer:
      "No. GrowTech products are useful for any cannabis grower who wants better photos, environment readings, soil context, and grow documentation. They also pair well with MasterGrowbot AI if you use the app.",
  },
  {
    question: "Who do I contact for help with my order?",
    answer: "Email support@mastergrowbot.com and one of our dedicated team members will get back to you shortly.",
  },
  {
    question: "What is the return policy?",
    answer:
      "Unused, unopened Grow Tech products may be eligible for return within 30 days of delivery. Customers are responsible for return shipping unless the item arrives damaged or incorrect. Email support@mastergrowbot.com for help.",
  },
];

const supplierDisclosure =
  "Orders are prepared through our supplier network. Shipping speed, packaging, and carrier updates may vary by destination, and tracking details are sent after dispatch.";

const shippingDetails = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: 0,
    currency: "USD",
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "US",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 5,
      unitCode: "DAY",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 7,
      maxValue: 21,
      unitCode: "DAY",
    },
  },
};

const hasMerchantReturnPolicy = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "US",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 30,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/ReturnShippingFees",
};

function RatingLine() {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1" aria-label="Five star product pick">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
        ))}
      </div>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/42">Premium grow-tech pick</p>
    </div>
  );
}

function GrowTechPromoCode({
  compact = false,
  showCopyButton = false,
  className = "",
}: {
  compact?: boolean;
  showCopyButton?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(JULY_PROMO_CODE);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={`inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1.5 text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.08)] ${className}`}
    >
      {!compact && <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Code</span>}
      <span className="rounded-full border border-amber-200/40 bg-black/55 px-3 py-1 text-xs font-black tracking-[0.18em] text-amber-200">
        {JULY_PROMO_CODE}
      </span>
      {showCopyButton && (
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-white/76 transition hover:border-amber-200/45 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-200/60"
        >
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          {copied ? "Copied" : "Copy code"}
        </button>
      )}
    </div>
  );
}

function JulySaleBanner() {
  return (
    <div className="max-w-xl rounded-xl border border-landing-green/25 bg-gradient-to-br from-landing-green/14 via-emerald-950/25 to-amber-300/10 p-4 shadow-2xl shadow-landing-green/10 backdrop-blur-xl lg:mx-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">July GrowTech Sale</p>
          <p className="mt-1 text-lg font-bold text-white font-sans">Save 20% with code {JULY_PROMO_CODE}</p>
          <p className="mt-1 text-sm text-white/58">Use code at Whop checkout. {JULY_PROMO_COPY}.</p>
        </div>
        <GrowTechPromoCode showCopyButton className="shrink-0" />
      </div>
    </div>
  );
}

function PaymentBadges() {
  const badges = ["VISA", "Mastercard", "AMEX", "Apple Pay", "Local Payments"];

  return (
    <div className="mt-3 flex flex-wrap gap-2" aria-label="Supported payment methods">
      {badges.map((badge) => (
        <span
          key={badge}
          className="inline-flex min-h-7 items-center rounded-md border border-white/12 bg-black/45 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white/72 shadow-inner shadow-white/[0.03]"
        >
          {badge === "Mastercard" && (
            <span className="mr-1.5 inline-flex items-center" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="-ml-1 h-2.5 w-2.5 rounded-full bg-amber-300/85" />
            </span>
          )}
          {badge}
        </span>
      ))}
    </div>
  );
}

function TrustBadges() {
  const chips = ["Secure Whop Checkout", "100% Free Shipping", "Tracking After Dispatch", "Order Support Included"];

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip}
          className="inline-flex items-center gap-1.5 rounded-full border border-landing-green/18 bg-landing-green/7 px-2.5 py-1 text-[11px] font-semibold text-white/66"
        >
          <Check className="h-3 w-3 text-landing-green" aria-hidden="true" />
          {chip}
        </span>
      ))}
    </div>
  );
}

function ProductTitle({ product }: { product: GrowTechProduct }) {
  if (product.name !== "MasterGrowbot AI Soil Health Meter 6-in-1") {
    return <>{product.displayName || product.name}</>;
  }

  return (
    <>
      MasterGrowbot AI Soil Health Meter <span className="whitespace-nowrap">6-in-1</span>
    </>
  );
}

function LinkedEmailAnswer({ text }: { text: string }) {
  const email = "support@mastergrowbot.com";

  if (!text.includes(email)) {
    return <>{text}</>;
  }

  const [before, after] = text.split(email);

  return (
    <>
      {before}
      <a href={`mailto:${email}`} className="font-semibold text-landing-green hover:underline">
        {email}
      </a>
      {after}
    </>
  );
}

function CheckoutButton({
  product,
  className = "",
  compact = false,
  showTrust = true,
  ctaLocation = `growtech_page:${product.checkoutKey}`,
}: {
  product: GrowTechProduct;
  className?: string;
  compact?: boolean;
  showTrust?: boolean;
  ctaLocation?: string;
}) {
  const checkoutUrl = checkoutUrls[product.checkoutKey];
  const planId = planIds[product.planKey];
  const canOpenCheckout = Boolean(planId || checkoutUrl);

  const handleOpenCheckout = () => {
    trackGrowTechSelectItem(product, ctaLocation, planId);
    trackGrowTechBeginCheckout(product, ctaLocation, planId);
    trackGrowTechCheckoutOpened(product, ctaLocation, planId);
  };

  if (!canOpenCheckout) {
    return (
      <div className={className}>
        <button
          type="button"
          disabled
          className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold text-white/45"
        >
          {compact ? "Buy the Kit" : product.buttonLabel}
        </button>
        <p className="mt-2 text-xs font-medium text-amber-200/80">Checkout link coming soon.</p>
      </div>
    );
  }

  return (
    <Dialog>
      <div className={className}>
        {!compact && (
          <p className="mb-2 text-center text-xs font-semibold text-amber-100/85 sm:text-left">
            Enter {JULY_PROMO_CODE} at checkout to save 20%.
          </p>
        )}
        <DialogTrigger asChild>
          <button
            type="button"
            data-cta-location={ctaLocation}
            onClick={handleOpenCheckout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-landing-green px-4 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-landing-green/90 hover:shadow-lg hover:shadow-landing-green/20 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black"
          >
            {compact ? "Buy the Kit" : product.buttonLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </DialogTrigger>
        {showTrust && (
          <div className="mt-3 rounded-lg border border-white/[0.08] bg-black/30 p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-white/78">
              <ShieldCheck className="h-4 w-4 text-landing-green" aria-hidden="true" />
              Secure checkout powered by Whop
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/58">
              Shipping address collected at checkout. Tracking sent after dispatch.
            </p>
          </div>
        )}
      </div>
      <DialogContent className="max-h-[94vh] w-[calc(100vw-24px)] max-w-[920px] overflow-y-auto border-landing-green/20 bg-black/95 p-0 text-white shadow-2xl shadow-landing-green/10">
        <div className="p-5 sm:p-6">
          <DialogHeader className="pr-8">
            <DialogTitle className="text-2xl font-bold tracking-tight text-white font-sans">
              Complete Secure Checkout
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-white/58">
              Whop collects payment and delivery details securely before your order is fulfilled.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5">
            <EmbeddedGrowTechCheckout
              product={product}
              planId={planId}
              fallbackCheckoutUrl={checkoutUrl}
              ctaLocation={ctaLocation}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProductCard({ product }: { product: GrowTechProduct }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-landing-green/35 hover:bg-white/[0.055] hover:shadow-landing-green/10">
      <div className="relative aspect-[4/3] min-h-[230px] overflow-hidden bg-gradient-to-br from-emerald-950/40 via-black to-black">
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

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="space-y-4">
          <h2
            className="line-clamp-2 min-h-[3.25rem] text-[1.28rem] font-semibold leading-[1.22] tracking-tight text-white font-sans"
            title={product.name}
          >
            <ProductTitle product={product} />
          </h2>
          <RatingLine />
          <div className="rounded-lg border border-white/[0.08] bg-black/28 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">Regular</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-white/42 line-through">{product.price}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              With code {JULY_PROMO_CODE}
            </p>
            <p className="mt-1 text-4xl font-semibold tracking-tight text-white">{product.salePrice}</p>
            <GrowTechPromoCode compact className="mt-3" />
          </div>
          <p className="min-h-[3.75rem] text-[15px] leading-7 text-white/66">{product.description}</p>
        </div>

        <div className="mt-5 rounded-lg border border-landing-green/15 bg-landing-green/5 p-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-green">Why growers buy it</p>
          <p className="mt-1 text-sm font-medium leading-6 text-white/72">{product.whyBuy}</p>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Best for</p>
          <ul className="space-y-2.5">
            {product.bestFor.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-white/64">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-landing-green" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <CheckoutButton
          product={product}
          className="mt-auto pt-6"
          ctaLocation={`growtech_product_card:${product.productId}`}
        />
        <PaymentBadges />
      </div>
    </article>
  );
}

function HeroTrustStrip() {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] p-3 shadow-xl shadow-black/20 backdrop-blur-xl sm:grid-cols-4">
      {trustStripItems.map(({ text, icon: Icon }) => (
        <div key={text} className="flex items-center gap-2 text-left text-xs font-semibold leading-snug text-white/64">
          <Icon className="h-4 w-4 shrink-0 text-landing-green" aria-hidden="true" />
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}

function TrustSection() {
  return (
    <section className="relative z-10 px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">
            BUY WITH CONFIDENCE
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
            Secure checkout. Free shipping. Clear order updates.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {trustCards.map(({ title, text, icon: Icon }) => (
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
      </div>
    </section>
  );
}

function AnswerSection() {
  const cards = [
    {
      title: "What it helps with",
      text: "Clearer plant photos, grow-room readings, soil context, pest documentation, and more useful grow journal notes.",
    },
    {
      title: "Who it is for",
      text: "Home growers, craft growers, indoor tent growers, caregivers, cultivation teams, and cannabis growers who want better documentation and troubleshooting context.",
    },
    {
      title: "How it works with MasterGrowbot AI",
      text: "Use the tools on their own for grow records, or add the photos and readings into MasterGrowbot AI when you want AI-assisted plant health guidance.",
    },
  ];

  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">
            GROWER-READY HARDWARE
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
            What is MasterGrowbot AI Grow Tech?
          </h2>
          <p className="mt-5 text-base leading-8 text-white/64 sm:text-lg">
            MasterGrowbot AI Grow Tech is a curated set of cannabis grow hardware for growers who want better plant
            photos, cleaner grow-room records, and more useful soil and environment notes. These grow tech tools work as
            standalone grow documentation hardware and can also be paired with MasterGrowbot AI for stronger plant health
            context. The kit brings together a plant inspection camera, a grow room environment monitor, a soil health
            meter for cannabis, grow journal tools, indoor grow tent tools, and AI-compatible grow tools for cleaner
            cannabis cultivation records.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-xl shadow-black/20 backdrop-blur-xl"
            >
              <h3 className="text-xl font-semibold text-white font-sans">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/62">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonTable() {
  const rows = [...products, bundle];

  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">
            Tool comparison
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
            Compare the Grow Tech Tools
          </h2>
        </div>
        <div className="hidden overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/25 backdrop-blur-xl lg:block">
          <table className="w-full border-collapse text-left">
            <thead className="bg-white/[0.04]">
              <tr>
                {["Tool", "Best for", "Data collected", "How growers use it", "Price"].map((header) => (
                  <th key={header} className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/44">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((product) => (
                <tr key={product.name} className="border-t border-white/[0.06]">
                  <td className="px-5 py-5 text-sm font-semibold leading-6 text-white">
                    <ProductTitle product={product} />
                  </td>
                  <td className="px-5 py-5 text-sm leading-6 text-white/64">{product.comparisonBestFor}</td>
                  <td className="px-5 py-5 text-sm leading-6 text-white/64">{product.dataCollected}</td>
                  <td className="px-5 py-5 text-sm leading-6 text-white/64">{product.aiHelp}</td>
                  <td className="px-5 py-5 text-xl font-semibold text-white">{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {rows.map((product) => (
            <article
              key={product.name}
              className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold leading-6 text-white font-sans">
                  <ProductTitle product={product} />
                </h3>
                <p className="shrink-0 text-xl font-semibold text-white">{product.price}</p>
              </div>
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">Best for</dt>
                  <dd className="mt-1 text-sm leading-6 text-white/64">{product.comparisonBestFor}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">Data collected</dt>
                  <dd className="mt-1 text-sm leading-6 text-white/64">{product.dataCollected}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">
                    How growers use it
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-white/64">{product.aiHelp}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
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

function MidPageKitCta() {
  return (
    <section className="relative z-10 px-4 pb-6 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-xl border border-landing-green/20 bg-landing-green/10 p-5 shadow-2xl shadow-landing-green/10 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white font-sans">
            Want the complete grow documentation setup?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/62">
            Save 20% on the full kit this month with code {JULY_PROMO_CODE}.
          </p>
        </div>
        <CheckoutButton
          product={bundle}
          showTrust={false}
          ctaLocation="growtech_midpage_kit:bundle"
          className="sm:w-64"
        />
      </div>
    </section>
  );
}

function BundleSection() {
  return (
    <section id="bundle" className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto mb-8 max-w-7xl">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">
          Best Value Setup
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
          Get the full grow documentation setup for less than buying each tool separately.
        </h2>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 rounded-xl border border-landing-green/25 bg-gradient-to-br from-landing-green/14 via-white/[0.04] to-white/[0.02] p-5 shadow-2xl shadow-landing-green/10 backdrop-blur-xl sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
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
            <span className="inline-flex w-fit rounded-full border border-amber-300/40 bg-amber-300/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
              Best July Deal
            </span>
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
          <div className="mt-5 grid gap-3 rounded-xl border border-white/[0.08] bg-black/30 p-4 sm:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/38">Individual total</p>
              <p className="mt-1 text-2xl font-semibold text-white/60">{INDIVIDUAL_FULL_TOTAL}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-green">Kit price</p>
              <p className="mt-1 text-3xl font-semibold text-white">{bundle.price}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">With code</p>
              <p className="mt-1 text-4xl font-black text-amber-100">{bundle.salePrice}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-green">You save</p>
              <p className="mt-1 text-3xl font-semibold text-landing-green">{KIT_FULL_PRICE_SAVINGS}</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/8 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-white/76">
                You save {KIT_FULL_PRICE_SAVINGS} vs buying separately at full price.
              </p>
              <GrowTechPromoCode compact />
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/62">{bundle.description}</p>
          <div className="mt-5 rounded-lg border border-landing-green/15 bg-landing-green/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-green">Why growers buy it</p>
            <p className="mt-1 text-sm font-medium leading-relaxed text-white/72">{bundle.whyBuy}</p>
          </div>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {bundle.bestFor.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-white/65">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-landing-green" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <CheckoutButton product={bundle} ctaLocation="growtech_bundle_section:bundle" className="mt-7 sm:w-fit" />
          <p className="mt-3 text-sm font-semibold text-amber-100/85">
            Enter {JULY_PROMO_CODE} at Whop checkout to get the July sale price.
          </p>
          <TrustBadges />
          <PaymentBadges />
        </div>
      </div>
    </section>
  );
}

function ShippingSection() {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">Fulfillment</span>
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
        <p className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.035] p-5 text-sm leading-relaxed text-white/58 backdrop-blur-xl">
          {supplierDisclosure}
        </p>
      </div>
    </section>
  );
}

function OrderSupportSection() {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl rounded-xl border border-landing-green/20 bg-white/[0.035] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">ORDER SUPPORT</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
          We keep you updated after purchase
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/64">
          After checkout, you will receive your Whop receipt and MasterGrowbot AI order message. Once your product
          ships, tracking details are sent to the email used during checkout.
        </p>
        <p className="mt-5 flex flex-col gap-2 rounded-lg border border-white/[0.08] bg-black/30 p-4 text-sm leading-relaxed text-white/62 sm:flex-row sm:items-center">
          <Headphones className="h-5 w-5 shrink-0 text-landing-green" aria-hidden="true" />
          <span>
            Need help with your order? Email{" "}
            <a href="mailto:support@mastergrowbot.com" className="font-semibold text-landing-green hover:underline">
              support@mastergrowbot.com
            </a>{" "}
            and one of our dedicated team members will get back to you shortly.
          </span>
        </p>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">QUESTIONS</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
          Grow Tech Order FAQ
        </h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
            >
              <div className="flex gap-3">
                <CircleHelp className="mt-1 h-5 w-5 shrink-0 text-landing-green" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-semibold text-white font-sans">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    <LinkedEmailAnswer text={faq.answer} />
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-landing-green/20 bg-black/88 px-4 py-3 shadow-2xl shadow-landing-green/10 backdrop-blur-xl sm:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">Save 20% with {JULY_PROMO_CODE}</p>
        <CheckoutButton
          product={bundle}
          compact
          showTrust={false}
          ctaLocation="growtech_mobile_sticky:kit"
          className="shrink-0 [&_button]:px-4 [&_button]:py-2.5"
        />
      </div>
    </div>
  );
}

export default function GrowTech() {
  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        ...[...products, bundle].map((product) => ({
          "@type": "Product",
          name: product.name,
          description: product.schemaDescription,
          image: `https://www.mastergrowbot.com${product.image}`,
          sku: product.sku,
          category: product.category,
          brand: {
            "@type": "Brand",
            name: "MasterGrowbot AI",
          },
          offers: {
            "@type": "Offer",
            url: "https://www.mastergrowbot.com/grow-tech",
            priceCurrency: "USD",
            price: product.price.replace("$", ""),
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            shippingDetails,
            hasMerchantReturnPolicy,
          },
        })),
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.mastergrowbot.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Grow Tech",
              item: "https://www.mastergrowbot.com/grow-tech",
            },
          ],
        },
      ],
    }),
    [],
  );

  // TODO: Only add aggregateRating and Review structured data after real customer reviews are collected and displayed visibly on the page.

  return (
    <div className="min-h-screen overflow-x-hidden bg-black pb-24 text-white sm:pb-0">
      <SEOHead
        title="MasterGrowbot AI Grow Tech | Cannabis Grow Hardware and Plant Tools"
        description="Shop MasterGrowbot AI Grow Tech for cannabis grow hardware, plant inspection cameras, environment monitors, soil health meters, and grow documentation tools with secure checkout and free shipping."
        canonicalUrl="https://www.mastergrowbot.com/grow-tech"
        ogImage="https://www.mastergrowbot.com/images/grow-tech/grow-tech-kit.png"
      />
      <Helmet>
        <meta property="og:title" content="MasterGrowbot AI Grow Tech | Cannabis Grow Hardware" />
        <meta
          property="og:description"
          content="Upgrade your grow records with plant inspection cameras, grow-room environment monitors, soil health meters, and AI-compatible grow tools for cannabis cultivators."
        />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
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
                  Grow Tech for Better Plant Data
                </h1>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/62 sm:text-xl lg:mx-0">
                  Upgrade your grow with sharper plant photos, grow-room environment readings, and soil context tools
                  built for cannabis growers who want cleaner records and better decisions.
                </p>
              </div>
              <p className="mx-auto max-w-xl text-sm font-medium text-white/45 lg:mx-0">
                100% free shipping on every MasterGrowbot AI Grow Tech product.
              </p>
              <JulySaleBanner />
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#products"
                  data-cta-location="growtech_page:products"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-landing-green px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-landing-green/90 hover:shadow-lg hover:shadow-landing-green/20 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black sm:w-auto"
                >
                  Shop Grow Tech
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#bundle"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-white/10 px-5 py-3.5 text-sm font-semibold text-white/75 transition hover:border-landing-green/40 hover:text-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green sm:w-auto"
                >
                  Compare the Kit
                </a>
              </div>
              <p className="mx-auto max-w-xl text-sm font-semibold text-amber-100/85 lg:mx-0">
                Save 20% this month with code {JULY_PROMO_CODE}.
              </p>
              <HeroTrustStrip />
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
                    Launch kit pricing
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
                Cannabis grow hardware
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
                Tools for Better Grow Documentation
              </h2>
              <p className="mt-3 text-base leading-relaxed text-white/58">
                Capture clearer plant photos, track environment context, and check soil data for stronger grow records,
                troubleshooting, and cultivation decisions.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
          </div>
        </section>

        <TrustSection />
        <AnswerSection />
        <ComparisonTable />
        <UseCaseCarousel />
        <MidPageKitCta />
        <BundleSection />
        <ShippingSection />
        <OrderSupportSection />

        <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">
                Better inputs
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
                Why Grow Tech Helps Growers
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
            <p className="mt-6 max-w-3xl rounded-xl border border-landing-green/15 bg-landing-green/7 p-5 text-sm leading-relaxed text-white/62">
              MasterGrowbot AI users can also upload GrowTech photos and readings into the app for AI-assisted plant
              health guidance.
            </p>
          </div>
        </section>

        <FaqSection />

        <section className="relative z-10 px-4 pb-20 sm:px-6 sm:pb-28">
          <div className="mx-auto max-w-4xl space-y-5 rounded-xl border border-white/[0.08] bg-white/[0.035] p-6 text-sm leading-relaxed text-white/58 backdrop-blur-xl sm:p-8">
            <p>
              MasterGrowbot AI Grow Tech products help growers capture clearer plant photos, grow-room readings, and
              soil context. They do not diagnose plant issues by themselves and do not replace grower judgment, lab
              testing, or professional cultivation advice. MasterGrowbot AI app users can upload photos and readings into
              the app for AI-assisted plant health guidance.
            </p>
            <p>{supplierDisclosure}</p>
          </div>
        </section>
      </main>

      <LandingFooter />
      <StickyMobileCta />
    </div>
  );
}
