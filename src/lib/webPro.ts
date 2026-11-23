// Static Web Pro facts and switches. Safe to import anywhere: no SDKs are pulled in here.

const planId = (value: unknown) =>
  (typeof value === 'string' && /^plan_[A-Za-z0-9]+$/.test(value.trim()) ? value.trim() : null);

export type PlanKey = 'annual' | 'monthly';

export const WEEKLY_PHOTO_REPORTS = 40;

// Prices shown here must match the Whop plans. Whop's checkout always shows the final total.
export const PLANS: Record<PlanKey, { id: string | null; label: string; price: number; display: string; per: string; terms: string }> = {
  annual: {
    id: planId(import.meta.env.NEXT_PUBLIC_WHOP_WEB_PRO_ANNUAL_PLAN_ID),
    label: 'Yearly', price: 59, display: '$59', per: 'year',
    terms: '$59 USD billed today, then $59 every year until you cancel.',
  },
  monthly: {
    id: planId(import.meta.env.NEXT_PUBLIC_WHOP_WEB_PRO_MONTHLY_PLAN_ID),
    label: 'Monthly', price: 19, display: '$19', per: 'month',
    terms: '$19 USD billed today, then $19 every month until you cancel.',
  },
};

/** Rounded down, so the saving is never overstated. */
export const ANNUAL_SAVING_PERCENT = Math.floor((1 - PLANS.annual.price / (PLANS.monthly.price * 12)) * 100);
export const ANNUAL_PER_MONTH = (PLANS.annual.price / 12).toFixed(2);

export const availablePlans = (['annual', 'monthly'] as PlanKey[]).filter((key) => PLANS[key].id);

/** Nothing about Web Pro is linked or sold until a Whop plan ID is set in Vercel. */
export const webProLive = availablePlans.length > 0;

export const WEB_PRO_URL = 'https://www.mastergrowbot.com/pro';
export const SUPPORT_EMAIL = 'support@mastergrowbot.com';
export const WHOP_ORDERS_URL = 'https://whop.com/@me/settings/orders/';

const PLAN_STORAGE_KEY = 'mgb.web-pro.plan';

/** Remembers the chosen plan across a Google or Apple sign-in redirect. */
export function rememberPlan(plan: PlanKey) {
  try { sessionStorage.setItem(PLAN_STORAGE_KEY, plan); } catch { /* optional */ }
}

export function recallPlan(): PlanKey | null {
  try {
    const value = sessionStorage.getItem(PLAN_STORAGE_KEY);
    return value === 'annual' || value === 'monthly' ? value : null;
  } catch { return null; }
}
