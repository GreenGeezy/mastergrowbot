import { useCallback, useEffect, useMemo, useState } from "react";
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { AlertCircle, ArrowUpRight, Copy } from "lucide-react";
import { useWhopCheckoutTracking } from "@/hooks/useWhopCheckoutTracking";
import {
  type GrowTechAnalyticsProduct,
  growTechEcommercePayload,
  trackGrowTechEmbedRendered,
  trackGrowTechFallbackClick,
  trackGrowTechMissingPlanId,
  trackGrowTechPurchase,
  trackEvent,
} from "@/lib/analytics";

type EmbeddedGrowTechCheckoutProps = {
  product: GrowTechAnalyticsProduct & {
    price: string;
    salePrice?: string;
    image: string;
    imageWebp?: string;
    alt: string;
  };
  planId?: string;
  fallbackCheckoutUrl?: string;
  ctaLocation: string;
  promoActive?: boolean;
};

const PROMO_CODE = "AIGROWTECH";

export default function EmbeddedGrowTechCheckout({
  product,
  planId,
  fallbackCheckoutUrl,
  ctaLocation,
  promoActive = false,
}: EmbeddedGrowTechCheckoutProps) {
  const [isComplete, setIsComplete] = useState(false);
  const [completedReceiptId, setCompletedReceiptId] = useState<string | undefined>();
  const [promoCopied, setPromoCopied] = useState(false);

  const checkoutPayload = useMemo(
    () => growTechEcommercePayload(product, ctaLocation, planId),
    [ctaLocation, planId, product],
  );

  const handleTrackedComplete = useCallback(
    (completedPlanId: string, receiptId: string | undefined, signalSource: string) => {
      setIsComplete(true);
      setCompletedReceiptId(receiptId);
      trackGrowTechPurchase(product, receiptId, completedPlanId || planId || "unknown", ctaLocation, {
        whop_signal_source: signalSource,
      });
    },
    [ctaLocation, planId, product],
  );

  const {
    checkoutState,
    handleComplete: handleWhopComplete,
    handleStateChange: handleWhopStateChange,
    hostRef,
  } = useWhopCheckoutTracking({
    planId,
    payload: checkoutPayload,
    onComplete: handleTrackedComplete,
  });

  useEffect(() => {
    if (planId) {
      trackGrowTechEmbedRendered(product, ctaLocation, planId);
    } else {
      trackGrowTechMissingPlanId(product, ctaLocation);
    }
  }, [ctaLocation, planId, product]);

  const copyPromoCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setPromoCopied(true);
      window.setTimeout(() => setPromoCopied(false), 2500);
    } catch {
      setPromoCopied(false);
    }
  };

  const checkoutUnavailable = checkoutState === "timeout" || checkoutState === "disabled";

  useEffect(() => {
    if (checkoutUnavailable) {
      trackEvent("growtech_checkout_error", {
        product_id: product.productId,
        cta_location: ctaLocation,
        checkout_state: checkoutState,
      });
    }
  }, [checkoutState, checkoutUnavailable, ctaLocation, product.productId]);

  // A plan ID identifies the embed, but is not necessarily a valid hosted purchase URL.
  // Use the exact checkout link configured by the merchant.
  const resolvedFallbackCheckoutUrl = fallbackCheckoutUrl;

  const fallbackLink = resolvedFallbackCheckoutUrl ? (
    <a
      href={resolvedFallbackCheckoutUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackGrowTechFallbackClick(product, ctaLocation, planId)}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/14 bg-white/[0.06] px-4 py-2.5 text-sm font-bold text-white transition hover:border-landing-green/40 hover:bg-landing-green/10 focus:outline-none focus:ring-2 focus:ring-landing-green"
    >
      Open full-page Whop checkout
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </a>
  ) : null;

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-landing-green/20 bg-white/[0.035] p-3 shadow-xl shadow-black/20">
        <div className="flex gap-4">
          <img
            src={product.imageWebp || product.image}
            alt={product.alt}
            className="h-16 w-16 shrink-0 rounded-lg border border-white/10 object-cover"
            width={64}
            height={64}
          />
          <div className="min-w-0">
            <h2 className="text-base font-semibold leading-snug text-white font-sans">{product.name}</h2>
            {promoActive && product.salePrice ? (
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <p className="text-xl font-semibold text-white">{product.salePrice}</p>
                <p className="text-sm font-semibold text-white/42 line-through">{product.price}</p>
                <span className="text-xs font-bold uppercase tracking-wide text-amber-200">with code</span>
              </div>
            ) : (
              <p className="mt-1 text-xl font-semibold text-white">{product.price}</p>
            )}
          </div>
        </div>

      </div>

      {isComplete ? (
        <div className="rounded-xl border border-landing-green/25 bg-landing-green/10 p-6 text-center">
          <p className="text-lg font-semibold text-white">Your Whop checkout is complete.</p>
          <p className="mt-2 text-sm leading-relaxed text-white/62">
            Please check the email used at checkout for your receipt, order details, and delivery updates.
          </p>
          {completedReceiptId && (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-landing-green">
              Receipt: {completedReceiptId}
            </p>
          )}
        </div>
      ) : planId ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#0b0b12]">
          {promoActive ? <div className="border-b border-white/[0.08] p-3 text-right">
            <button
              type="button"
              onClick={copyPromoCode}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm font-bold text-amber-100 transition hover:bg-amber-300/15 focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              {promoCopied ? "Code copied" : `Copy ${PROMO_CODE}`}
            </button>
          </div> : null}
          {(checkoutUnavailable || checkoutState !== "ready") && <div aria-live="polite" className="px-3 pt-3">
            {checkoutUnavailable ? (
              <div role="alert" className="flex gap-3 rounded-lg border border-amber-300/25 bg-amber-300/10 p-3 text-sm text-amber-100">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>The embedded form is taking too long to respond. Your selection is saved. Use the full-page checkout option below to continue securely.</p>
              </div>
            ) : (
              <p className="text-xs font-semibold text-white/50">Connecting to secure payment...</p>
            )}
          </div>}
          <div className="p-0 sm:p-1">
              <div ref={hostRef} className="whop-embedded-checkout-host min-h-[720px]">
                <WhopCheckoutEmbed
                  planId={planId}
                  returnUrl="https://www.mastergrowbot.com/grow-tech/thank-you?status=success"
                  theme="dark"
                  collectShipping
                  utm={{
                    utm_source: "mastergrowbot",
                    utm_medium: "embedded_checkout",
                    utm_campaign: "growtech_checkout",
                    utm_content: ctaLocation,
                  }}
                  themeOptions={{
                    backgroundColor: "#0b0b12",
                    accentColor: "#22c55e",
                    borderRadius: 14,
                  }}
                  styles={{
                    container: {
                      paddingX: 12,
                      paddingY: 12,
                    },
                  }}
                  fallback={
                    <div className="flex min-h-[360px] items-center justify-center p-8 text-sm font-semibold text-white/60">
                      Loading secure checkout...
                    </div>
                  }
                  onComplete={(completedPlanId: string, receiptId?: string) => {
                    handleWhopComplete(completedPlanId, receiptId, "react_on_complete");
                  }}
                  onStateChange={(state) => {
                    handleWhopStateChange(String(state), "react_on_state_change");
                  }}
                />
              </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-300/20 bg-amber-300/8 p-5">
          <p className="text-sm font-semibold text-amber-100">Embedded checkout is not configured yet.</p>
          <p className="mt-2 text-sm leading-relaxed text-white/58">
            This product is ready for secure Whop checkout once the matching public Plan ID is added in Vercel.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-white/48">
          Secure payment is processed by Whop. No payment data is stored by MasterGrowbot. Your delivery details are collected once.
        </p>
        {fallbackLink}
      </div>
    </div>
  );
}
