export const PLAYBOOK_PLAN_ID = 'plan_CPtQ7lRK3XyXm';
export const PLAYBOOK_REGULAR_PRICE = 29;
export const PLAYBOOK_CHECKOUT_URL = 'https://whop.com/checkout/ch_r8ysXa4wHaxDQUL/';
export const PLAYBOOK_FILES_URL = 'https://whop.com/smart-ag-ai/exp_znL1VOOXMbeLcO/app/';
export const PLAYBOOK_CONTENT_URL = 'https://whop.com/smart-ag-ai/exp_FjIVZ7xazjqlWQ/app/';
export const PLAYBOOK_EDITION = 3;
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
export function playbookOffer() {
  return { price: PLAYBOOK_REGULAR_PRICE, hostedUrl: PLAYBOOK_CHECKOUT_URL };
}
