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
  "add_payment_info",
  "purchase",
  "whop_checkout_opened",
  "whop_checkout_embed_rendered",
  "whop_checkout_iframe_loaded",
  "whop_checkout_load_timeout",
  "checkout_fallback_click",
]);

const pendingCheckoutStorageKey = "mastergrowbot.pending_checkout.v1";
const completedTransactionStoragePrefix = "mastergrowbot.completed_transaction.v1:";
const pendingCheckoutTtlMs = 24 * 60 * 60 * 1000;

type PendingCheckout = {
  checkoutId: string;
  createdAt: number;
  payload: AnalyticsParams;
};

function createCheckoutId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `checkout_${crypto.randomUUID()}`;
  }

  return `checkout_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function readPendingCheckouts(): Record<string, PendingCheckout> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(pendingCheckoutStorageKey) || "{}") as Record<
      string,
      PendingCheckout
    >;
    const now = Date.now();

    return Object.fromEntries(
      Object.entries(parsed).filter(([, checkout]) => now - checkout.createdAt < pendingCheckoutTtlMs),
    );
  } catch {
    return {};
  }
}

function persistPendingCheckout(payload: AnalyticsParams) {
  if (typeof window === "undefined") {
    return;
  }

  const sourcePage = String(payload.checkout_source_page || "unknown");
  const checkouts = readPendingCheckouts();
  checkouts[sourcePage] = {
    checkoutId: createCheckoutId(),
    createdAt: Date.now(),
    payload,
  };

  try {
    window.localStorage.setItem(pendingCheckoutStorageKey, JSON.stringify(checkouts));
  } catch {
    // Analytics storage must never interrupt checkout.
  }
}

function pendingCheckoutFor(sourcePage: string) {
  return readPendingCheckouts()[sourcePage];
}

function clearPendingCheckout(sourcePage: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const checkouts = readPendingCheckouts();
    delete checkouts[sourcePage];
    window.localStorage.setItem(pendingCheckoutStorageKey, JSON.stringify(checkouts));
  } catch {
    // Analytics storage must never interrupt checkout.
  }
}

function isCompletedTransaction(transactionId: string) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(`${completedTransactionStoragePrefix}${transactionId}`) === "1";
  } catch {
    return false;
  }
}

function markCompletedTransaction(transactionId: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(`${completedTransactionStoragePrefix}${transactionId}`, "1");
  } catch {
    // Event delivery still succeeds when storage is unavailable.
  }
}

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
  const payload = growTechEcommercePayload(product, ctaLocation, planId);
  persistPendingCheckout(payload);
  trackEvent("begin_checkout", payload);
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
  trackCheckoutSuccess(growTechEcommercePayload(product, ctaLocation, planId), receiptId, extra);
  trackEvent("growtech_purchase_complete", {
    ...growTechEcommercePayload(product, ctaLocation, planId),
    receipt_id: receiptId,
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
  const payload = {
    ...aiStrategyEcommercePayload(product, ctaLocation, planId),
    ...extra,
  };

  if (eventName === "begin_checkout") {
    persistPendingCheckout(payload);
  }

  trackEvent(eventName, payload);
}

/**
 * Whop exposes a verified completion callback, but not a separate public
 * "payment details submitted" callback. A successful completion proves the
 * payment details were accepted, so emit add_payment_info immediately before
 * purchase and deduplicate both signals with the transaction ID.
 */
export function trackCheckoutSuccess(
  payload: AnalyticsParams,
  receiptId?: string,
  extra: AnalyticsParams = {},
) {
  const sourcePage = String(payload.checkout_source_page || "unknown");
  const pendingCheckout = pendingCheckoutFor(sourcePage);
  const transactionId = receiptId?.trim() || pendingCheckout?.checkoutId || createCheckoutId();

  if (isCompletedTransaction(transactionId)) {
    clearPendingCheckout(sourcePage);
    return false;
  }

  const completedPayload = {
    ...(pendingCheckout?.payload || payload),
    ...payload,
    ...extra,
  };

  trackEvent("add_payment_info", {
    ...completedPayload,
    payment_type: "Whop",
  });
  trackEvent("purchase", {
    ...completedPayload,
    transaction_id: transactionId,
  });

  markCompletedTransaction(transactionId);
  clearPendingCheckout(sourcePage);
  return true;
}

export function trackPendingCheckoutSuccess(
  sourcePage: "/grow-tech" | "/ai-strategy",
  receiptId?: string,
  extra: AnalyticsParams = {},
) {
  const pendingCheckout = pendingCheckoutFor(sourcePage);
  if (!pendingCheckout) {
    return false;
  }

  return trackCheckoutSuccess(pendingCheckout.payload, receiptId, {
    checkout_completion_source: "return_url",
    ...extra,
  });
}
