import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Check,
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
  GROWTECH_PRODUCT_IDS,
  getFeaturedGrowTechReview,
  getGrowTechReviewSchema,
  getGrowTechReviews,
  growTechReviewProductOrder,
  type GrowTechProductId,
  type GrowTechTestimonial,
} from "@/data/growTechTestimonials";
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
  trackEvent,
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
  imageWebp?: string;
  imagePng?: string;
  imageWidth?: number;
  imageHeight?: number;
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
const JULY_PROMO_END_MS = Date.UTC(2026, 7, 1);
const IS_JULY_PROMO_ACTIVE = Date.now() < JULY_PROMO_END_MS;
const JULY_PROMO_COPY = "Valid through July 31, 2026";
const INDIVIDUAL_FULL_TOTAL = "$297";
const KIT_SALE_PRICE = "$197.60";
const KIT_FULL_PRICE_SAVINGS = "$99.40";
const INDIVIDUAL_SALE_TOTAL = "$237.60";
const KIT_SALE_SAVINGS = "$40";

function currentPrice(product: GrowTechProduct) {
  return IS_JULY_PROMO_ACTIVE ? product.salePrice : product.price;
}

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
    buttonLabel: "Get the Scout Camera",
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
    buttonLabel: "Get the Environment Monitor",
    image: "/images/grow-tech/climate-sensor.png",
    imageWebp: "/images/grow-tech/generated-review/environment-monitor-grow-tent.webp",
    imagePng: "/images/grow-tech/generated-review/environment-monitor-grow-tent.png",
    imageWidth: 1536,
    imageHeight: 1024,
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
    buttonLabel: "Get the Soil Meter",
    image: "/images/grow-tech/root-zone-meter.png",
    imageWebp: "/images/grow-tech/generated-review/soil-health-meter-root-zone.webp",
    imagePng: "/images/grow-tech/generated-review/soil-health-meter-root-zone.png",
    imageWidth: 1448,
    imageHeight: 1086,
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
  buttonLabel: IS_JULY_PROMO_ACTIVE
    ? `Get the Complete Kit - ${KIT_SALE_PRICE} with code`
    : "Get the Complete Kit",
  image: "/images/grow-tech/grow-tech-kit.png",
  alt: "MasterGrowbot AI Grow Tech Kit with camera lens, environment monitor, and soil health meter.",
  planKey: "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID",
  checkoutKey: "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL",
};

const useCases = [
  {
    title: "Sharper inspection photos",
    text: "Capture clearer leaf, bud, pest, and trichome photos for grow records, troubleshooting, and journal updates.",
  },
  {
    title: "Grow-room condition tracking",
    text: "Track temperature, humidity, CO2, and air-quality context so environment changes are easier to document.",
  },
  {
    title: "Root-zone spot checks",
    text: "Check soil, light, and root-zone context before watering decisions, grow updates, or plant health reviews.",
  },
];

const trustStripItems = [
  { text: "Secure checkout powered by Whop", icon: ShieldCheck },
  { text: "100% free shipping", icon: Truck },
  { text: "Cards and local payment methods supported", icon: CreditCard },
  { text: "Tracking sent after supplier dispatch", icon: PackageCheck },
];

const trustCards = [
  {
    title: "Secure Whop Checkout",
    text: "Complete your one-time purchase through Whop's hosted checkout with supported card and local payment options.",
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

const visibleFaqs = IS_JULY_PROMO_ACTIVE ? faqs : faqs.slice(2);

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
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/42">Premium grow-tech pick</p>
    </div>
  );
}

function getReviewProductId(product: GrowTechProduct): GrowTechProductId | null {
  return Object.values(GROWTECH_PRODUCT_IDS).includes(product.productId as GrowTechProductId)
    ? (product.productId as GrowTechProductId)
    : null;
}

