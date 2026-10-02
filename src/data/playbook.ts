export const PLAYBOOK_PLAN_ID = 'plan_CPtQ7lRK3XyXm';
export const PLAYBOOK_REGULAR_PRICE = 89;
export const PLAYBOOK_LAUNCH_PRICE = 42;
export const PLAYBOOK_PROMO_CODE = 'playbook42';
export const PLAYBOOK_LAUNCH_END = '2026-10-17T05:59:59Z';
export const PLAYBOOK_CHECKOUT_URL = 'https://whop.com/checkout/ch_r8ysXa4wHaxDQUL/';
export const PLAYBOOK_FILES_URL = 'https://whop.com/smart-ag-ai/exp_znL1VOOXMbeLcO/app/';
export const PLAYBOOK_CONTENT_URL = 'https://whop.com/smart-ag-ai/exp_FjIVZ7xazjqlWQ/app/';
export function playbookOffer(now = Date.now()) {
  const remaining = Math.max(0, Date.parse(PLAYBOOK_LAUNCH_END) - now);
  const isLaunch = remaining > 0;
  return { remaining, isLaunch, price: isLaunch ? PLAYBOOK_LAUNCH_PRICE : PLAYBOOK_REGULAR_PRICE, promoCode: isLaunch ? PLAYBOOK_PROMO_CODE : undefined, hostedUrl: isLaunch ? `${PLAYBOOK_CHECKOUT_URL}?promoCode=${PLAYBOOK_PROMO_CODE}` : PLAYBOOK_CHECKOUT_URL };
}
