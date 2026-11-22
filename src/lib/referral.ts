// Keeps the first tagged referral (for example a LinkedIn post) through internal hops
// such as /newsletter -> /cannabis-grow-calendar, so a later signup credits the original source.
const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;
const storeKey = 'mgb.referral.v1';
export type Referral = Partial<Record<(typeof keys)[number], string>>;

function fromSearch(search: string): Referral {
  const q = new URLSearchParams(search); const r: Referral = {};
  for (const k of keys) { const v = q.get(k); if (v) r[k] = v.slice(0, 120); }
  return r;
}

export function rememberReferral() {
  if (typeof window === 'undefined') return;
  const current = fromSearch(window.location.search);
  if (!current.utm_source) return;
  try { if (!sessionStorage.getItem(storeKey)) sessionStorage.setItem(storeKey, JSON.stringify(current)); } catch { /* optional */ }
}

export function referral(): Referral {
  if (typeof window === 'undefined') return {};
  const current = fromSearch(window.location.search);
  if (current.utm_source) return current;
  try { return JSON.parse(sessionStorage.getItem(storeKey) || '{}') as Referral; } catch { return {}; }
}

/** Internal link that carries an existing referral; otherwise uses the placement tags given. */
export function withReferral(path: string, fallback: Referral) {
  const [base, hash] = path.split('#');
  const r = referral();
  const tags = r.utm_source ? r : fallback;
  const q = new URLSearchParams();
  for (const k of keys) if (tags[k]) q.set(k, tags[k] as string);
  const qs = q.toString();
  return base + (qs ? (base.includes('?') ? '&' : '?') + qs : '') + (hash ? '#' + hash : '');
}
