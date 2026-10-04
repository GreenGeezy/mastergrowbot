export const PLAYBOOK_PLAN_ID = 'plan_CPtQ7lRK3XyXm';
export const PLAYBOOK_REGULAR_PRICE = 89;
export const PLAYBOOK_LAUNCH_PRICE = 42;
export const PLAYBOOK_PROMO_CODE = 'playbook42';
export const PLAYBOOK_LAUNCH_END = '2026-10-17T05:59:59Z';
export const PLAYBOOK_CHECKOUT_URL = 'https://whop.com/checkout/ch_r8ysXa4wHaxDQUL/';
export const PLAYBOOK_FILES_URL = 'https://whop.com/smart-ag-ai/exp_znL1VOOXMbeLcO/app/';
export const PLAYBOOK_CONTENT_URL = 'https://whop.com/smart-ag-ai/exp_FjIVZ7xazjqlWQ/app/';
export const PLAYBOOK_EDITION = 2;
export const PLAYBOOK_PAGE_COUNT = 32;
export const FIELD_WORKBOOK_PAGE_COUNT = 8;
export const QUICKSTART_PAGE_COUNT = 12;
export function playbookEcommercePayload(price: number, location: string) {
  return {
    currency: 'USD', value: price, checkout_source_page: '/playbooks',
    cta_location: location, plan_id: PLAYBOOK_PLAN_ID,
    items: [{ item_id: 'ai-plant-observation-playbook', item_name: 'AI Plant Observation Playbook', item_category: 'Digital guides', price, quantity: 1 }],
  };
}
export function playbookOffer(now = Date.now()) {
  const remaining = Math.max(0, Date.parse(PLAYBOOK_LAUNCH_END) - now);
  const isLaunch = remaining > 0;
  return { remaining, isLaunch, price: isLaunch ? PLAYBOOK_LAUNCH_PRICE : PLAYBOOK_REGULAR_PRICE, promoCode: isLaunch ? PLAYBOOK_PROMO_CODE : undefined, hostedUrl: isLaunch ? `${PLAYBOOK_CHECKOUT_URL}?promoCode=${PLAYBOOK_PROMO_CODE}` : PLAYBOOK_CHECKOUT_URL };
}
