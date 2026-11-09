type CheckoutKey =
  | "NEXT_PUBLIC_WHOP_GROW_LIGHT_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_QUICKSTART_GUIDE_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_SCOUT_GUIDE_BUNDLE_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_GROW_TENT_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_2X2_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_4X2_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_2X2_CHECKOUT_URL"
  | "NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_4X2_CHECKOUT_URL";

type PlanKey =
  | "NEXT_PUBLIC_WHOP_GROW_LIGHT_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_QUICKSTART_GUIDE_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_SCOUT_GUIDE_BUNDLE_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_GROW_TENT_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_2X2_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_4X2_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_2X2_PLAN_ID"
  | "NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_4X2_PLAN_ID";

export type GrowTechProduct = {
  name: string;
  displayName?: string;
  productId: string;
  badge: string;
  price: string;
  numericPrice: number;
  salePrice: string;
  regularPrice?: string;
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
  anchorId: string;
  deliveryKind?: "digital" | "hardware-and-digital" | "hardware";
  availability?: "ready" | "paused";
  fulfillmentNote?: string;
  deliveryCountries?: ("US" | "CA")[];
};

/**
 * ALPHAGROW tent + kit Whop mappings (handoff 2026-11-09, GrowTech-Checkout-Map.json).
 * A variant stays unpurchasable until BOTH its plan ID and hosted checkout URL are set,
 * either here (replace undefined) or through the matching NEXT_PUBLIC_WHOP_ALPHAGROW_* env vars.
 * Example: planId: "plan_abc123", hostedUrl: "https://whop.com/checkout/plan_abc123".
 * A hosted URL that points at a different plan is rejected by canPurchaseGrowTech.
 */
const ALPHAGROW_WHOP: Record<"tent2x2" | "tent4x2" | "kit2x2" | "kit4x2", { planId?: string; hostedUrl?: string }> = {
  // Whop product prod_YfI5UpdQIFje9, $119 one-time, created 2026-11-09.
  tent2x2: { planId: import.meta.env.NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_2X2_PLAN_ID || "plan_PxMzYOeaaPocA", hostedUrl: import.meta.env.NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_2X2_CHECKOUT_URL || "https://whop.com/checkout/plan_PxMzYOeaaPocA" },
  // Whop product prod_ZHHsdBHFiDVZY, $149 one-time, created 2026-11-09.
  tent4x2: { planId: import.meta.env.NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_4X2_PLAN_ID || "plan_rjZbj1Z03StYx", hostedUrl: import.meta.env.NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_4X2_CHECKOUT_URL || "https://whop.com/checkout/plan_rjZbj1Z03StYx" },
  kit2x2: { planId: import.meta.env.NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_2X2_PLAN_ID || undefined, hostedUrl: import.meta.env.NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_2X2_CHECKOUT_URL || undefined },
  // Whop product prod_nY9gSqju42aYH, $349 one-time, created 2026-11-09.
  kit4x2: { planId: import.meta.env.NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_4X2_PLAN_ID || "plan_tCjV1Mub9Vvgh", hostedUrl: import.meta.env.NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_4X2_CHECKOUT_URL || "https://whop.com/checkout/plan_tCjV1Mub9Vvgh" },
};

