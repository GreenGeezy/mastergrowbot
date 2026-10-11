# MasterGrowbot premium grow lab hero

The v8 homepage hero presents MasterGrowbot as a premium cannabis grow intelligence app. The headline and the existing v7 video, narration, and captions are preserved. Both platform buttons receive the same visual treatment and retain their existing destinations and campaign parameters.

The default preview is an explicitly illustrative, beginner-friendly report for **yellow lower leaves in a soil-grown plant**. It gives conditional watering and drainage checks, prompts a feed-label check, and encourages recording changes. It does not assert a diagnosis or invent an AI confidence score. Photo and Journal show supplied app screens. These are separate feature examples, not a claim that all three depict the same plant.

This editorial example was informed by [University of Maryland Extension's overwatering guidance](https://www.extension.umd.edu/resource/overwatered-indoor-plants) and [Utah State University's hemp nutrient-deficiency guide](https://extension.usu.edu/planthealth/ipm/notes_ag/hemp-nutrient-deficiencies). Yellow lower leaves can have several causes, so the preview offers useful first checks without equating a symptom with a confirmed deficiency.

The report follows the supplied app screenshot�s white surface, prominent green action card, and rounded 2�2 summary tiles. Amber marks a symptom to check, with an explicit warning icon and label; green identifies the recommended action, not a claim that the plant is healthy. Findings and supporting details use dark neutral text. The example badge stays visible, and no severity, confidence, recovery result, or health score is invented. Text/background contrast is 6.07:1 for the amber notice, 6.10:1 for white action text, 11.65:1 for the finding, and 4.90:1 for supporting labels. Icons and explicit labels convey meaning alongside color.

## Preview and verification

- Development preview: http://127.0.0.1:8096/?mgb_analytics=off
- Production preview: http://127.0.0.1:8097/?mgb_analytics=off
- Run `npm run build` and the focused ESLint checks for the three hero components and `heroDemoMetadata.ts`.
- Run `HERO_BASE_URL=http://127.0.0.1:8097 node scripts/check-hero-v8.cjs` (set the environment variable using the host shell's syntax).
- Run `node scripts/measure-hero-v8.cjs` for three mobile performance runs against the production preview.
- Browser results and screenshots are saved under `output/playwright/hero-v8/`. The scripts default to installed Windows Chrome; set `HERO_CHROME_PATH` to use another executable.

The browser check covers 320, 360, 390, 430, 768, 899, 900, 1024, 1280, and 1440px widths. It verifies the headline, button destinations and size parity, one click event per activation including icon clicks, one exposure per page view, complete report visibility, card placement, keyboard activation, focus outlines, reduced motion, image failure, manual preview states, video/captions, video milestone deduplication, and the QA analytics opt-out. Store navigation is intercepted locally for these checks; no store clicks are sent to production analytics.

Performance conditions: production build served by Vite preview, 390×844 mobile viewport, device scale factor 2, CPU slowed 4×, 1.64 Mbps download / 0.77 Mbps upload with 150ms latency, disabled cache, fresh browser context for each run. Final local runs measured LCP 2,732 / 2,884 / 2,140ms (median 2,732ms) and CLS 0.0005 / 0.0005 / 0.0004. CLS and the image-payload targets pass; the 2.5-second LCP target is not consistently met under these throttled conditions. Responsive hero artwork is preloaded from the homepage head and has high fetch priority. Local synthetic results are not field Core Web Vitals. See `output/playwright/hero-v8/performance.json` for the measured runs and median.

## Analytics and conversion review

The existing delegated click handler in `index.html` remains the single source of store-button click events. It emits `ios_app_click` or `android_app_click` and now adds `hero_version=grow_lab_v8`, `placement=homepage_hero`, `platform`, and `device_category` for hero links. Existing `location`, `cta_location`, campaign URLs, and page-path fields are retained. The React button component does not emit a second click event.

`hero_exposure` fires once when the hero enters the viewport on each homepage mount. Device categories are mobile below 600px, tablet below 900px, and desktop otherwise. Preview-step events carry the same hero version. Video events preserve `creative=hero_v7` to identify the unchanged media and separately include the new hero version. QA opt-out suppresses all these events.

Before production release, export the last **14 complete days** of homepage traffic and existing hero store-click events from GA4. Record the release timestamp and compare with at least **14 complete days** after release, using the same timezone, platform/device segments, and traffic-source filters.

- Baseline-compatible primary metric: distinct homepage sessions with at least one `ios_app_click` or `android_app_click` at `cta_location=hero:ios` or `hero:android`, divided by distinct homepage sessions. Count a session once, even if it clicks repeatedly; also report each platform independently.
- V8-only exposure metric: distinct sessions with a hero store click divided by distinct sessions with `hero_exposure`. The old hero did not emit exposure events, so this denominator cannot be retrospectively reconstructed for a direct baseline comparison.
- Review store-reported downloads and attributed trial/paid conversions only if the store or subscription reporting supports the same campaign/cohort. Website clicks alone are not installations or subscriptions.
- Compare source mix and mobile/desktop mix before interpreting changes. This rollout is a before/after comparison, not a causal A/B experiment or a guaranteed conversion lift.

No production analytics export or deployment was performed in this implementation. The tested local preview is ready for review. Production release and the post-release comparison remain future steps.

## ImageGen assets and exact prompts

Generated with the **built-in ImageGen tool**, then resized and encoded to WebP for delivery. The foreground alpha channel was validated after optimization. The responsive artwork and foreground together total **127,314 bytes on desktop** and **64,252 bytes on mobile**, below the 350KB initial hero-image target. The report is native HTML and adds no report-image request. All artwork is decorative and does not replace accessible webpage text.

Final project assets (relative to this repository):

- `public/images/premium/hero-grow-lab-v8.webp` — 1200×800, 85,098 bytes.
- `public/images/premium/hero-grow-lab-mobile-v8.webp` — 660×880 crop, 22,036 bytes.
- `public/images/premium/hero-leaf-accent-v8.webp` — 480×320 with transparency, 42,216 bytes.

Backdrop prompt:

> Use case: ads-marketing. Asset type: cinematic backdrop for MasterGrowbot mobile app landing-page product showcase. Create photorealistic premium indoor cannabis grow lab, landscape composition 3:2. Detailed healthy serrated cannabis leaves with real botanical texture framing the left and right edges; rich near-black forest green, soft emerald rim light and mint highlights. Subtle defocused grow-tent equipment and LED light silhouettes in distant background. Center 55 percent is dark, spacious, softly lit negative space reserved for a large phone added later by webpage code. Sophisticated precision horticulture, aspirational home grower equipment aesthetic, high-end editorial photography. Restrained atmosphere with natural believable plants. No text, no phones, no screens, no interface, no logo, no watermark, no people, no holographic widgets. Bright legible leaf edges and a quiet emerald glow in center, never overly busy.

Foreground prompt (transparent-background option enabled):

> Use case: ads-marketing. Asset type: transparent botanical foreground cutout for MasterGrowbot premium grow-lab landing page. Photorealistic isolated restrained cluster of three healthy cannabis fan leaves attached to a short natural stem. Detailed serrated edges and fine veins, rich forest green with subtle emerald and mint rim lighting, studio horticulture photography. Composition: small diagonal cluster sweeping inward from lower right corner; airy space around the leaves, leaves fully within frame. Real transparent alpha background. No text, no phone, no screen, no logo, no watermark, no planter, no environment, no glow cloud, no shadows on a background. This decor frames the outer edge of a webpage phone showcase.

## Rollback

The original hero is preserved in Git at `e2781b2229f39bfabb4ca862ace5167ec0e8146e`. Restore only the hero components, `premium.css`, `heroDemoMetadata.ts`, and the small click-handler addition in `index.html` from that revision if rollback is needed. Avoid reverting unrelated work. The v8 report component, artwork, QA scripts, and this document can remain unused without affecting the old hero. Rebuild and verify the restored version before release. The v7 video assets are unchanged.
