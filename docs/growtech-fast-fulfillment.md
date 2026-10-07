# Fast single-unit fulfillment — 6 October 2026

This supersedes the earlier 4–6-week lens/meter and 8–10-week tent launch windows. Owner now commits to ordering within **five business days of confirmed buyer payment**, once funds reach the bank. A possible future one-day automation is not installed and is not assumed. Buy one unit per paid order; no advance inventory or bulk purchasing.

## Published configuration

| Package | USD price | Destinations | Estimate from payment |
| --- | ---: | --- | --- |
| APEXEL 10–20X lens + LED light + Quickstart | 119 | US, Canada | 2–4 weeks |
| White six-function soil meter + Quickstart | 99 | US, Canada | 2–4 weeks |
| All-black unbranded 60×60×140 cm tent + Quickstart | 289 | US, Canada | 3–4 weeks |

Keep short, visible shipping estimates beside prices and at checkout. These are estimates, not guaranteed arrival dates. For remote destinations or hard deadlines, obtain a destination-specific quote before accepting an order. Do not substitute the old slower free-shipping tent route. If a destination cannot meet the window and margin, do not order a cheaper slower substitute; promptly resolve or refund the buyer's order.

## Qualified route and cost evidence

Lens: AliExpress US `3256808490427483` / global `1005008676742235`, macro with light. Observed US free-shipping arrival Oct 15–19; Canada Oct 17–20. Meter: US `3256811741664874` / global `1005011927979626`, white six-function two-probe casing; US Oct 15–19, Canada Oct 17–21. These sample quotes are approximately 9–15 calendar days from the supplier check. Adding up to seven calendar days for five business days of preparation and a small handling buffer fits a 2–4-week estimate under normal operation. Recheck at the buyer's exact destination; do not assume welcome prices apply to later orders.

Replacement tent: https://www.aliexpress.us/item/3256807937514531.html / https://www.aliexpress.com/item/1005008123829283.html, Gient Convenience Store. Exact selected option `60X60X140CM`; black exterior, black trim, rounded zip doorway, silver reflective lining, low rectangular vents. No visible branding in inspected product photographs. This differs from the old black/green 24×24×48-inch tent; gallery, dimensions, SKU and plan description must all use the replacement.

- US sample Alabama/Abbeville: item $52.72, reference price $59.91; **Express shipping $109.42**, estimated Oct 17–23. Shipping-method panel confirms that exact option. Twelve units available at inspection.
- Canada sample Alberta/Abee, currency explicitly switched to USD: item $46.89, reference price $53.28; **Standard shipping $118.15**, estimated Oct 17–23. Shipping-method panel confirms the same range. Twelve units available; one unit added to cart with existing owner permission, not purchased.
- Use the higher reference item price for the budget, not the temporary sale or a coupon. US baseline $169.33; Canadian baseline $171.43 before taxes/FX. Current 11–17-day estimates plus up to seven calendar days of preparation and up to four days of buffer support 3–4 weeks. Supplier statistics show some deliveries exceed 17 days; do not claim a guaranteed deadline or two-week arrival.

## $40 minimum contribution gate

Contribution = item revenue minus supplier item, shipping, business-paid tax/import costs, currency costs, actual platform/payment/affiliate fees and $5 support/returns reserve. Buyer-collected tax is not item revenue. This is contribution, not guaranteed accounting net profit or a guarantee against every refund.

Conservative planning allowance: **10% of selling price + $1 for payment/platform/payout fees**, **15% supplier tax allowance**, **5% supplier FX/volatility allowance**, plus **$5 reserve**. These are budget assumptions, not the merchant's verified fee schedule; reconcile the actual receipt. Whop lists method-dependent charges at https://whop.com/network/pricing/ . Avoid paid affiliates, blanket coupons or an expensive payment method consuming this headroom.

| Package | Price | Maximum all-in supplier cost after tax/FX, with fee allowance and $5 reserve | Illustrative contribution |
| --- | ---: | ---: | ---: |
| Lens | 119 | 61.10 | 51.71 using indicative $40.90 supplier baseline |
| Meter | 99 | 43.10 | 60.52 using indicative $18.70 baseline |
| Tent | 289 | 214.10 | 47.10 using $171.43 baseline × 1.15 × 1.05 |

Lens/meter baselines are indicative non-welcome search prices, not finalized repeat-order invoices. Tent baseline uses the higher reference item price and shipping. If actual supplier cost or merchant fees exceed the caps, pause the offer and reprice before accepting another buyer; do not fulfill below $40 contribution. Initial one-order capacity remains until first-order costs and delivery are reconciled. Recheck stock, destination price and dates each day that ordering is open and immediately before supplier purchase.

## Assets

Built-in imagegen generated three replacement tent illustrations, saved in `public/images/grow-tech/tent-express-v2/` as PNG originals and WebP delivery assets. Prompts: (1) faithful all-black 60×60×140 cm empty product view based on the inspected supplier reference; (2) adult white male grower age 30–35 opening the same tent beside cannabis plants; (3) adult white male grower age 27–32 recording observations beside the same tent. Preserve black trim, rounded door, scale, vents and no logos; images are labeled AI illustrations, not customer or performance evidence. Plants, models and equipment props are excluded from the package.

## Owner sequence

1. Verify unique paid Whop transaction and funds availability; use the order register.
2. Within five business days, recheck the exact variant and buyer destination. Confirm latest arrival date is within 28 days of buyer payment and contribution is at least $40.
3. Owner orders one unit using the qualified shipping method. Agent has no purchase authorization.
4. Send tracking after dispatch; resolve delays and record actual delivered date and contribution.
5. Only expand one-order capacity after actual costs and delivery support it.

## Completed alignment — October 7, 2026

- Production deployment of commit `3cd4d85` confirmed READY on Vercel. Live GrowTech shows $119 / $99 / $289 and the new delivery estimates.
- Whop merchant product descriptions and standalone checkout descriptions now agree: lens/meter US and Canada 2–4 weeks from payment; tent US and Canada 3–4 weeks. Tent checkout description also uses the replacement dimensions and $289 price.
- Whop tent product gallery saved with exactly three matching all-black illustrations. The obsolete green-trim images were unlinked after verifying each removal button's associated image in the DOM; original assets remain in the repo.
- Whop storefront published successfully after its typecheck/build passed. Live price, shipping, Canadian tent FAQ, both grower-gallery selections and external checkout routes verified. Mobile 390px check found no horizontal overflow.
- Canadian selection on the live main-site tent checkout enabled the Whop shipping/payment form and displayed $289. No card details entered and no payment submitted. Whop iframe emits sessionKey, accelerometer and Apple Pay manifest diagnostics in the automated browser; actual card/wallet payment success is not proven by this form-readiness check. Hosted fallback remains available.
- Review screenshots saved under ignored `output/playwright/`: `growtech-faster-tent-live.png` and `whop-faster-tent-live.png`.
- No supplier purchases made. The first genuine paid order, exact destination quote, actual fees, owner dispatch and delivery reconciliation remain required before expanding capacity.