export const checkoutUrls: Record<CheckoutKey, string | undefined> = {
  NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_2X2_CHECKOUT_URL: ALPHAGROW_WHOP.tent2x2.hostedUrl,
  NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_4X2_CHECKOUT_URL: ALPHAGROW_WHOP.tent4x2.hostedUrl,
  NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_2X2_CHECKOUT_URL: ALPHAGROW_WHOP.kit2x2.hostedUrl,
  NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_4X2_CHECKOUT_URL: ALPHAGROW_WHOP.kit4x2.hostedUrl,
  NEXT_PUBLIC_WHOP_GROW_LIGHT_CHECKOUT_URL: "https://whop.com/checkout/plan_iX2bQNjG0dl3j",
  NEXT_PUBLIC_WHOP_GROW_TENT_CHECKOUT_URL: import.meta.env.NEXT_PUBLIC_WHOP_GROW_TENT_CHECKOUT_URL || "https://whop.com/checkout/plan_BkFyLfxmpwIeY",
  NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL: import.meta.env.NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL || "https://whop.com/checkout/plan_ft9q9KbJXeXj6",
  NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL:
    import.meta.env.NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL || "https://whop.com/checkout/plan_Yl4OQwlyNfGBo",
  NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL:
    import.meta.env.NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL || "https://whop.com/checkout/plan_Ob3f8dS6X0TfA",
  NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL: import.meta.env.NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL || "https://whop.com/checkout/plan_jWq4J44VEStQ7",
  NEXT_PUBLIC_WHOP_QUICKSTART_GUIDE_CHECKOUT_URL: import.meta.env.NEXT_PUBLIC_WHOP_QUICKSTART_GUIDE_CHECKOUT_URL || "https://whop.com/checkout/ch_dyvbzcXI9sKPmT8/",
  NEXT_PUBLIC_WHOP_SCOUT_GUIDE_BUNDLE_CHECKOUT_URL: import.meta.env.NEXT_PUBLIC_WHOP_SCOUT_GUIDE_BUNDLE_CHECKOUT_URL || "https://whop.com/checkout/ch_13gOqb4vFDvfXzQ/",
};

export const planIds: Record<PlanKey, string | undefined> = {
  NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_2X2_PLAN_ID: ALPHAGROW_WHOP.tent2x2.planId,
  NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_4X2_PLAN_ID: ALPHAGROW_WHOP.tent4x2.planId,
  NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_2X2_PLAN_ID: ALPHAGROW_WHOP.kit2x2.planId,
  NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_4X2_PLAN_ID: ALPHAGROW_WHOP.kit4x2.planId,
  NEXT_PUBLIC_WHOP_GROW_LIGHT_PLAN_ID: "plan_iX2bQNjG0dl3j",
  NEXT_PUBLIC_WHOP_GROW_TENT_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_GROW_TENT_PLAN_ID || "plan_BkFyLfxmpwIeY",
  NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID || "plan_ft9q9KbJXeXj6",
  NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID || "plan_Yl4OQwlyNfGBo",
  NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID || "plan_Ob3f8dS6X0TfA",
  NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID || "plan_jWq4J44VEStQ7",
  NEXT_PUBLIC_WHOP_QUICKSTART_GUIDE_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_QUICKSTART_GUIDE_PLAN_ID || "plan_0z6oCIxZurR6K",
  NEXT_PUBLIC_WHOP_SCOUT_GUIDE_BUNDLE_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_SCOUT_GUIDE_BUNDLE_PLAN_ID || "plan_AfveSW6CMa60i",
};

export const JULY_PROMO_CODE = "AIGROWTECH";
const JULY_PROMO_END_MS = Date.UTC(2026, 7, 1);
export const IS_JULY_PROMO_ACTIVE = Date.now() < JULY_PROMO_END_MS;
export const JULY_PROMO_COPY = "Valid through July 31, 2026";
export const INDIVIDUAL_FULL_TOTAL = "$297";
export const KIT_SALE_PRICE = "$197.60";
export const KIT_FULL_PRICE_SAVINGS = "$99.40";
export const INDIVIDUAL_SALE_TOTAL = "$237.60";
export const KIT_SALE_SAVINGS = "$40";

export function currentPrice(product: GrowTechProduct) {
  return IS_JULY_PROMO_ACTIVE ? product.salePrice : product.price;
}

export const products: GrowTechProduct[] = [
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
    anchorId: "scout-camera",
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
    anchorId: "environment-monitor",
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
    anchorId: "soil-health-meter",
  },
];

