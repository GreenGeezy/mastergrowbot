import { WhopCheckoutEmbed, type WhopCheckoutState } from "@whop/checkout/react";
import { Link, useSearchParams } from "react-router-dom";

type ProductKey = "kit" | "soil" | "environment" | "scout";

const productPlanIds: Record<ProductKey, string | undefined> = {
  kit: import.meta.env.NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID,
  soil: import.meta.env.NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID,
  environment: import.meta.env.NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID,
  scout: import.meta.env.NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID,
};

const productLabels: Record<ProductKey, string> = {
  kit: "MasterGrowbot AI Grow Tech Kit",
  soil: "MasterGrowbot AI Soil Health Meter 6-in-1",
  environment: "MasterGrowbot AI Environment Monitor",
  scout: "MasterGrowbot AI Scout Camera 10-20X",
};

const isProductKey = (value: string | null): value is ProductKey =>
  value === "kit" || value === "soil" || value === "environment" || value === "scout";

const maskPlanId = (planId: string) => `${planId.slice(0, 10)}...`;

export default function WhopEmbedTest() {
  const [searchParams] = useSearchParams();
  const requestedProduct = searchParams.get("product");
  const product: ProductKey = isProductKey(requestedProduct) ? requestedProduct : "kit";
  const planId = productPlanIds[product]?.trim();

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-landing-green/20 bg-white/[0.035] p-5 shadow-2xl shadow-landing-green/10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-green">Whop embed diagnostic</p>
          <h1 className="mt-3 text-3xl font-bold">{productLabels[product]}</h1>
          <div className="mt-4 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
            <p>
              Product query: <span className="font-semibold text-white">{product}</span>
            </p>
            <p>
              Plan ID present: <span className="font-semibold text-white">{planId ? "yes" : "no"}</span>
            </p>
            <p>
              Plan ID preview: <span className="font-semibold text-white">{planId ? maskPlanId(planId) : "not configured"}</span>
            </p>
            <Link className="font-semibold text-landing-green hover:underline" to="/grow-tech">
              Return to Grow Tech
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0b0b12]">
          {planId ? (
            <WhopCheckoutEmbed
              planId={planId}
              returnUrl="https://www.mastergrowbot.com/grow-tech/thank-you"
              theme="dark"
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
                <div className="flex min-h-[420px] items-center justify-center p-8 text-sm font-semibold text-white/60">
                  Loading secure checkout...
                </div>
              }
              onComplete={(completedPlanId: string, receiptId?: string) => {
                console.log("whop embed complete", { product, completedPlanId, receiptId });
              }}
              onStateChange={(state: WhopCheckoutState) => {
                console.log("whop embed state", { product, state });
              }}
            />
          ) : (
            <div className="p-8 text-sm font-semibold text-amber-100">No Plan ID configured for this product.</div>
          )}
        </div>
      </div>
    </main>
  );
}
