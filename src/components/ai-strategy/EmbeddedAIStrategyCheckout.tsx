import { useCallback, useEffect, useMemo, useState } from "react";
import { WhopCheckoutEmbed, type WhopCheckoutState } from "@whop/checkout/react";
import { ArrowUpRight, FileText, Headphones, LockKeyhole, ShieldCheck } from "lucide-react";
import { useWhopCheckoutTracking } from "@/hooks/useWhopCheckoutTracking";
import { aiStrategyEcommercePayload, trackAIStrategyCheckoutEvent } from "@/lib/analytics";

export type AIStrategyCheckoutProduct = {
  productId: string;
  name: string;
  price: string;
  numericPrice: number;
  balanceCopy: string;
  category: "AI Strategy" | "AI Buildout";
};

type EmbeddedAIStrategyCheckoutProps = {
  product: AIStrategyCheckoutProduct;
  planId?: string;
  fallbackCheckoutUrl?: string;
  ctaLocation: string;
};

const returnUrl = "https://www.mastergrowbot.com/ai-strategy/intake?status=success";

const trustItems = [
  { text: "Secure checkout powered by Whop", icon: ShieldCheck },
  { text: "Confidential and private", icon: LockKeyhole },
  { text: "NDA available upon request", icon: FileText },
  { text: "Order support included", icon: Headphones },
];

const checkoutBadges = [
  {
    src: "/images/WhopVerifiedCheckoutBadge.png",
    alt: "Whop verified checkout badge",
  },
  {
    src: "/images/GuaranteedSafeCheckoutBadgePremium.png",
    alt: "Guaranteed safe checkout badge",
  },
];

export default function EmbeddedAIStrategyCheckout({
  product,
  planId,
  fallbackCheckoutUrl,
  ctaLocation,
}: EmbeddedAIStrategyCheckoutProps) {
  const [isComplete, setIsComplete] = useState(false);
  const [completedReceiptId, setCompletedReceiptId] = useState<string | undefined>();
  const checkoutPayload = useMemo(
    () => aiStrategyEcommercePayload(product, ctaLocation, planId),
    [ctaLocation, planId, product],
  );

  const handleTrackedComplete = useCallback(
    (completedPlanId: string, receiptId: string | undefined, signalSource: string) => {
      setIsComplete(true);
      setCompletedReceiptId(receiptId);
      trackAIStrategyCheckoutEvent("purchase", product, ctaLocation, completedPlanId || planId, {
        transaction_id: receiptId,
        whop_signal_source: signalSource,
      });
    },
    [ctaLocation, planId, product],
  );

  const {
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
      trackAIStrategyCheckoutEvent("whop_checkout_embed_rendered", product, ctaLocation, planId);
    } else {
      trackAIStrategyCheckoutEvent("checkout_missing_plan_id", product, ctaLocation);
      trackAIStrategyCheckoutEvent("whop_checkout_disabled", product, ctaLocation);
    }
  }, [ctaLocation, planId, product]);

  const resolvedFallbackCheckoutUrl = planId ? `https://whop.com/checkout/${planId}` : fallbackCheckoutUrl;

  const fallbackLink = resolvedFallbackCheckoutUrl ? (
    <a
      href={resolvedFallbackCheckoutUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackAIStrategyCheckoutEvent("checkout_fallback_click", product, ctaLocation, planId)}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/14 bg-white/[0.06] px-4 py-2.5 text-sm font-bold text-white transition hover:border-landing-green/40 hover:bg-landing-green/10 focus:outline-none focus:ring-2 focus:ring-landing-green"
    >
      Open full-page Whop checkout
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </a>
  ) : null;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-landing-green/20 bg-white/[0.035] p-4 shadow-xl shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-green">AI Strategy Checkout</p>
            <h3 className="mt-1 text-xl font-semibold leading-snug text-white font-sans">{product.name}</h3>
            <p className="mt-2 text-3xl font-semibold text-white">{product.price}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/58">{product.balanceCopy}</p>
          </div>
          <div className="rounded-lg border border-gold/20 bg-gold/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-gold">
            Deposit
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {trustItems.map(({ text, icon: Icon }) => (
            <div key={text} className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/25 p-2 sm:p-2.5">
              <Icon className="h-4 w-4 shrink-0 text-landing-green" aria-hidden="true" />
              <span className="text-xs font-semibold leading-snug text-white/66">{text}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 hidden grid-cols-2 gap-2.5 sm:grid">
          {checkoutBadges.map((badge) => (
            <div
              key={badge.src}
              className="overflow-hidden rounded-lg border border-landing-green/20 bg-[#020604] shadow-[0_0_22px_rgba(34,197,94,0.16)]"
            >
              <img
                src={badge.src}
                alt={badge.alt}
                className="h-14 w-full object-cover object-center sm:h-16"
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
            Please continue to the intake page to schedule your session or share details now.
          </p>
          {completedReceiptId && (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-landing-green">
              Receipt: {completedReceiptId}
            </p>
          )}
          <a
            href="/ai-strategy/intake"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-landing-green px-5 py-3 text-sm font-semibold text-black transition hover:bg-landing-green/90 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black"
          >
            Continue to Intake
          </a>
        </div>
      ) : planId ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#0b0b12]">
          <div className="border-b border-white/[0.08] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-landing-green">
              One secure checkout — no duplicate forms
            </p>
            <p className="mt-1 text-sm text-white/62">
              Enter your email, billing address, and payment once in Whop below.
            </p>
          </div>
          <div className="p-2 sm:p-4">
            <div ref={hostRef} className="whop-embedded-checkout-host min-h-[720px]">
              <WhopCheckoutEmbed
                planId={planId}
                returnUrl={returnUrl}
                theme="dark"
                utm={{
                  utm_source: "mastergrowbot",
                  utm_medium: "embedded_checkout",
                  utm_campaign: "ai_strategy_checkout",
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
        </div>
      ) : (
        <div className="rounded-xl border border-amber-300/20 bg-amber-300/8 p-5">
          <p className="text-sm font-semibold text-amber-100">Embedded checkout is not configured yet.</p>
          <p className="mt-2 text-sm leading-relaxed text-white/58">
            This service is ready for secure Whop checkout once the matching public Plan ID is added in Vercel.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-white/48">
          Secure payment is processed by Whop. Billing details are collected once during checkout.
        </p>
        {fallbackLink}
      </div>
    </div>
  );
}
