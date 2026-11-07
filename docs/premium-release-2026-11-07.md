# Premium conversion release / November 7, 2026

## What changed

App-first homepage; light and Amazon IPM book follow the final app conversion section. New imagegen artwork uses charcoal, warm white and forest green. Actual app screenshots remain separate from generated grower illustrations. Motion exports have controls, static posters and reduced-motion support.

GrowTech focuses on the available US AG1000 offer. Unavailable hardware is excluded from primary choices. Unsupported yield-claim imagery is removed. No new suppliers, inventory purchases or advertising spend were authorized by this release.

Paid guide acquisition is withdrawn from the website. Existing Whop buyer access remains. A four-page quickstart and CSV log are free. A new 24-page field guide is a review edition, not a paid deliverable. Merchant-side hosted-plan availability must be verified separately; website withdrawal is not a claim that Whop plans were deactivated.

## Observed baseline

Whop Websites, www.mastergrowbot.com, November 1-7, read November 7: 50 unique visitors, 193 page views, GrowTech 23 page views, Home 69 page views; attributed revenue $0 and payment.completed funnel 0 within a 24-hour conversion window. Devices: 34 desktop, 16 mobile. These are pixel observations, not confirmed installs or a complete payments ledger; internal traffic has not been excluded from this reading.

The earlier October 21 campaign baseline has null product-session and subscription fields. Do not fill them with zero. Current matched 28-day GA4 and app-store/subscription exports remain required to evaluate uplift. No current supplier quote or settled hardware margin was verified in this release.

## Revenue scorecard

Run `node scripts/revenue-scorecard.mjs <private-input.json>` with a matching monthly window, verified orders and allocated monthly operating costs. An order has id, status, test, revenueExTax, supplierCost, shippingImportCost, fees, refunds, returnsReserve, supportCost and acquisitionCost. Discounts are already reflected in revenueExTax. All amounts use USD. Missing costs and duplicate receipt IDs fail validation. App metrics are separate optional fields; never infer downloads from clicks.

The $500 monthly net target requires (500 + operating costs) / contribution per order, rounded up. At $100 operating costs and $40 contribution, 15 orders are needed. At an assumed 2% purchase rate, that requires 750 qualified sessions. This is a scenario, not a forecast.

## Acquisition and experiments

Days 1-30: establish traffic and payment baselines; deploy pages separately if checkout fails; retain current $199 light price as control. Do not discount before checking delivery and checkout friction. No claim of competitive advantage until exact delivered alternatives and repeat-order supplier costs are verified.

Days 31-60: review matched source/device/country cohorts. If traffic is insufficient, publish useful equipment content on the owned website and prepare organic demonstrations. Social messages are drafts until explicitly authorized for sending. If checkout starts are scarce, test product fit and contents clarity. If checkout starts do not lead to paid receipts, investigate errors, delivery and final totals first.

Days 61-90: repeat placements with verified profitable orders, account for refunds and subscription renewals. Evaluate app paid subscribers and proceeds alongside hardware profit. A 20% relative improvement is a target, not an established result. Low-volume comparisons remain descriptive until adequate evidence accumulates.

Alternative product research: temperature/RH meter plus IR thermometer remains unqualified. Search results did not establish an exact repeat-order delivered price, device accuracy, supported destination or return economics. Do not list it. Supplier scope remains Alibaba, AliExpress and Temu; no stock purchase in advance.

## Creative provenance

Eight original masters were generated with the built-in imagegen tool: app-hero, app-workflow, app-journal, light-hero, light-dimmer, light-installation, light-contents, guide-editorial. Master PNGs are in source-assets/premium-2026; responsive WebP assets in public/images/premium-2026. Motion is editorial animation of stills, not footage of actual customers or measured product performance. GIF exports are in ignored output/media/premium-2026; MP4/WebM are public.

Prompt direction: photorealistic editorial adult home growers, charcoal clothing, realistic modest indoor setups, warm white lighting, forest-green/graphite palette, natural hands, no advertising text or invented app interface. Product prompts use inspected AG1000 supplier/reference images and prohibit additional controls or performance claims. Guide imagery is illustrative; page previews are rendered from actual PDFs.

## Release boundaries

Preserve existing checkout identifiers and buyer entitlements. Never treat a callback or thank-you URL alone as money received. No real payment, supplier order, social message, or account upgrade is part of this release. The 90-day operating cycle cannot be completed on launch day.

## Verification

Production build and 77-route prerender passed during implementation. Lint passed with zero errors and six pre-existing Fast Refresh warnings. Static canonical/application-shell test passed. The headless browser navigation test failed at Chromium launch (180-second timeout), before page assertions. The PDF review edition does not pass the premium visual quality gate and is not offered for sale. The free quickstart was rendered and inspected; its output is a printable worksheet, not an interactive form.

## Final creative review
The rejected female scenes and misaligned-arm light draft are not used. Final cast includes an adult bearded cap-wearing grower, a long-haired grower and a short-haired grower. Anatomy and product-contact points were reviewed.
