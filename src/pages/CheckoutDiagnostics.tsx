import { Link } from "react-router-dom";

const growTechSuccessUrl = "https://www.mastergrowbot.com/grow-tech/thank-you?status=success";
const aiStrategySuccessUrl = "https://www.mastergrowbot.com/ai-strategy/intake?status=success";

const publicCheckoutConfig = [
  {
    area: "GrowTech",
    label: "Scout Camera plan",
    key: "NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID",
    value: import.meta.env.NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID,
  },
  {
    area: "GrowTech",
    label: "Scout Camera checkout URL",
    key: "NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL",
    value: import.meta.env.NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL,
  },
  {
    area: "GrowTech",
    label: "Environment Monitor plan",
    key: "NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID",
    value: import.meta.env.NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID,
  },
  {
    area: "GrowTech",
    label: "Environment Monitor checkout URL",
    key: "NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL",
    value: import.meta.env.NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL,
  },
  {
    area: "GrowTech",
    label: "Soil Health Meter plan",
    key: "NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID",
    value: import.meta.env.NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID,
  },
  {
    area: "GrowTech",
    label: "Soil Health Meter checkout URL",
    key: "NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL",
    value: import.meta.env.NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL,
  },
  {
    area: "GrowTech",
    label: "Grow Tech Kit plan",
    key: "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID",
    value: import.meta.env.NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID,
  },
  {
    area: "GrowTech",
    label: "Grow Tech Kit checkout URL",
    key: "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL",
    value: import.meta.env.NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL,
  },
  {
    area: "AI Strategy",
    label: "AI Opportunity Map plan",
    key: "NEXT_PUBLIC_WHOP_AI_OPPORTUNITY_DEPOSIT_PLAN_ID",
    value: import.meta.env.NEXT_PUBLIC_WHOP_AI_OPPORTUNITY_DEPOSIT_PLAN_ID,
  },
  {
    area: "AI Strategy",
    label: "AI Opportunity Map checkout URL",
    key: "NEXT_PUBLIC_WHOP_AI_OPPORTUNITY_DEPOSIT_CHECKOUT_URL",
    value: import.meta.env.NEXT_PUBLIC_WHOP_AI_OPPORTUNITY_DEPOSIT_CHECKOUT_URL,
  },
  {
    area: "AI Strategy",
    label: "AI Agent Buildout plan",
    key: "NEXT_PUBLIC_WHOP_AI_AGENT_BUILDOUT_DEPOSIT_PLAN_ID",
    value: import.meta.env.NEXT_PUBLIC_WHOP_AI_AGENT_BUILDOUT_DEPOSIT_PLAN_ID,
  },
  {
    area: "AI Strategy",
    label: "AI Agent Buildout checkout URL",
    key: "NEXT_PUBLIC_WHOP_AI_AGENT_BUILDOUT_DEPOSIT_CHECKOUT_URL",
    value: import.meta.env.NEXT_PUBLIC_WHOP_AI_AGENT_BUILDOUT_DEPOSIT_CHECKOUT_URL,
  },
];

function maskValue(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return "missing";
  }

  if (trimmed.length <= 12) {
    return `${trimmed.slice(0, 3)}...${trimmed.slice(-2)}`;
  }

  try {
    const url = new URL(trimmed);
    return `${url.origin}${url.pathname.slice(0, 12)}...`;
  } catch {
    return `${trimmed.slice(0, 8)}...${trimmed.slice(-4)}`;
  }
}

export default function CheckoutDiagnostics() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-xl border border-landing-green/20 bg-white/[0.035] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-green">
            Checkout diagnostics
          </p>
          <h1 className="mt-3 text-3xl font-bold">Whop public checkout configuration</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/62">
            This hidden diagnostic page only shows whether public checkout environment variables are present. Values are
            masked and no secret keys are displayed.
          </p>
          <div className="mt-5 grid gap-3 text-sm text-white/72 md:grid-cols-2">
            <p>
              GrowTech success URL: <span className="font-semibold text-white">{growTechSuccessUrl}</span>
            </p>
            <p>
              AI Strategy success URL: <span className="font-semibold text-white">{aiStrategySuccessUrl}</span>
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b12]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/[0.08] text-xs uppercase tracking-[0.14em] text-white/45">
              <tr>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Config</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Masked value</th>
              </tr>
            </thead>
            <tbody>
              {publicCheckoutConfig.map((item) => {
                const present = Boolean(item.value?.trim());

                return (
                  <tr key={item.key} className="border-b border-white/[0.06] last:border-0">
                    <td className="px-4 py-3 text-white/70">{item.area}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="mt-1 font-mono text-xs text-white/40">{item.key}</p>
                    </td>
                    <td className={present ? "px-4 py-3 text-landing-green" : "px-4 py-3 text-amber-200"}>
                      {present ? "present" : "missing"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-white/56">{maskValue(item.value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Link className="inline-flex font-semibold text-landing-green hover:underline" to="/grow-tech">
          Return to GrowTech
        </Link>
      </div>
    </main>
  );
}