export const bundle: GrowTechProduct = {
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
    : "Get the Complete Kit — $247",
  image: "/images/grow-tech/grow-tech-kit.png",
  alt: "MasterGrowbot AI Grow Tech Kit with camera lens, environment monitor, and soil health meter.",
  planKey: "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID",
  checkoutKey: "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL",
  anchorId: "grow-tech-kit",
};


// Public checkout identifiers verified in Smart Ag AI on October 2, 2026.
// Paid files remain inside the dedicated Whop experience, outside the public website.
export const QUICKSTART_FILES_URL = "https://whop.com/smart-ag-ai/exp_v1pD0nPocHfsir/app/";
export const QUICKSTART_CONTENT_URL = "https://whop.com/smart-ag-ai/exp_5jVDuXepzVkXb7/app/";

export const quickstartGuide: GrowTechProduct = {
  ...products[0],
  name: "GrowTech Equipment Quickstart Guide",
  productId: "growtech_equipment_quickstart",
  badge: "Digital download",
  regularPrice: "$19",
  price: "$9",
  numericPrice: 9,
  salePrice: "$9",
  description: "A 12-page equipment and observation guide, printable worksheets and a CSV log. Take more consistent plant photos, understand reading limitations and keep useful records.",
  whyBuy: "A clear workflow for the tools you already own.",
  bestFor: ["Consistent plant photos", "Equipment handling", "Observation templates"],
  schemaDescription: "Digital equipment quickstart PDF with plant photography, measurement limitations, troubleshooting and observation templates. No hardware or app subscription included.",
  sku: "MGB-EQUIPMENT-QUICKSTART-V1",
  category: "Digital equipment guide",
  buttonLabel: "Get the Guide — $9",
  image: "/images/playbook/quickstart-cover-v4.webp",
  alt: "Illustration of a magnifying lens, green leaf and notebook for the equipment observation guide",
  planKey: "NEXT_PUBLIC_WHOP_QUICKSTART_GUIDE_PLAN_ID",
  checkoutKey: "NEXT_PUBLIC_WHOP_QUICKSTART_GUIDE_CHECKOUT_URL",
  anchorId: "quickstart-guide",
  deliveryKind: "digital",
  availability: "ready",
};

export const scoutGuideBundle: GrowTechProduct = {
  ...products[0],
  name: "APEXEL 10–20X Lens + Complete MasterGrowbot Digital Kit",
  productId: "growtech_scout_guide_bundle",
  badge: "Lens + light + guide",
  price: "$119",
  numericPrice: 119,
  salePrice: "$119",
  description: "APEXEL 10–20X ZoomMacro phone lens with LED ring light, plus the complete $19 Playbook kit: 32-page Playbook, 8 prompts, 8-page workbook, 12-page Quickstart, two worksheets and CSV log. Phone and app subscription separate.",
  whyBuy: "Put your phone lens to work with a repeatable observation workflow.",
  schemaDescription: "APEXEL 10–20X ZoomMacro lens and LED ring light with the complete MasterGrowbot digital Playbook kit, including Equipment Quickstart, workbook, prompts, worksheets and CSV log. $119 one time. Phone and app subscription not included.",
  sku: "MGB-SCOUT-QUICKSTART-BUNDLE",
  buttonLabel: "Get the lens + guide — $119",
  image: "/images/grow-tech/lens-launch/product.webp",
  imageWebp: "/images/grow-tech/lens-launch/product.webp",
  alt: "APEXEL ZoomMacro lens, LED ring light and phone mounting clip",
  planKey: "NEXT_PUBLIC_WHOP_SCOUT_GUIDE_BUNDLE_PLAN_ID",
  checkoutKey: "NEXT_PUBLIC_WHOP_SCOUT_GUIDE_BUNDLE_CHECKOUT_URL",
  anchorId: "scout-guide-bundle",
  deliveryKind: "hardware-and-digital",
  availability: "ready",
  fulfillmentNote: "US & Canada: estimated delivery about two weeks from payment. Shipping included. Global supply-chain and carrier delays may extend delivery times. Tracking after dispatch.",
  deliveryCountries: [],
};

