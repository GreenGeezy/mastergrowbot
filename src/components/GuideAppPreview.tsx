import { useEffect, useState } from 'react';
import { APP_STORE_BASE_URL, PLAY_STORE_BASE_URL } from '@/components/landing/ctaLinks';

// Keep only campaign labels, never arbitrary query strings or visitor identifiers.
function campaignUrl(base: string, search: string) {
  const url = new URL(base);
  const incoming = new URLSearchParams(search);
  const defaults = { utm_source: 'website', utm_medium: 'organic', utm_campaign: 'best-ai-cannabis-growing-apps-2026' };
  for (const [key, fallback] of Object.entries(defaults)) {
    const value = incoming.get(key);
    url.searchParams.set(key, value && /^[a-zA-Z0-9_-]{1,80}$/.test(value) ? value : fallback);
  }
  url.searchParams.set('utm_content', 'article-product-preview');
  return url.toString();
}

export default function GuideAppPreview() {
  const [search, setSearch] = useState('');
  useEffect(() => setSearch(window.location.search), []);
  return (
    <section id="app-preview" aria-labelledby="app-preview-title" className="mb-10 rounded-2xl border border-landing-green/25 bg-landing-green/5 p-5 sm:p-7">
      <p className="mb-2 text-sm text-white/70">Published by MasterGrowbot AI, the app featured below.</p>
      <h2 id="app-preview-title" className="mb-5 text-2xl font-bold text-white">See the app before choosing a plan</h2>
      <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
        <figure>
          <img src="/images/premium/real-report-journal.webp" width={945} height={2048} loading="lazy" alt="MasterGrowbot AI report with its plant photo, Save to Journal and Share Analysis buttons" className="mx-auto max-h-80 w-auto rounded-xl" />
          <figcaption className="mt-2 text-xs leading-relaxed text-white/65">Existing app screenshot. Example output, not a promise of accuracy.</figcaption>
        </figure>
        <div className="space-y-4 text-base leading-relaxed text-white/80">
          <p>Review a plant photo, read the AI observations, then save the report with your journal records. Return to earlier observations instead of searching through scattered photos.</p>
          <dl className="space-y-3">
            <div><dt className="font-semibold text-white">Pro</dt><dd>Photo analysis, grow records and strain intelligence. Eligible new Pro subscribers can receive a three-day trial; check the offer in your store.</dd></div>
            <div><dt className="font-semibold text-white">Premium on iPhone</dt><dd>Adds short-video review and expands the library to 600 total strain profiles. Premium does not include the introductory Pro trial.</dd></div>
          </dl>
          <p className="text-sm text-white/70">Download is free; paid features require a subscription. Android features and offers may differ. Your store shows current pricing, billing period and renewal terms. AI observations support your judgment.</p>
          <a href="/#grow-walkthrough" className="inline-block text-landing-green underline underline-offset-4 focus-visible:outline focus-visible:outline-2">Explore the full app walkthrough</a>
          <div className="flex flex-col gap-3 lg:flex-row">
            <a href={campaignUrl(APP_STORE_BASE_URL, search)} data-cta-location="article-product-preview:ios" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-landing-green px-5 py-3 font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">View on the iPhone App Store</a>
            <a href={campaignUrl(PLAY_STORE_BASE_URL, search)} data-cta-location="article-product-preview:android" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-landing-green/50 px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">View on Google Play</a>
          </div>
        </div>
      </div>
    </section>
  );
}
