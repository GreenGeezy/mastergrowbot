import { useMemo, useState, type ReactNode } from "react";
import { loadWhop } from "@whop/elements";
import { Checkout, CheckoutElement, WhopElements } from "@whop/elements-react";

export type WhopCheckoutState = "loading" | "ready" | "error";
type Campaign = Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content", string>>;
type Props = {
  planId: string;
  returnUrl: string;
  theme?: "light" | "dark";
  deliveryCountry?: string;
  utm?: Campaign;
  themeOptions?: { backgroundColor?: string; accentColor?: string; borderRadius?: number };
  styles?: { container?: { paddingX?: number; paddingY?: number } };
  // Shipping fields are configured on the merchant's Whop plan, not client-side.
  collectShipping?: boolean;
  collectShippingAddress?: boolean;
  fallback?: ReactNode;
  onComplete?: (planId: string, paymentId: string) => void;
  onStateChange?: (state: WhopCheckoutState) => void;
};

export function WhopElementsCheckout({ planId, returnUrl, theme = "light", deliveryCountry, utm, styles, fallback, onComplete, onStateChange }: Props) {
  const [elements] = useState(() => loadWhop());
  const attribution = useMemo(() => ({
    utmSource: utm?.utm_source, utmMedium: utm?.utm_medium,
    utmCampaign: utm?.utm_campaign, utmTerm: utm?.utm_term,
    utmContent: utm?.utm_content,
  }), [utm?.utm_source, utm?.utm_medium, utm?.utm_campaign, utm?.utm_term, utm?.utm_content]);
  const appearance = useMemo(() => ({ theme: { appearance: theme, accentColor: "green" as const } }), [theme]);
  const defaultValues = useMemo(() => deliveryCountry ? { shippingAddress: { country: deliveryCountry } } : undefined, [deliveryCountry]);
  return <div style={{ padding: `${styles?.container?.paddingY ?? 12}px ${styles?.container?.paddingX ?? 12}px` }}>
    <WhopElements elements={elements} onLoadError={() => onStateChange?.("error")}>
      <Checkout key={planId} plan={planId} returnUrl={returnUrl} attribution={attribution} appearance={appearance} fallback={fallback}
        onComplete={completion => {
          // A waitlist entry or saved payment method is not a paid order.
          if (completion.result === "payment" && /^pay_[A-Za-z0-9]+$/.test(completion.paymentId)) {
            onComplete?.(planId, completion.paymentId);
          }
        }}>
        <CheckoutElement defaultValues={defaultValues} fallback={fallback} onReady={() => onStateChange?.("ready")} onError={() => onStateChange?.("error")} />
      </Checkout>
    </WhopElements>
  </div>;
}