export const soilGuideOffer: GrowTechProduct = {
  ...products[2],
  name: "Six-function Soil Meter + MasterGrowbot Quickstart",
  productId: "growtech_soil_meter",
  badge: "Meter + guide",
  price: "$59",
  numericPrice: 59,
  salePrice: "$59",
  description: "A standalone six-function soil meter with a white housing and two probes, plus the MasterGrowbot equipment guide and observation templates. No automatic app syncing.",
  whyBuy: "Keep manual measurements and their context in one observation log.",
  aiHelp: "Record readings manually; the meter has no automatic connection to MasterGrowbot.",
  schemaDescription: "Standalone six-function soil meter with MasterGrowbot equipment guide and observation templates. No app subscription or automatic syncing.",
  sku: "MGB-SOIL-QUICKSTART-V1",
  buttonLabel: "Get the meter bundle — $59",
  image: "/images/grow-tech/soil-launch/product.webp",
  imageWebp: "/images/grow-tech/soil-launch/product.webp",
  alt: "The white six-function soil meter with two probes",
  availability: "ready",
  deliveryKind: "hardware-and-digital",
  fulfillmentNote: "US & Canada: estimated delivery about two weeks from payment. Shipping included. Global supply-chain and carrier delays may extend delivery times. Tracking after dispatch.",
  deliveryCountries: [],
};

export const growTentOffer: GrowTechProduct = {
  ...scoutGuideBundle,
  name: "Unbranded 2×2 Grow Tent + MasterGrowbot Quickstart",
  productId: "growtech_grow_tent",
  badge: "Compact tent + guide",
  price: "$289",
  numericPrice: 289,
  salePrice: "$289",
  description: "A compact, unbranded all-black 60 × 60 × 140 cm tent with reflective lining and floor tray, plus the MasterGrowbot Equipment Quickstart and observation templates. Lights, ventilation and plants are not included.",
  whyBuy: "A dedicated space for a small grow, with a simple observation workflow.",
  bestFor: ["Small indoor spaces", "Seedlings and compact plants", "Keeping an observation routine"],
  dataCollected: "No sensors or automatic measurements",
  aiHelp: "No automatic app connection; use the guide and log independently.",
  schemaDescription: "Unbranded 60 × 60 × 140 cm grow tent with MasterGrowbot guide and templates. Tent only: lighting and ventilation are sold separately. US and Canada, $289 one time; estimated delivery about two weeks from payment.",
  sku: "MGB-TENT-QUICKSTART-V2",
  category: "Indoor grow tent",
  buttonLabel: "Get the tent + guide — $289",
  image: "/images/grow-tech/tent-express-v2/product.webp",
  imageWebp: "/images/grow-tech/tent-express-v2/product.webp",
  alt: "The unbranded all-black 60 × 60 × 140 cm grow tent with reflective interior",
  planKey: "NEXT_PUBLIC_WHOP_GROW_TENT_PLAN_ID",
  checkoutKey: "NEXT_PUBLIC_WHOP_GROW_TENT_CHECKOUT_URL",
  anchorId: "grow-tent",
  availability: "ready",
  fulfillmentNote: "US & Canada: estimated delivery about two weeks from payment. Shipping included. Global supply-chain and carrier delays may extend delivery times. Tracking after dispatch.",
  deliveryCountries: [],
};

