# Whop Elements migration — October 8, 2026

Legacy Whop embeds are replaced with `@whop/elements` and `@whop/elements-react`, following https://docs.whop.com/developer/guides/embed-checkout. Existing merchant plans, prices and guide entitlements remain authoritative.

## Purchase behavior

- A shared Elements checkout mounts the existing plan, preserves campaign attribution and keeps hosted Whop fallback links visible.
- Hardware collects shipping through its merchant plan. The selected US/Canadian destination prefills its shipping-country field; digital plans do not request shipping.
- Only an Elements completion with `result: payment` and a `pay_` ID reaches purchase analytics. Setup intents, waitlists, legacy window messages and return-page visits do not count as purchases.
- Purchase IDs are deduplicated. Fulfillment and revenue reconciliation continue to use actual Whop paid records, not browser callbacks.
- Return URLs no longer hardcode success. Failed and canceled returns offer retry/help; payment-return pages direct buyers to their Whop receipt and protected files.
- CSP includes Whop's SDK-provided payment requirements and Apple's payment-button font host.
- Old diagnostic bookmarks route to current offer pages instead of exposing superseded plans.

## Live Playwright checks

| Offer | Website USD price | Shipping collection | Destination prefill | Form loaded |
|---|---:|---|---|---|
| Lens + guide | $119 | Yes | US | Passed |
| Soil meter + guide | $99 | Yes | Canada | Passed |
| Tent + guide | $289 | Yes | Canada | Passed |
| Equipment Quickstart | $19 | No | — | Passed |
| AI Plant Observation Playbook | $29 | No | — | Passed |

Whop may display a localized payment currency based on the buyer's region; its quote and final total remain authoritative. Testing occurred from a Mexican IP, so several quotes displayed MXN.

Additional checks passed: hardware destination gate prevents an unsupported-country form; failed/canceled hardware and Playbook returns emit no purchase; a fabricated success-return URL emits no purchase; an empty form displays Whop's required-field message without completing payment. Mobile FAQs expand without horizontal overflow. The Playbooks Amazon gallery, images, original link and separate placement tracking work on mobile and desktop.

Build passed and focused lint passed. Whole-project TypeScript checking still reports unrelated pre-existing errors in inactive chat/Supabase/audio files. Whop's guest checkout emits some third-party API/permissions warnings; these are not a claim of a zero-warning browser console.

No real payment was submitted or charged. New-buyer guide entitlement, bank settlement and the first genuine fulfilled order require verification against an actual paid Whop transaction.

Screenshots are saved locally under `output/playwright/`. Production deployment of commit `dc001184b50a98ba8e83c566f356ad18c6b0f4ad` was confirmed READY in Vercel.
