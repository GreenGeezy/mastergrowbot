type Campaign = Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term", string>>;
const key = "mastergrowbot.growtech.campaign.v1";
const fields = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const ttl = 30 * 24 * 60 * 60 * 1000;

export function captureGrowTechAttribution(): Campaign {
  const incoming: Campaign = {};
  if (typeof window === "undefined") return incoming;
  const query = new URLSearchParams(window.location.search);
  for (const field of fields) {
    const value = query.get(field)?.trim().slice(0, 150);
    if (value) incoming[field] = value;
  }
  try {
    if (Object.keys(incoming).length) {
      sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), campaign: incoming }));
      return incoming;
    }
    const saved = JSON.parse(sessionStorage.getItem(key) || "null");
    if (saved && Date.now() - saved.at < ttl) {
      const campaign: Campaign = {};
      for (const field of fields) if (typeof saved.campaign?.[field] === "string") campaign[field] = saved.campaign[field].slice(0,150);
      return campaign;
    }
  } catch { /* Checkout still works when browser storage is unavailable. */ }
  return incoming;
}

export function growTechCheckoutCampaign(location: string): Campaign {
  return { utm_content: location, ...captureGrowTechAttribution() };
}

export function growTechOfferUrl(location: string): string {
  void location;
  return '/grow-tech/apexel-macro-lens-kit';
}

export function attributedGrowTechCheckoutUrl(url: string | undefined, location: string) {
  if (!url) return undefined;
  const result = new URL(url);
  for (const [field, value] of Object.entries(growTechCheckoutCampaign(location))) if (value) result.searchParams.set(field, value);
  return result.toString();
}
