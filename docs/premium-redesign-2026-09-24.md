# Homepage and GrowTech conversion redesign

## Review and priorities

Reviewed both supplied page screenshots, all five supplied app creatives, the audience brief, current source, live site product configuration, and the US App Store listing on September 24, 2026.

The strongest 80/20 opportunities were:

1. **Show the product clearly.** The original homepage grouped small promotional screenshots inside another frame. The new hero uses two larger supplied creatives without an extra phone frame, followed by an interactive four-feature preview. All five supplied creatives appear on the page. The interface itself was not regenerated.
2. **Make the offer understandable.** Added Pro and Premium comparison with explicit US iOS billing periods, trial eligibility, renewal terms, and store links. The current App Store listing says Premium has no trial and costs $199 annually; it takes precedence over the attached brief's conflicting trial and $199.99 claims. No invented reviews or new outcome guarantees were added.
3. **Show the equipment before asking for a purchase.** GrowTech now has a browsable three-product hero with existing individual product imagery, a visible kit price and $50 savings, and direct paths to individual products. Existing product specifications, 12 testimonials, and checkout mappings are retained. Product illustration and hardware/app relationship disclosures remain visible.
4. **Reduce friction.** App download links clearly distinguish iPhone and Android. Navigation now works at tablet widths. The unsupported no-credit-card statement was removed. FAQs use native accessible disclosure controls, with homepage FAQ schema generated from the same content shown to visitors.
5. **Build a coherent premium visual identity.** Forest green, soft mint, an ivory editorial section, simpler typography, restrained motion, and fewer competing effects. Removed particle rendering from these two pages. Newly added imagery uses WebP; the botanical background is about 136 KB. Motion stops for reduced-motion preferences.

Existing book and newsletter conversion paths remain. The Amazon book CTA is now a text button rather than relying on an external button image that failed to render during review.

## Audience fit

- First-time growers get a short explanation and a three-step app overview.
- Experienced hobbyists can inspect the actual supplied product previews and compare plans.
- Equipment buyers can inspect each tool, choose the kit or a single item, and see shipping and subscription distinctions before checkout.

The design uses a broad grower audience; it does not depend on assumptions about race or gender from the brief. The copy markets observation and record-keeping benefits without promising guaranteed diagnosis, yield, or harvest outcomes.

## Generated asset

Built-in image generation was used for `public/images/premium/botanical-hero.webp`. Prompt:

> Create a premium editorial photographic website hero background for MasterGrowbot, an indoor plant observation app. Wide landscape 1536x1024 composition. Realistic intimate home indoor cannabis garden, beautifully detailed green foliage on the RIGHT half, subtle warm ivory LED light bars in far background, deep forest green and almost black shadows on the LEFT half with ample empty dark space for website text. Sophisticated luxury botanical magazine photography, 50mm shallow depth of field, natural believable plant anatomy, restrained emerald palette, no purple neon, no holograms, no interfaces, no text, no logos, no people, no products or fabricated hardware. This is atmospheric decoration behind real app screenshots that will be added in code.

The site uses a five-second settling animation on this image rather than an autoplay video download. No video was created. Supplied app assets were compressed to `public/images/premium/app-{1..5}.webp`; existing hardware artwork was optimized without redesigning it.

## Validation

- Production Vite build passed; repository retains existing large-chunk and outdated Browserslist warnings.
- ESLint passed for edited TSX and FAQ data files.
- Browser checks passed at widths 320, 390, 768, and 1440: single H1, no horizontal overflow, no Vite overlay, navigation menu, app feature switching, hardware switching, app store destinations, FAQ disclosure, and mobile sticky kit CTA.
- All 12 existing reviews remain in the three product groups.
- Clicked all four product purchase routes; confirmed their matching checkout URLs, order page headings, and embedded checkout containers. Public Whop configuration was read from the live site's compiled product asset for local verification only. No credentials or local configuration were committed.
- No page runtime errors detected. Actual card submission and successful payment were not tested.
- The standard browser download and agent-browser daemon did not work in this runtime. The checks used Playwright with a local Chromium binary instead.
- Full repository TypeScript checking reports pre-existing missing chat/Supabase modules, WhopCheckoutState imports, and a particle resize type error in files untouched by this change. These are separate from the successful production build.

Re-run `node scripts/verify-premium.mjs` with public Whop variables available. Set `BROWSER_EXECUTABLE_PATH` if using an external Chromium and `REVIEW_OUTPUT` to choose screenshot location.

## Measurement after launch

This is a conversion hypothesis, not a proven uplift. Existing app CTA tracking and checkout events are preserved. Added `app_feature_select` and `growtech_hero_product_select` events show which product demonstrations attract attention.

Compare matched traffic periods and device/source cohorts:

- Homepage sessions → iOS/Android store click rate → store-reported trial starts → paid subscriptions.
- GrowTech sessions → product selection → checkout starts → confirmed purchases and revenue per session.
- Kit share of orders and average order value.

Website store clicks alone do not establish paid app conversions. Use App Store/Google Play and subscription reporting for the downstream measures. Verify purchase instrumentation against actual Whop receipts before treating analytics purchase totals as accounting truth. Evaluate with enough traffic and avoid attributing a change in traffic mix to design alone.
