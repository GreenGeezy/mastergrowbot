# Crawlable app and revenue pages — October 8, 2026

Primary objective is MasterGrowbot AI subscriptions and revenue. Hardware and playbook purchases are secondary. This release gives existing app pages useful initial HTML and preserves the successful AI app guide. It also corrects a broad photo-intent rule that diverted journal/software readers to hardware instead of app CTAs.

`src/lib/publicRoutes.ts` owns public route selection. `src/entry-server.tsx` renders the same React components used by the client; `scripts/build-route-heads.mjs` generates initial HTML and checks production rewrites, H1 and exactly one self-canonical. The client preloads the matching component and hydrates the markup. Route content, metadata and schema are present without JavaScript. Unknown URLs return the custom 404; private/checkout routes use a separate client shell and are excluded from the generated catalogue and sitemap.

The lens page reuses the current $119 offer and existing checkout. The mixed GrowTech hub is a CollectionPage; the dedicated lens page has Product/Offer and BreadcrumbList. Reviews remain attributed excerpts, without numeric ratings. The visible US/Canada delivery estimate is 2–4 weeks from payment. ShippingDeliveryTime is deliberately omitted: the total estimate does not establish independent handling/transit bounds. A Google shipping enhancement may therefore remain incomplete; do not restore the obsolete blanket 14-day transit claim or restart the passed historical validation.

Three historical sitemap omissions remain for separate quality review; generation reports them instead of promoting pages solely to increase index counts. The VPD calculator content/functionality is preserved; after its October 5 recrawl, review early recovery October 19 and more fully November 2.

Release regression command against the built server: set PLAYWRIGHT_BASE_URL to http://127.0.0.1:8090 and run crawlable-revenue, applicable seo-release and testimonial tests. Do not use the development server to prove initial HTML. Existing retired multi-product $247 assertions need current-offer assertions, not production changes restoring obsolete commerce.
