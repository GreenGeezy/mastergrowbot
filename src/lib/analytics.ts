export type GrowTechAnalyticsProduct = {
  productId: string;
  name: string;
  numericPrice: number;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type AnalyticsParams = Record<string, unknown>;

function ecommercePayload(
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

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") {
    return;
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...params,
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
  trackEvent("select_item", ecommercePayload(product, ctaLocation, planId));
}

export function trackGrowTechBeginCheckout(
  product: GrowTechAnalyticsProduct,
  ctaLocation: string,
  planId?: string,
) {
  trackEvent("begin_checkout", ecommercePayload(product, ctaLocation, planId));
}

export function trackGrowTechCheckoutOpened(
  product: GrowTechAnalyticsProduct,
  ctaLocation: string,
  planId?: string,
) {
  trackEvent("whop_checkout_opened", ecommercePayload(product, ctaLocation, planId));
}

export function trackGrowTechEmbedRendered(
  product: GrowTechAnalyticsProduct,
  ctaLocation: string,
  planId?: string,
) {
  trackEvent("whop_checkout_embed_rendered", ecommercePayload(product, ctaLocation, planId));
}

export function trackGrowTechCheckoutState(
  product: GrowTechAnalyticsProduct,
  state: string,
  ctaLocation: string,
  planId?: string,
) {
  trackEvent(`whop_checkout_${state}`, {
    ...ecommercePayload(product, ctaLocation, planId),
    checkout_state: state,
  });
}

export function trackGrowTechPurchase(
  product: GrowTechAnalyticsProduct,
  receiptId: string | undefined,
  planId: string,
  ctaLocation = "unknown",
) {
  trackEvent("purchase", {
    ...ecommercePayload(product, ctaLocation, planId),
    transaction_id: receiptId,
  });
}

export function trackGrowTechFallbackClick(
  product: GrowTechAnalyticsProduct,
  ctaLocation: string,
  planId?: string,
) {
  trackEvent("checkout_fallback_click", ecommercePayload(product, ctaLocation, planId));
}

export function trackGrowTechMissingPlanId(product: GrowTechAnalyticsProduct, ctaLocation: string) {
  trackEvent("checkout_missing_plan_id", ecommercePayload(product, ctaLocation));
}
