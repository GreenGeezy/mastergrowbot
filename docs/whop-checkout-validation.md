# Whop Checkout Validation

Use this checklist to validate the MasterGrowbot AI Whop checkout flows without creating fake paid purchases or firing fake GA4 purchase events.

## Expected Success URLs

- GrowTech: `https://www.mastergrowbot.com/grow-tech/thank-you?status=success`
- AI Strategy: `https://www.mastergrowbot.com/ai-strategy/intake?status=success`

## GrowTech No-Money Validation

1. Create a private one-use 100% off Whop promo code called INTERNALTEST100.
2. Apply it to one GrowTech product.
3. Set max redemptions to 1.
4. Open https://www.mastergrowbot.com/grow-tech.
5. Click that product’s Buy Now button.
6. Complete checkout with INTERNALTEST100.
7. Confirm redirect to /grow-tech/thank-you?status=success.
8. Confirm Whop Dashboard > Payments or Users shows the test order/user.
9. Confirm Whop Support chats automation sends the order confirmation.
10. Disable or delete INTERNALTEST100 immediately after testing.

## AI Strategy No-Money Validation

1. Create a private one-use 100% off promo code for AI Strategy if available, or use a temporary internal test product.
2. Complete checkout.
3. Confirm redirect to /ai-strategy/intake?status=success.
4. Confirm Whop records the user/order and automation fires.
5. Disable or delete the test code.

## Important Note

A 100% off checkout validates checkout routing, redirect, Whop order/user creation, and automation.
It does not prove live credit-card authorization.
To prove live credit-card authorization, use Whop sandbox with a test card or run one tiny real transaction and refund it.

## Apple Pay Note

Because embedded checkout requires Apple Pay domain verification, complete Whop self-hosted payment domain verification after this Vercel rewrite deploys.
If Apple Pay is not verified, remove Apple Pay trust claims from customer-facing pages or keep Apple Pay only after verification.

The Vercel rewrite should expose:

`/.well-known/apple-developer-merchantid-domain-association`

from:

`https://whop.com/.well-known/apple-platform-integrator/apple-developer-merchantid-domain-association`

## Manual QA Checklist

- /grow-tech loads.
- /ai-strategy loads.
- All GrowTech checkout buttons open checkout.
- AI Strategy checkout opens checkout.
- AIGROWTECH applies 20% off in Whop checkout.
- INTERNALTEST100 can complete a $0 GrowTech checkout if created.
- GrowTech success page handles status=success and status=error.
- AI Strategy intake handles status=success and status=error.
- Whop dashboard records the test checkout.
- Whop support automation sends the confirmation.
- Apple Pay domain warning is gone after verification, or Apple Pay claims are removed.
- Build passes.

## Local Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
npx playwright test tests/whop-checkout.spec.ts --list
```

## Headed Checkout Smoke Test

This test opens checkout surfaces but does not complete a paid transaction:

```bash
npm run test:checkout
```

Use the private Whop promo validation flow above for a complete no-money order test.
