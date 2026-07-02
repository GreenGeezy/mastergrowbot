export type GrowTechAnalyticsProduct = {
  productId: string;
  name: string;
  numericPrice: number;
};

export type AIStrategyAnalyticsProduct = {
  productId: string;
  name: string;
  numericPrice: number;
  category: "AI Strategy" | "AI Buildout";
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsParams = Record<string, unknown>;

const ecommerceEventNames = new Set([
  "select_item",
  "begin_checkout",
  "purchase",
  "whop_checkout_opened",
  "whop_checkout_embed_rendered",
  "whop_checkout_iframe_loaded",
  "whop_checkout_load_timeout",
  "checkout_fallback_click",
]);

function shouldAttachEcommerce(eventName: string, params: AnalyticsParams) {
  return ecommerceEventNames.has(eventName) || eventName.startsWith("whop_checkout_") || Array.isArray(params.items);
}

function dataLayerEcommerce(params: AnalyticsParams) {
  return {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: params.currency,
    items: params.items,
  };
}

export function growTechEcommercePayload(
  product: GrowTechAnalyticsProduct,
  ctaLocation?: string,
  planId?: string,
): AnalyticsParams {
  return {
    currency: "USD",
    value: product.numericPrice,
    checkout_source_page: "/grow-tech",
    cta_location: ctaLocation,
    plan_id: planId,
    items: [
      {
        item_id: product.productId,
        item_name: product.name,
        item_category: "GrowTech",
        price: product.numericPrice,
        quantity: 1,
      },
    ],
  };
}

export function aiStrategyEcommercePayload(
  product: AIStrategyAnalyticsProduct,
  ctaLocation: string,
  planId?: string,
): AnalyticsParams {
  return {
    currency: "USD",
    value: product.numericPrice,
    checkout_source_page: "/ai-strategy",
    cta_location: ctaLocation,
    plan_id: planId,
    items: [
      {
        item_id: product.productId,
        item_name: product.name,
        item_category: product.category,
        price: product.numericPrice,
        quantity: 1,
      },
    ],
  };
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") {
    return;
  }

  if (Array.isArray(window.dataLayer)) {
    if (shouldAttachEcommerce(eventName, params)) {
      window.dataLayer.push({ ecommerce: null });
    }

    window.dataLayer.push({
      event: eventName,
      ...params,
      ...(shouldAttachEcommerce(eventName, params)
        ? {
            ecommerce: dataLayerEcommerce(params),
          }
        : {}),
    });
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

export function trackGrowTechSelectItem(
  product: GrowTechAnalyticsProduct,
  ctaLocation: string,
  planId?: string,
) {
  trackEvent("select_item", growTechEcommercePayload(product, ctaLocation, planId));
}

export function trackGrowTechBeginCheckout(
  product: GrowTechAnalyticsProduct,
  ctaLocation: string,
  planId?: string,
) {
  trackEvent("begin_checkout", growTechEcommercePayload(product, ctaLocation, planId));
}

export function trackGrowTechCheckoutOpened(
  product: GrowTechAnalyticsProduct,
  ctaLocation: string,
  planId?: string,
) {
  trackEvent("whop_checkout_opened", growTechEcommercePayload(product, ctaLocation, planId));
}

export function trackGrowTechEmbedRendered(
  product: GrowTechAnalyticsProduct,
  ctaLocation: string,
  planId?: string,
) {
  trackEvent("whop_checkout_embed_rendered", growTechEcommercePayload(product, ctaLocation, planId));
}

export function trackGrowTechCheckoutState(
  product: GrowTechAnalyticsProduct,
  state: string,
  ctaLocation: string,
  planId?: string,
) {
  trackEvent(`whop_checkout_${state}`, {
    ...growTechEcommercePayload(product, ctaLocation, planId),
    checkout_state: state,
  });
}

export function trackGrowTechPurchase(
  product: GrowTechAnalyticsProduct,
  receiptId: string | undefined,
  planId: string,
  ctaLocation = "unknown",
  extra: AnalyticsParams = {},
) {
  trackEvent("purchase", {
    ...growTechEcommercePayload(product, ctaLocation, planId),
    transaction_id: receiptId,
    ...extra,
  });
}

export function trackGrowTechFallbackClick(
  product: GrowTechAnalyticsProduct,
  ctaLocation: string,
  planId?: string,
) {
  trackEvent("checkout_fallback_click", growTechEcommercePayload(product, ctaLocation, planId));
}

export function trackGrowTechMissingPlanId(product: GrowTechAnalyticsProduct, ctaLocation: string) {
  trackEvent("checkout_missing_plan_id", growTechEcommercePayload(product, ctaLocation));
}

export function trackAIStrategyCheckoutEvent(
  eventName: string,
  product: AIStrategyAnalyticsProduct,
  ctaLocation: string,
  planId?: string,
  extra: AnalyticsParams = {},
) {
  trackEvent(eventName, {
    ...aiStrategyEcommercePayload(product, ctaLocation, planId),
    ...extra,
  });
}