export const growLightOffer: GrowTechProduct = {
  ...growTentOffer,
  name: "ALPHAGROW AG1000 100W LED Grow Light",
  productId: "growtech_ag1000_light",
  badge: "Featured light",
  price: "$199", numericPrice: 199, salePrice: "$199",
  description: "One ALPHAGROW AG1000 Full Spectrum 100Watts hanging LED grow light, US Type B three-prong plug. Rated 100W input and 20–100% dimming. Free equipment quickstart included; tent, plants and ventilation are separate.",
  whyBuy: "Adjustable lighting for seed starting and compact indoor plant setups.",
  bestFor: ["Seed starting", "Compact indoor plant spaces"],
  dataCollected: "No sensors or automatic measurements",
  aiHelp: "No automatic app connection.",
  schemaDescription: "ALPHAGROW AG1000 100W LED grow light, US electrical variant, $199 USD one time with free shipping within the US. Free equipment quickstart included. Estimated delivery about two weeks from confirmed payment. Global supply-chain and carrier delays may extend delivery times.",
  sku: "MGB-AG1000-US-V1", category: "Indoor plant grow light",
  buttonLabel: "Get the AG1000 for $199",
  image: "/images/grow-tech/ag1000-details-v2/spectrum.webp",
  imageWebp: "/images/grow-tech/ag1000-details-v2/spectrum.webp",
  alt: "AG1000 hanging LED panel and spectrum graphic",
  planKey: "NEXT_PUBLIC_WHOP_GROW_LIGHT_PLAN_ID",
  checkoutKey: "NEXT_PUBLIC_WHOP_GROW_LIGHT_CHECKOUT_URL",
  anchorId: "grow-light", availability: "ready", deliveryKind: "hardware-and-digital",
  fulfillmentNote: "Free shipping within the US. Estimated delivery about two weeks from confirmed payment. Global supply-chain and carrier delays may extend delivery times. Tracking after dispatch.",
  deliveryCountries: ["US"],
};

export type AlphaGrowVariant = GrowTechProduct & {
  family: "tent" | "kit";
  sizeLabel: string;
  dimensions: string;
  contents: string[];
  lightNote: string;
  mobileImage: string;
};

const alphaGrowBase = {
  ...growLightOffer,
  badge: "New",
  dataCollected: "No sensors or automatic measurements",
  aiHelp: "No automatic app connection.",
  availability: "ready" as const,
  deliveryKind: "hardware-and-digital" as const,
  deliveryCountries: ["US"] as ("US" | "CA")[],
  fulfillmentNote: "US shipping included. Estimated delivery about two weeks from confirmed payment. Tracking after dispatch. Tax at checkout.",
};

export const alphaGrowTent2x2: AlphaGrowVariant = {
  ...alphaGrowBase, family: "tent", sizeLabel: "2×2 ft", dimensions: "24 × 24 × 48 in (2 × 2 × 4 ft)",
  name: "ALPHAGROW 2×2 Grow Tent", productId: "growtech_alphagrow_tent_2x2", anchorId: "alphagrow-tent-2x2",
  price: "$119", numericPrice: 119, salePrice: "$119",
  description: "ALPHAGROW 24 × 24 × 48 in grow tent with reflective Mylar lining, observation window and removable floor tray. Includes the complete MasterGrowbot Playbook digital kit. Light, ventilation and plants sold separately.",
  whyBuy: "A dedicated, light-tight home for one to two plants.",
  bestFor: ["First grows", "1 to 2 plants", "Closets and spare corners"],
  schemaDescription: "ALPHAGROW 2×2×4 ft grow tent with reflective Mylar lining, observation window and removable floor tray, plus the complete MasterGrowbot Playbook digital kit. $119 USD one time, US shipping included.",
  sku: "MGB-ALPHAGROW-TENT-2X2", category: "Indoor grow tent", buttonLabel: "Get the 2×2 tent for $119",
  image: "/images/grow-tech/alphagrow-v1/tent-lifestyle.webp", imageWebp: "/images/grow-tech/alphagrow-v1/tent-lifestyle.webp",
  mobileImage: "/images/grow-tech/alphagrow-v1/tent-lifestyle-mobile.webp", imageWidth: 960, imageHeight: 1200,
  alt: "Home grower fitting the removable floor tray into an ALPHAGROW 2×2 grow tent with reflective Mylar lining",
  contents: ["Heavy-duty canvas with reflective Mylar lining", "Observation window and removable floor tray", "Vent ports ready for a fan and ducting", "Complete Playbook digital kit ($19 value)"],
  lightNote: "Pairs with one AG1000 for full 2×2 coverage.",
  planKey: "NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_2X2_PLAN_ID", checkoutKey: "NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_2X2_CHECKOUT_URL",
};

