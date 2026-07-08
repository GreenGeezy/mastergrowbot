import { useCallback, useEffect, useMemo, useState } from "react";
import { WhopCheckoutEmbed, type WhopCheckoutState } from "@whop/checkout/react";
import { Headphones, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { useWhopCheckoutTracking } from "@/hooks/useWhopCheckoutTracking";
import {
  type GrowTechAnalyticsProduct,
  growTechEcommercePayload,
  trackGrowTechEmbedRendered,
  trackGrowTechFallbackClick,
  trackGrowTechMissingPlanId,
  trackGrowTechPurchase,
} from "@/lib/analytics";

type EmbeddedGrowTechCheckoutProps = {
  product: GrowTechAnalyticsProduct & {
    price: string;
    image: string;
    alt: string;
  };
  planId?: string;
  fallbackCheckoutUrl?: string;
  ctaLocation: string;
};

const trustItems = [
  { text: "Secure checkout powered by Whop", icon: ShieldCheck },
  { text: "100% free shipping", icon: Truck },
  { text: "Tracking sent after dispatch", icon: PackageCheck },
  { text: "Order support included", icon: Headphones },
];

const checkoutBadges = [
  {
    src: "/images/WhopVerifiedCheckoutBadge.png",
    alt: "Whop verified checkout badge",
    className: "object-cover object-center",
  },
  {
    src: "/images/GuaranteedSafeCheckoutBadgePremium.png",
    alt: "Guaranteed safe checkout badge",
    className: "object-cover object-center",
  },
];

const defaultUnitedStatesAddressPrefill = {
  address: {
    country: "US",
  },
  shippingAddress: {
    country: "US",
  },
};

export default function EmbeddedGrowTechCheckout({
  product,
  planId,
  fallbackCheckoutUrl,
  ctaLocation,
}: EmbeddedGrowTechCheckoutProps) {
  const [isComplete, setIsComplete] = useState(false);
  const [completedReceiptId, setCompletedReceiptId] = useState<string | undefined>();

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

  const fallbackLink = fallbackCheckoutUrl ? (
    <a
      href={fallbackCheckoutUrl}
      onClick={() => trackGrowTechFallbackClick(product, ctaLocation, planId)}
      className="mt-4 inline-flex text-sm font-semibold text-landing-green hover:underline focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black"
    >
      {planId ? "Having trouble? Open secure Whop checkout instead." : "Open secure Whop checkout instead."}
    </a>
  ) : null;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-landing-green/20 bg-white/[0.035] p-4 shadow-xl shadow-black/20">
        <div className="flex gap-4">
          <img
            src={product.image}
            alt={product.alt}
            className="h-20 w-20 shrink-0 rounded-lg border border-white/10 object-cover"
            width={80}
            height={80}
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-green">GrowTech checkout</p>
            <h3 className="mt-1 text-lg font-semibold leading-snug text-white font-sans">{product.name}</h3>
            <p className="mt-1 text-2xl font-semibold text-white">{product.price}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {trustItems.map(({ text, icon: Icon }) => (
            <div key={text} className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/25 p-2.5">
              <Icon className="h-4 w-4 shrink-0 text-landing-green" aria-hidden="true" />
              <span className="text-xs font-semibold leading-snug text-white/66">{text}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {checkoutBadges.map((badge) => (
            <div
              key={badge.src}
              className="overflow-hidden rounded-lg border border-landing-green/20 bg-[#020604] shadow-[0_0_22px_rgba(34,197,94,0.16)]"
            >
              <img
                src={badge.src}
                alt={badge.alt}
                className={`h-14 w-full sm:h-16 ${badge.className}`}
                loading="lazy"
                width={320}
                height={128}
              />
            </div>
          ))}
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
          <div className="border-b border-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/46">
            Secure checkout status: {checkoutState}
          </div>
          <div ref={hostRef} className="whop-embedded-checkout-host min-h-[760px]">
            <WhopCheckoutEmbed
              planId={planId}
              returnUrl="https://www.mastergrowbot.com/grow-tech/thank-you?status=success"
              theme="dark"
              collectShipping
              prefill={defaultUnitedStatesAddressPrefill}
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
                  paddingX: 20,
                  paddingY: 28,
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
              onStateChange={(state: WhopCheckoutState) => {
                handleWhopStateChange(String(state), "react_on_state_change");
              }}
            />
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

      {fallbackLink}
    </div>
  );
}
