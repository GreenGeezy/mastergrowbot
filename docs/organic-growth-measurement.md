# Organic app conversion measurement

The deployed Google tag uses `ios_app_click` and `android_app_click`. Keep these names to preserve historical reporting. `app_store_click` and `play_store_click` are not emitted by this site; do not emit duplicate aliases or sum both naming schemes.

Each event includes `page_path`, `article_slug` for guide routes, `cta_location`, historical `location`, and `link_url`. The delegated click handler in index.html covers dynamically rendered links. Inline and closing buttons include platform/location labels; Markdown links use `article-body`; unlabelled navigation/footer links use `navigation-or-footer`. `page_path` identifies the article even when the destination campaign is a navigation campaign.

Use one event per click. GA4 custom dimensions for article_slug and cta_location can be configured separately. Verification captures the real handler's gtag calls without claiming that a GA4 backend accepted data. Consent, network filtering, and account configuration can affect collection.

Compare organic landing-page sessions and store-click events over matching windows. A store click is not an install, trial, subscriber or revenue event. Those require app-side attribution; missing access does not block a website release.

## Release checks

Run build, lint, and `npx playwright test tests/seo-release.spec.ts tests/grow-tech-testimonials.spec.ts`. The SEO suite renders every guide string through the sanitizer, checks for visible Markdown links, rejects executable HTML, and verifies target metadata, links, mobile layout and event payloads.

The shared shell has no canonical. React Helmet owns one canonical per route. Full static rendering is a future enhancement: it needs a deployment-compatible generation step and route tests. It is not required for today's reliable client-rendered route. Never restore a homepage canonical in the shared shell.

## Claim review: 2026-09-06

The journal-app guide was replaced with a software-selection checklist. Removed unsupported percentages, personal testing, competitor prices/capabilities, user counts and outcome guarantees. Store listings support only the explicitly attributed app descriptions, not efficacy claims. Sources: https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060 and https://play.google.com/store/apps/details?id=com.mastergrowbot.app.

Removed shared 4.8/50 aggregateRating and unspecific article rating badges. The US Apple listing currently shows 5.0 from five ratings, which does not support the old schema. Do not hard-code a replacement without a dated, platform-specific presentation. Removed numeric hardware review ratings and default product stars because original store evidence is absent; preserved user-supplied review text and provenance records. No new reviews were invented.