function StarRating({ rating, compact = false }: { rating: number; compact?: boolean }) {
  const roundedRating = Math.max(0, Math.min(5, rating));

  return (
    <div
      className="flex items-center gap-0.5 text-gold"
      aria-label={`${roundedRating} out of 5 stars`}
      title={`${roundedRating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const fillPercent = Math.max(0, Math.min(1, roundedRating - index)) * 100;

        return (
          <span key={index} className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} relative inline-flex`}>
            <Star className="h-full w-full fill-transparent text-white/20" aria-hidden="true" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }} aria-hidden="true">
              <Star className="h-full w-full fill-gold text-gold" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function FeaturedProductReview({ productId }: { productId: GrowTechProductId }) {
  const review = getFeaturedGrowTechReview(productId);
  if (!review) return null;

  return (
    <aside
      className="mt-5 rounded-lg border border-landing-green/18 bg-black/32 p-3.5 shadow-inner shadow-landing-green/[0.03]"
      data-section="growtech-testimonials"
      data-product-id={productId}
      data-review-id={review.id}
      data-reviewer={review.reviewer}
      aria-label={`${review.productName} featured customer review`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-landing-green">Customer Review</p>
        {review.rating ? <StarRating rating={review.rating} compact /> : null}
      </div>
      <blockquote className="mt-3 text-sm font-medium leading-6 text-white/78">"{review.quote}"</blockquote>
      <p className="mt-3 text-sm font-semibold text-white/58">
        {review.reviewer} · {review.location}
      </p>
      <a
        href={`#reviews-${productId}`}
        className="mt-3 inline-flex text-sm font-semibold text-landing-green underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-landing-green"
      >
        Read all {review.productName.replace("MasterGrowbot AI ", "")} reviews
      </a>
    </aside>
  );
}

function ReviewCard({ review }: { review: GrowTechTestimonial }) {
  return (
    <article
      className="rounded-lg border border-white/[0.08] bg-black/32 p-4 shadow-xl shadow-black/10"
      data-section="growtech-testimonials"
      data-product-id={review.productId}
      data-review-id={review.id}
      data-reviewer={review.reviewer}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-landing-green">Customer Review</p>
        {review.rating ? <StarRating rating={review.rating} compact /> : null}
      </div>
      <blockquote className="mt-3 text-[15px] leading-7 text-white/74">"{review.quote}"</blockquote>
      <p className="mt-4 text-sm font-semibold text-white/58">
        {review.reviewer} · {review.location}
      </p>
    </article>
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
  if (!IS_JULY_PROMO_ACTIVE) {
    return (
      <div className="max-w-xl rounded-xl border border-landing-green/25 bg-landing-green/10 p-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-landing-green">Complete 3-Tool Kit</p>
        <p className="mt-1 text-lg font-bold text-white font-sans">One kit. Three practical cultivation tools.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl rounded-xl border border-landing-green/25 bg-gradient-to-br from-landing-green/14 via-emerald-950/25 to-amber-300/10 p-5 text-left shadow-2xl shadow-landing-green/10 backdrop-blur-xl lg:mx-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">Complete 3-Tool Kit</p>
          <p className="mt-2 text-sm text-white/52">Regular individual total <span className="font-semibold line-through">{INDIVIDUAL_FULL_TOTAL}</span></p>
          <p className="mt-1 text-3xl font-black text-white">{KIT_SALE_PRICE}</p>
          <p className="mt-1 text-sm font-semibold text-landing-green">You save {KIT_FULL_PRICE_SAVINGS}</p>
          <p className="mt-2 text-xs leading-5 text-white/54">July price requires code {JULY_PROMO_CODE}. {JULY_PROMO_COPY}.</p>
        </div>
        <GrowTechPromoCode showCopyButton className="shrink-0" />
      </div>
      <ul className="mt-4 grid gap-2 border-t border-white/[0.08] pt-4 text-sm text-white/68 sm:grid-cols-3">
        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-landing-green" aria-hidden="true" />Scout Camera</li>
        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-landing-green" aria-hidden="true" />Environment Monitor</li>
        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-landing-green" aria-hidden="true" />Soil Health Meter</li>
      </ul>
    </div>
  );
}

function PaymentBadges() {
  const badges = ["VISA", "Mastercard", "AMEX", "Local Payments"];

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
    trackEvent("growtech_checkout_open", {
      product_id: product.productId,
      cta_location: ctaLocation,
    });
    trackEvent(
      ctaLocation.startsWith("growtech_hero")
        ? "growtech_hero_cta_click"
        : ctaLocation.includes("product_card")
          ? "growtech_product_cta_click"
          : "growtech_kit_cta_click",
      { product_id: product.productId, cta_location: ctaLocation },
    );
  };

  if (!canOpenCheckout) {
    return (
      <div className={className}>
        <button
          type="button"
          disabled
          className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold text-white/45"
        >
          {compact ? "Get the Kit" : product.buttonLabel}
        </button>
        <p className="mt-2 text-xs font-medium text-amber-200/80">Checkout link coming soon.</p>
      </div>
    );
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        window.dispatchEvent(new CustomEvent("growtech-checkout-state", { detail: { open } }));
        if (!open) {
          trackEvent("growtech_checkout_close", {
            product_id: product.productId,
            cta_location: ctaLocation,
          });
        }
      }}
    >
      <div className={className}>
        {!compact && IS_JULY_PROMO_ACTIVE && (
          <p className="mb-2 text-center text-xs font-semibold text-amber-100/85 sm:text-left">
            Enter {JULY_PROMO_CODE} at checkout to save 20%.
          </p>
        )}
        <DialogTrigger asChild>
          <button
            type="button"
            data-cta-location={ctaLocation}
            onClick={handleOpenCheckout}
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-landing-green via-emerald-300 to-lime-300 px-5 py-6 text-base font-black text-black shadow-[0_0_30px_rgba(34,197,94,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_46px_rgba(34,197,94,0.68)] focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-black"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition duration-700 group-hover:translate-x-full group-hover:opacity-100" />
            <span className="relative">{compact ? "Get the Kit" : product.buttonLabel}</span>
            <ArrowRight className="relative h-4 w-4" aria-hidden="true" />
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
              promoActive={IS_JULY_PROMO_ACTIVE}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProductCard({ product }: { product: GrowTechProduct }) {
  const reviewProductId = getReviewProductId(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-landing-green/35 hover:bg-white/[0.055] hover:shadow-landing-green/10">
      <div className="relative aspect-[4/3] min-h-[230px] overflow-hidden bg-gradient-to-br from-emerald-950/40 via-black to-black">
        <picture>
          {product.imageWebp ? <source srcSet={product.imageWebp} type="image/webp" /> : null}
          <img
            src={product.imagePng || product.image}
            alt={product.alt}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            loading="lazy"
            width={product.imageWidth || 900}
            height={product.imageHeight || 675}
          />
        </picture>
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
          <div className="rounded-lg border border-white/[0.08] bg-black/28 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">Regular</p>
            <p className={`mt-1 text-2xl font-semibold tracking-tight ${IS_JULY_PROMO_ACTIVE ? "text-white/42 line-through" : "text-white"}`}>
              {product.price}
            </p>
            {IS_JULY_PROMO_ACTIVE ? (
              <>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                  July price with code {JULY_PROMO_CODE}
                </p>
                <p className="mt-1 text-4xl font-semibold tracking-tight text-white">{currentPrice(product)}</p>
                <GrowTechPromoCode compact className="mt-3" />
              </>
            ) : null}
          </div>
          <p className="min-h-[3.75rem] text-[15px] leading-7 text-white/66">{product.description}</p>
        </div>

        <div className="mt-5 rounded-lg border border-landing-green/15 bg-landing-green/5 p-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-green">Why growers buy it</p>
          <p className="mt-1 text-sm font-medium leading-6 text-white/72">{product.whyBuy}</p>
        </div>

        {reviewProductId ? <FeaturedProductReview productId={reviewProductId} /> : null}

        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Best for</p>
          <ul className="space-y-2.5">
            {product.bestFor.slice(0, 3).map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-white/64">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-landing-green" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <details className="mt-5 rounded-lg border border-white/[0.08] bg-black/25 p-4 text-sm text-white/62 open:border-landing-green/20">
          <summary className="cursor-pointer font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-landing-green">
            Specifications and compatibility
          </summary>
          <div className="mt-3 space-y-2 leading-6">
            <p><span className="font-semibold text-white/78">Primary output:</span> {product.dataCollected}</p>
            <p>Works independently. MasterGrowbot AI is optional for AI-assisted grow guidance.</p>
            <p>Shipping address is collected in Whop checkout. Tracking is sent after dispatch.</p>
          </div>
        </details>

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

function ProductGridSection() {
  return (
    <section id="products" className="relative z-10 scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">Individual tools</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
            Choose the Tool Your Grow Needs
          </h2>
          <p className="mt-3 text-base leading-7 text-white/64">
            Each tool works independently. Choose one for a specific job, or get all three in the complete kit.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductTestimonialsSection() {
  return (
    <section
      className="relative z-10 px-4 pb-16 sm:px-6 sm:pb-24"
      data-section="growtech-testimonials"
      aria-labelledby="growtech-testimonials-title"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">
            Product-specific proof
          </span>
          <h2
            id="growtech-testimonials-title"
            className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl"
          >
            GrowTech Customers Are Already Seeing Better
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/58">
            Real feedback from growers using the Scout Camera, Environment Monitor, and Soil Health Meter.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {growTechReviewProductOrder.map((productId) => {
            const reviews = getGrowTechReviews(productId);
            const productName = reviews[0]?.productName;
            return (
              <section
                id={`reviews-${productId}`}
                key={productId}
                className="scroll-mt-24 rounded-xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl"
                data-review-group={productId}
                aria-labelledby={`reviews-title-${productId}`}
              >
                <div className="border-b border-white/[0.08] pb-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-landing-green">GrowTech customers</p>
                  <h3 id={`reviews-title-${productId}`} className="mt-2 text-lg font-semibold leading-snug text-white font-sans">
                    {productName}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-gold">
                    {reviews.length} customer {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>
                <div className="mt-4 grid gap-3">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
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
    <section id="comparison" className="relative z-10 scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
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
                {["Tool", "Best for", "Primary output", "Current price"].map((header) => (
                  <th key={header} className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/44">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((product) => (
                <tr key={product.name} className={`border-t border-white/[0.06] ${product === bundle ? "bg-landing-green/[0.08]" : ""}`}>
                  <td className="px-5 py-5 text-sm font-semibold leading-6 text-white">
                    <ProductTitle product={product} />
                  </td>
                  <td className="px-5 py-5 text-sm leading-6 text-white/64">{product.comparisonBestFor}</td>
                  <td className="px-5 py-5 text-sm leading-6 text-white/64">{product.dataCollected}</td>
                  <td className="px-5 py-5 text-xl font-semibold text-white">
                    {currentPrice(product)}
                    {IS_JULY_PROMO_ACTIVE ? <span className="mt-1 block text-xs font-medium text-amber-200">with {JULY_PROMO_CODE}</span> : null}
                  </td>
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
                <p className="shrink-0 text-xl font-semibold text-white">{currentPrice(product)}</p>
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
              </dl>
              {IS_JULY_PROMO_ACTIVE ? <p className="mt-3 text-xs font-semibold text-amber-200">Price shown with {JULY_PROMO_CODE}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCaseCards() {
  return (
    <section id="use-cases" className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">Grow workflows</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">What Growers Use It For</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {useCases.map((item, index) => (
            <article key={item.title} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-xl shadow-black/20">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-landing-green">Use case {index + 1}</p>
              <h3 className="mt-3 text-xl font-semibold text-white font-sans">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/64">{item.text}</p>
            </article>
          ))}
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
          {visibleFaqs.map((faq) => (
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
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const heroCta = document.getElementById("growtech-hero-cta");
    if (!heroCta) return;

    const observer = new IntersectionObserver(([entry]) => setHeroCtaVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(heroCta);

    const handleCheckoutState = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      setCheckoutOpen(Boolean(detail?.open));
    };
    window.addEventListener("growtech-checkout-state", handleCheckoutState);

    return () => {
      observer.disconnect();
      window.removeEventListener("growtech-checkout-state", handleCheckoutState);
    };
  }, []);

  if (heroCtaVisible && !checkoutOpen) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-landing-green/20 bg-black/92 px-4 pt-3 shadow-2xl shadow-landing-green/10 backdrop-blur-xl transition-opacity sm:hidden ${
        checkoutOpen ? "invisible pointer-events-none opacity-0" : "visible opacity-100"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      role="region"
      aria-label="Complete kit purchase"
      aria-hidden={checkoutOpen}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Complete Kit</p>
          <p className="text-xs font-bold text-landing-green">{currentPrice(bundle)}{IS_JULY_PROMO_ACTIVE ? " with code" : ""}</p>
        </div>
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

function WhatIsIncludedSection() {
  return (
    <section className="relative z-10 px-4 py-14 sm:px-6 sm:py-20" aria-labelledby="included-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">Complete kit</span>
          <h2 id="included-title" className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">What is included</h2>
          <p className="mt-3 text-base leading-7 text-white/64">All three tools work independently. MasterGrowbot AI remains optional when you want AI-assisted cultivation guidance.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product, index) => (
            <article key={product.productId} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-landing-green/12 text-sm font-black text-landing-green">{index + 1}</span>
              <h3 className="mt-4 text-lg font-semibold text-white"><ProductTitle product={product} /></h3>
              <p className="mt-2 text-sm leading-6 text-white/62">{product.whyBuy}</p>
            </article>
          ))}
        </div>
        {IS_JULY_PROMO_ACTIVE ? (
          <p className="mt-5 rounded-xl border border-landing-green/20 bg-landing-green/[0.07] p-4 text-sm leading-6 text-white/66">
            With {JULY_PROMO_CODE}, the complete kit is {KIT_SALE_SAVINGS} below the combined current individual
            prices of {INDIVIDUAL_SALE_TOTAL}.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function ProductUseImagerySection() {
  const imagery = [
    {
      name: "Scout Camera",
      src: "/images/grow-tech/ai-scout-camera-10-20x.png",
      alt: "Scout Camera clipped to a smartphone for close cultivation photography",
      width: 1254,
      height: 1254,
    },
    {
      name: "Environment Monitor",
      src: "/images/grow-tech/generated-review/environment-monitor-canopy-detail.webp",
      alt: "Environment Monitor positioned at cannabis canopy level in a grow tent",
      width: 1254,
      height: 1254,
    },
    {
      name: "Soil Health Meter",
      src: "/images/grow-tech/generated-review/soil-meter-probe-detail.webp",
      alt: "Soil Health Meter with two probes inserted into a fabric pot root zone",
      width: 1254,
      height: 1254,
    },
  ];

  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="product-use-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-landing-green">Real-world placement</span>
          <h2 id="product-use-title" className="mt-3 text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">See how each tool fits the grow</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {imagery.map((item) => (
            <figure key={item.name} className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.035]">
              <img src={item.src} alt={item.alt} loading="lazy" width={item.width} height={item.height} className="aspect-square w-full object-cover" />
              <figcaption className="p-4 text-sm font-semibold text-white/74">{item.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function GrowTech() {
  useEffect(() => {
    trackEvent("growtech_page_view", { page_path: "/grow-tech" });
  }, []);

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        ...[...products, bundle].map((product) => ({
          "@type": "Product",
          name: product.name,
          description: product.schemaDescription,
          image: `https://www.mastergrowbot.com${product.imageWebp || product.image}`,
          sku: product.sku,
          category: product.category,
          brand: {
            "@type": "Brand",
            name: "MasterGrowbot AI",
          },
          ...(getReviewProductId(product)
            ? { review: getGrowTechReviewSchema(getReviewProductId(product) as GrowTechProductId) }
            : {}),
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
          mainEntity: visibleFaqs.map((faq) => ({
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
        <section className="relative z-10 isolate overflow-hidden border-b border-white/[0.06] px-4 py-14 sm:px-6 sm:py-20 lg:min-h-[760px] lg:py-24">
          <img
            src="/images/cultivation-command-center-v2.webp"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-30 h-full w-full object-cover object-[70%_center] opacity-30"
            width={1792}
            height={1024}
          />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#010302_0%,rgba(1,3,2,0.96)_43%,rgba(1,3,2,0.58)_78%,#010302_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_42%,rgba(29,185,84,0.18),transparent_34%),linear-gradient(180deg,transparent_60%,#000_100%)]" />

          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-landing-green/25 bg-landing-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-landing-green">
                <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
                The complete GrowTech stack
              </div>
              <div className="space-y-5">
                <h1 className="text-balance text-[2.65rem] font-bold leading-[0.98] tracking-[-0.045em] text-white font-sans sm:text-6xl lg:text-[4.65rem]">
                  Better inputs. Fewer blind spots. <span className="text-landing-green">One smarter grow.</span>
                </h1>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70 sm:text-xl lg:mx-0">
                  Capture sharper cultivation photos, monitor grow-room conditions, and perform quick root-zone spot
                  checks with three practical tools that work independently or alongside the MasterGrowbot AI app.
                </p>
              </div>
              <JulySaleBanner />
              <div id="growtech-hero-cta" className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <CheckoutButton product={bundle} ctaLocation="growtech_hero:bundle" className="sm:w-auto" />
                <a
                  href="#comparison"
                  onClick={() => trackEvent("growtech_compare_click", { cta_location: "growtech_hero" })}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-white/10 px-5 py-3.5 text-sm font-semibold text-white/75 transition hover:border-landing-green/40 hover:text-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green sm:w-auto"
                >
                  Compare Individual Tools
                </a>
              </div>
              <p className="max-w-xl rounded-lg border border-white/[0.08] bg-black/30 px-4 py-3 text-sm leading-6 text-white/62">
                <span className="font-semibold text-gold">5-star Scout Camera feedback from Mike P.</span>{" "}
                <a href={`#reviews-${GROWTECH_PRODUCT_IDS.scoutCamera}`} className="font-semibold text-landing-green underline-offset-4 hover:underline">
                  Read customer reviews
                </a>
              </p>
              <HeroTrustStrip />
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-10 rounded-full bg-landing-green/15 blur-3xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.12] bg-black/45 p-3 shadow-[0_32px_100px_rgba(0,0,0,0.64)] backdrop-blur-xl sm:p-4">
                <div className="mb-3 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-left">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-landing-green">3-tool launch kit</p>
                    <p className="mt-1 text-sm font-semibold text-white">Camera + climate + root-zone data</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/45 line-through">{INDIVIDUAL_FULL_TOTAL}</p>
                    <p className="text-xl font-black text-white">{bundle.salePrice}</p>
                  </div>
                </div>
                <img
                  src={bundle.image}
                  alt={bundle.alt}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                  loading="eager"
                  {...{ fetchpriority: "high" }}
                  width={1000}
                  height={750}
                />
                <div className="absolute inset-x-4 bottom-4 rounded-b-xl bg-gradient-to-t from-black via-black/90 to-transparent p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-landing-green">Everything works standalone or with the app</p>
                  <p className="mt-1 text-lg font-semibold text-white">{bundle.name}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <WhatIsIncludedSection />
        <ComparisonTable />
        <ProductTestimonialsSection />
        <UseCaseCards />
        <ProductUseImagerySection />
        <ProductGridSection />
        <TrustSection />
        <ShippingSection />
        <OrderSupportSection />
        <FaqSection />
        <BundleSection />

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
