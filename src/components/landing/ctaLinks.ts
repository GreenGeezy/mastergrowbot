export const AMAZON_BOOK_URL = 'https://a.co/d/07dQFaw0';
export const GROW_TECH_URL = '/grow-tech';
export const APP_STORE_BASE_URL =
  'https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060';
export const PLAY_STORE_BASE_URL =
  'https://play.google.com/store/apps/details?id=com.mastergrowbot.app';

export function appStoreUrl(campaign: string) {
  return `${APP_STORE_BASE_URL}?utm_source=website&utm_medium=organic&utm_campaign=${campaign}`;
}

export function playStoreUrl(campaign: string) {
  return `${PLAY_STORE_BASE_URL}&utm_source=website&utm_medium=organic&utm_campaign=${campaign}`;
}
