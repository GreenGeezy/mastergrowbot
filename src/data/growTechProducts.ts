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

export type GrowTechProduct = {
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
  anchorId: string;
};

export const checkoutUrls: Record<CheckoutKey, string | undefined> = {
  NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL: import.meta.env.NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL,
  NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL:
    import.meta.env.NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL,
  NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL:
    import.meta.env.NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL,
  NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL: import.meta.env.NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL,
};

export const planIds: Record<PlanKey, string | undefined> = {
  NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID,
  NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID,
  NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID,
  NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID: import.meta.env.NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID,
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