export const alphaGrowTent4x2: AlphaGrowVariant = {
  ...alphaGrowTent2x2, sizeLabel: "4×2 ft", dimensions: "48 × 24 in footprint (4 × 2 ft)",
  name: "ALPHAGROW 4×2 Grow Tent", productId: "growtech_alphagrow_tent_4x2", anchorId: "alphagrow-tent-4x2",
  price: "$149", numericPrice: 149, salePrice: "$149",
  description: "ALPHAGROW 4 × 2 ft footprint grow tent with reflective Mylar lining, observation window and removable floor tray. Includes the complete MasterGrowbot Playbook digital kit. Light, ventilation and plants sold separately.",
  whyBuy: "Room for two to four plants without taking over the room.",
  bestFor: ["2 to 4 plants", "Room to scale up", "Wall-side setups"],
  schemaDescription: "ALPHAGROW 4×2 ft footprint grow tent with reflective Mylar lining, observation window and removable floor tray, plus the complete MasterGrowbot Playbook digital kit. $149 USD one time, US shipping included.",
  sku: "MGB-ALPHAGROW-TENT-4X2", buttonLabel: "Get the 4×2 tent for $149",
  lightNote: "Pairs with two AG1000 lights for full 4×2 flowering coverage.",
  planKey: "NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_4X2_PLAN_ID", checkoutKey: "NEXT_PUBLIC_WHOP_ALPHAGROW_TENT_4X2_CHECKOUT_URL",
};

// Kit contents follow the supplier listings named in the handoff. Confirm the exact package before enabling each plan.
export const alphaGrowKit2x2: AlphaGrowVariant = {
  ...alphaGrowBase, family: "kit", sizeLabel: "2×2 ft", dimensions: "24 × 24 × 48 in tent (2 × 2 × 4 ft)",
  name: "ALPHAGROW 2×2 Grow Tent Kit", productId: "growtech_alphagrow_kit_2x2", anchorId: "alphagrow-kit-2x2",
  price: "$299", numericPrice: 299, salePrice: "$299",
  description: "ALPHAGROW 2×2 grow tent kit: 24 × 24 × 48 in reflective tent, LED grow light, quiet 4 in inline fan with carbon filter, and ducting. Includes the complete MasterGrowbot Playbook digital kit. Plants, soil and nutrients sold separately.",
  whyBuy: "Everything you need to start your first indoor grow, in one box.",
  bestFor: ["First-time growers", "1 to 2 plants", "Odor control"],
  schemaDescription: "ALPHAGROW 2×2 grow tent kit with tent, LED grow light, 4 in inline fan, carbon filter and ducting, plus the complete MasterGrowbot Playbook digital kit. $299 USD one time, US shipping included.",
  sku: "MGB-ALPHAGROW-KIT-2X2", category: "Indoor grow tent kit", buttonLabel: "Get the 2×2 kit for $299",
  image: "/images/grow-tech/alphagrow-v1/kit-lifestyle.webp", imageWebp: "/images/grow-tech/alphagrow-v1/kit-lifestyle.webp",
  mobileImage: "/images/grow-tech/alphagrow-v1/kit-lifestyle-mobile.webp", imageWidth: 960, imageHeight: 1200,
  alt: "Home grower checking the inline fan and carbon filter inside an ALPHAGROW grow tent kit with young cannabis plants",
  contents: ["24 × 24 × 48 in reflective grow tent", "Full-spectrum LED grow light", "Quiet 4 in inline fan + carbon filter", "Ducting, hangers and floor tray", "Complete Playbook digital kit ($19 value)"],
  lightNote: "Light included. Add an AG1000 later for more intensity.",
  planKey: "NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_2X2_PLAN_ID", checkoutKey: "NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_2X2_CHECKOUT_URL",
};

