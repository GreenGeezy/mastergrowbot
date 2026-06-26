# MasterGrowbot AI CTA Routing

## Primary Revenue Path

- GrowTech Shop is the primary website sales CTA.
- Internal GrowTech links use `GROW_TECH_URL` from `src/components/landing/ctaLinks.ts`.
- `GROW_TECH_URL` points to `/grow-tech`.
- Internal `/grow-tech` links open in the same tab.
- The reusable coded CTA component is `src/components/landing/GrowTechCTA.tsx`.

## Header Navigation Order

1. GrowTech Shop
2. Grow Guides
3. VPD Calculator
4. Contact
5. IPM Playbook
6. Available on Amazon

Header behavior:

- GrowTech Shop links to `/grow-tech` in the same tab.
- IPM Playbook links to `/#ipm-playbook`.
- Available on Amazon uses `AMAZON_BOOK_URL` and opens in a new tab with `rel="noopener noreferrer"`.

## Whop Checkout Behavior

- Product checkout links on `/grow-tech` use the existing `NEXT_PUBLIC_WHOP_*` environment variables.
- Whop checkout links open in the same tab.
- Do not hardcode Whop checkout URLs in components.
- Do not rename these environment variables:
  - `NEXT_PUBLIC_WHOP_SCOUT_CAMERA_CHECKOUT_URL`
  - `NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_CHECKOUT_URL`
  - `NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_CHECKOUT_URL`
  - `NEXT_PUBLIC_WHOP_GROW_TECH_KIT_CHECKOUT_URL`

## Amazon IPM Playbook Behavior

- Amazon links use `AMAZON_BOOK_URL` from `src/components/landing/ctaLinks.ts`.
- Amazon links open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.
- Amazon remains the secondary revenue path for the IPM Playbook.
- The homepage IPM promo section is `src/components/landing/IPMPlaybookSection.tsx`.

## GrowTechCTA Usage

Current primary usage:

- Header nav: `nav:growtech-shop`
- Homepage hero: `hero:growtech`
- Vision AI section: `vision-ai-section:growtech`
- Strain Intelligence section: `strain-intelligence-section:growtech`
- Master Grower section: `master-grower-section:growtech`
- Grow Guides hub: `grow-guides:growtech`
- Footer: `footer:growtech`

## IPM Playbook Promo Assets

Preferred image asset paths for the homepage IPM Playbook promo section:

- `/images/A%2BKDPImage1.png`
- `/images/A%2BKDPImage4.png`
- `/images/A%2BKDPImage5.png`

Source filenames in `public/images`:

- `/images/A+KDPImage1.png`
- `/images/A+KDPImage4.png`
- `/images/A+KDPImage5.png`

The section uses encoded browser paths first because the source filenames contain `+`. It also includes raw-path fallbacks in `IPMPlaybookSection.tsx`.
