# GrowTech implementation — October 2, 2026

## Completed sales system

The website now presents six offers, with dedicated $19 digital guide and $159 camera-plus-guide products. Original hardware prices remain $149, $89, $59 and $247. The kit saves $50 against buying three tools individually; the camera-plus-guide offer saves $9. No app subscription is included.

All six checkout routes have verified public plan defaults, so missing Vercel environment variables no longer disable the purchase buttons. Existing environment overrides still work. These identifiers are public checkout references, not secrets. Digital checkout requests no shipping; hardware checkout requests shipping. Confirmation pages link guide buyers to their purchased content. Product structured data covers six offers and omits hardware shipping policy for the digital guide.

## Whop configuration

Business: Smart Ag AI, `biz_8m5fp7bUlZOdVX`.

| Offer | Product | One-time plan |
| --- | --- | --- |
| Camera $149 | prod_SqHhNLPrKjewI | plan_ft9q9KbJXeXj6 |
| Monitor $89 | prod_gIru7N12XzcoR | plan_Yl4OQwlyNfGBo |
| Soil meter $59 | prod_H4NrLbue3oB8U | plan_Ob3f8dS6X0TfA |
| Kit $247 | prod_cuAwzisUONAMb | plan_jWq4J44VEStQ7 |
| Equipment guide $19 | prod_yuj6A2fFWUjvp | plan_0z6oCIxZurR6K |
| Camera + guide $159 | prod_3zIlus1lvKPnW | plan_AfveSW6CMa60i |

Whop AI reported archiving camera split plan `plan_qHPEUT4TRMas1`, kit split plan `plan_4Db5nnrz2lYhh`, and superseded camera guide/bundle plans `plan_QtsBFp0vX8F8U` and `plan_Ivee5F1Ih53Ha`, each with zero memberships. Camera and kit product editors subsequently showed only their original one-time pricing option. Nothing was permanently deleted.

The product-level Show discount setting was manually disabled and saved for camera and kit. This removes invented reference prices and inaccurate 20%/33% banners independently of plan-level strike-through prices.

Guide and camera bundle editors both show these dedicated apps checked, with unrelated original apps unchecked:

- Files: https://whop.com/smart-ag-ai/exp_v1pD0nPocHfsir/app/
- Start Here: https://whop.com/smart-ag-ai/exp_5jVDuXepzVkXb7/app/

Paid uploads: nine-page `growtech-equipment-quickstart-v1.pdf`, two-page `observation-worksheets.pdf`, and `observation-log.csv`. Start Here is published and renders in the guide product preview. Paid files stay outside the public repository in ignored `output/pdf/`; do not move them into `public/`.

Public two-page sample and three basic setup sheets live in `public/downloads/grow-tech/`. Those same setup sheets were uploaded to the original hardware Files app `exp_tWZqLy3T3DRTNl`. They explain general handling and observation, and defer device-specific power, calibration and compatibility to the manufacturer's supplied manual. Supplier manuals and physical samples were unavailable; exact model instructions are not represented as independently verified.

The separate Whop storefront https://mastergrowbot-store.whop.site was published with all six offers, one-time pricing and corrected buyer links. This storefront remains separate from mastergrowbot.com. Hosted guide checkout `ch_dyvbzcXI9sKPmT8` and bundle checkout `ch_13gOqb4vFDvfXzQ` return to the product-specific main-site thank-you pages.

## Money and profit controls

New seller-collected installment purchases are disabled. One-time checkout collects the full displayed order amount in a single transaction. That is not a promise that gross order value becomes instantly withdrawable balance: processing/platform fees, tax, affiliate fees, refunds, disputes and reserves can affect net funds and timing. No payout routing or fraud protections were changed.

Financing was not enabled. Use full payment until an approved provider's actual funding schedule and fees have been checked. Do not accept future Economic Intelligence suggestions to unarchive split-pay plans if upfront collection remains the requirement.

Before discounts or paid traffic, calculate contribution per offer: collected price minus product cost, shipping, payment/platform fees, expected support/refunds and advertising. Audit existing recovery coupons in Whop for eligibility and expiry; their account-specific terms were not established in this release. No recovery messages were resent.

## Validation and remaining checks

- Production build passes; changed-file ESLint passes; five existing GrowTech regression tests pass.
- Playwright browser check confirms guide total due today $19 with no shipping form and bundle total $159 with shipping fields. No payment was submitted.
- All PDF pages were rendered and visually checked; paid and free files contain useful content rather than empty placeholders.
- Existing full-project TypeScript check still reports unrelated missing legacy chat/backend modules and old SDK/particle typing problems. The production build succeeds; this release does not claim the entire old codebase is error-free.
- Local Vercel analytics endpoint is unavailable outside Vercel. Whop embeds also emit third-party device/payment-manifest warnings; payment forms still render. No security controls were weakened to suppress them.
- Real buyer payment settlement, net ledger reconciliation and supplier shipment require an actual order. Admin product preview is not a substitute for settlement verification.
- Kit Discover review remains pending. New offers can sell through direct checkout without implying marketplace approval.

## Next 7–14 days

1. Verify supplier stock, current landed costs and actual manuals. Replace generic setup notes only with model-verified instructions.
2. Have an authorized buyer complete one real guide order and reconcile receipt, access and net Whop ledger entry. Repeat with a hardware order and verify fulfillment/tracking. Record fees and holds; do not infer balance from a success URL.
3. Measure qualified page visits → offer clicks → checkout starts → paid receipts → refunds, separately for each offer. Sample downloads are interest, not revenue. Browser purchase signals should be reconciled against Whop paid receipts.
4. Fix the largest observed dropout before buying more traffic. Keep the kit primary, guide secondary and $159 bundle an optional alternative. Do not add more guides until this one shows paid demand.
5. Review profit per order and support volume after the first ten orders. Test one change at a time: headline, sample prominence or offer placement. Expand traffic only when contribution remains positive.

## Generated image record

Tool: built-in imagegen. Website asset: `public/images/grow-tech/quickstart-cover.webp`, resized to 853 × 1280. Decorative illustration, not a product photograph or evidence of equipment features.

Prompt: “Use case: ads-marketing. Create an elegant editorial cover image background for a MasterGrowbot GrowTech equipment quickstart PDF and digital product card. A close-up of a generic green houseplant leaf under a circular optical magnifying lens, alongside a simple blank observation notebook, on a dark charcoal desk. Refined realistic studio photography, restrained emerald green accents, soft daylight, sharp leaf detail, plenty of calm empty dark space in upper half for title added separately. Portrait composition. No cannabis-specific cultivation scene. No text, logos, people, screens, invented hardware features, automation or yield claims.”