export const alphaGrowKit4x2: AlphaGrowVariant = {
  ...alphaGrowKit2x2, sizeLabel: "4×2 ft", dimensions: "48 × 24 in tent footprint (4 × 2 ft)",
  name: "ALPHAGROW 4×2 Grow Tent Ventilation Kit", productId: "growtech_alphagrow_kit_4x2", anchorId: "alphagrow-kit-4x2",
  price: "$349", numericPrice: 349, salePrice: "$349",
  description: "ALPHAGROW 4×2 grow tent kit: 48 × 24 in footprint reflective tent, 4 in inline fan with carbon filter, variable speed controller and ducting. Includes the complete MasterGrowbot Playbook digital kit. Grow light sold separately; two AG1000 lights cover a full 4×2 canopy.",
  whyBuy: "A bigger, odor-controlled space with airflow dialed in from day one.",
  bestFor: ["2 to 4 plants", "Odor control", "Growers adding their own light"],
  schemaDescription: "ALPHAGROW 4×2 ft grow tent ventilation kit with tent, 4 in inline fan, carbon filter, speed controller and ducting, plus the complete MasterGrowbot Playbook digital kit. Light sold separately. $349 USD one time, US shipping included.",
  sku: "MGB-ALPHAGROW-KIT-4X2", buttonLabel: "Get the 4×2 kit for $349",
  contents: ["48 × 24 in footprint reflective grow tent", "Quiet 4 in inline fan + carbon filter", "Variable speed controller", "Ducting, hangers and floor tray", "Complete Playbook digital kit ($19 value)"],
  lightNote: "Grow light not included. Two AG1000 lights cover a full 4×2 canopy.",
  planKey: "NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_4X2_PLAN_ID", checkoutKey: "NEXT_PUBLIC_WHOP_ALPHAGROW_KIT_4X2_CHECKOUT_URL",
};

export const alphaGrowTents: AlphaGrowVariant[] = [alphaGrowTent2x2, alphaGrowTent4x2];
export const alphaGrowKits: AlphaGrowVariant[] = [alphaGrowKit2x2, alphaGrowKit4x2];

/** Hardware purchases that unlock the complete Playbook digital kit in Whop. */
export const COMPLETE_PLAYBOOK_PRODUCT_IDS = ["growtech_scout_guide_bundle", "growtech_ag1000_light", ...alphaGrowTents.map(v => v.productId), ...alphaGrowKits.map(v => v.productId)];
export const COMPLETE_PLAYBOOK_SLUGS = ["scout-guide-bundle", "grow-light", ...alphaGrowTents.map(v => v.anchorId), ...alphaGrowKits.map(v => v.anchorId)];

export const allGrowTechOffers: GrowTechProduct[] = [
  ...products.map((product, index) => index === 2 ? soilGuideOffer : ({ ...product, availability: "paused" as const })),
  { ...bundle, availability: "paused" }, quickstartGuide, scoutGuideBundle, growTentOffer, growLightOffer, ...alphaGrowTents, ...alphaGrowKits,
];

export function canPurchaseGrowTech(product: GrowTechProduct) {
  const hasDeliveryRoute = product.deliveryKind === "digital" || Boolean(product.deliveryCountries?.length);
  const planId = planIds[product.planKey];
  const hostedUrl = checkoutUrls[product.checkoutKey];
  if (!planId || !hostedUrl) return false;
  if (product.anchorId.startsWith("alphagrow-")) {
    // New SKUs: require a well-formed plan and a hosted link for that same plan, never a stale or mismatched one.
    if (!/^plan_[A-Za-z0-9]+$/.test(planId)) return false;
    const match = hostedUrl.match(/^https:\/\/whop\.com\/checkout\/(plan_[A-Za-z0-9]+|ch_[A-Za-z0-9]+)\/?(?:\?[^#]*)?$/);
    if (!match || (match[1].startsWith("plan_") && match[1] !== planId)) return false;
  }
  return product.anchorId !== "quickstart-guide" && hasDeliveryRoute && product.availability === "ready";
}

