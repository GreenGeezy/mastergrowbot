# Playbooks conversion update

Published October 2, 2026. This is a usability and offer-clarity improvement requested by the owner, not an experiment with a proven sales lift. No prior Playbooks revenue or conversion baseline was available.

## Changes and reasons

- The hero describes a concrete use: turn plant photos into an organized record and check what AI supports. It shows the price, format, delivery and included Quickstart alongside the purchase button.
- The three options appear together directly after the hero: $19 Quickstart, complete premium kit and free setup sheets. Each has a purpose, actual contents, price and next step. Premium appears first on mobile; its launch price is $23 more than the Quickstart. Buying the kit already includes that guide.
- Two actual pages from the existing public sample appear inline. Clicking either opens the full four-page preview. Only already-public sample material is exposed; full paid files remain inside Whop.
- Contents, first-session steps and the three-step Whop delivery explanation address what buyers get and how to use it. Collapsible FAQs cover fit, required equipment, file access, printing and product scope.
- The mobile purchase shortcut appears only after the hero purchase area passes above the viewport. It hides when the final offer is visible and reserves page-bottom space. It includes a comparison link for visitors who need another option.
- About has no founder portrait. Its hero, principles and origin section focus on MasterGrowbot AI's mission. A brief factual founder reference remains as company context.
- Existing prices, payment plans, coupons, launch expiry and paid file access were preserved. No new promises, testimonials, supplier identities or em dashes were added to the page copy.

## Measurement

Preserved `playbook_view`, `playbook_checkout_open` and `playbook_sample_open`. Added `quickstart_checkout_open`, `quickstart_sample_open`, `playbook_compare_open` and `guide_download` for free sheets. Paid selection also emits `select_item` with product, price, currency, page and CTA location. Mobile shortcut clicks have their own CTA location.

These events are intent signals, not sales. Existing analytics delivers them when a data layer or gtag is present and permitted. Confirm purchases and net revenue in Whop. Hosted checkout, purchase attribution and settlement are not newly implemented by this change.

For the next 14 days, compare unique page visitors, sample engagement, checkout starts and confirmed Whop purchases by product. Record contribution after fees, refunds, support and acquisition cost. Watch whether the premium kit increases contribution per visitor rather than only its share of clicks. The fixed launch end changes pricing, so compare matching price periods and traffic sources. Allow enough purchases before declaring a winner.

## Verification

Production build and changed-page lint pass. Focused browser checks cover desktop and 390-pixel mobile rendering, canonical, one H1, no em dashes, loaded preview images, expandable FAQs, mobile shortcut appearance/hiding, both purchase routes and click-event payloads. Premium checkout still uses the verified plan and launch code. About displays the mission and has no founder photo.

The existing release suite had an outdated four-product schema assertion. It was updated for the already-existing six-product GrowTech catalog, explicitly verifying that the digital guide has no shipping or physical return policy and the five hardware/bundle offers retain their return policy.

No real charge or payout was performed. Revenue lift remains unproven until measured.
