# Web Pro setup checklist

Web Pro sells through Whop. Stripe and RevenueCat Web Billing are not used: Stripe's prohibited list names information on cannabis cultivation.

**The on switch is a Vercel variable.** With no Whop plan ID in Vercel, `/pro` says "opening soon" with noindex, and no page links to it. Set the plan IDs last, because any push to `main` deploys them.

## How it works

1. A visitor signs in on `/pro` with Google, Apple (when enabled) or email.
2. Whop Elements takes the payment. The payment records `supabase_user_id`.
3. The `web-pro` function asks Whop whether that payment is paid, is for Web Pro, and names that same sign-in. Only then does it store the membership ID in the account's `app_metadata`, which visitors cannot edit.
4. Every status check and photo report asks Whop again, so cancellations, refunds and failed renewals end access without a webhook.
5. If the browser closes during payment, the next visit finds the paid checkout by `supabase_user_id` and unlocks it.

No table, row rule, trigger, or existing function is changed. Reports use `diagnosis_reports`, numbers use `journal_logs` and checklists use `tasks`, under the rules already there.

## 1. Whop

1. Ask Whop support, in writing: "Is browser software for legal home growers, with plant health reports and grow checklists, allowed on our account? It sells no cannabis, seeds or paraphernalia." Whop bans cannabis products and paraphernalia and its policy does not mention cultivation software. Keep the reply.
2. Create the product **MasterGrowbot Web Pro**, hidden from the Whop marketplace.
3. Add two recurring prices, no trial, no shipping address, unlimited stock: **$59.00 USD every year** and **$9.99 USD every month**.
4. Copy the product ID (`prod_...`) and both plan IDs (`plan_...`).
5. The key stored in Supabase as `WHOP_API_KEY` needs `payment:basic:read` and `member:basic:read`. Adding `member:manage` is optional: it gives buyers a direct billing link, but it can also change memberships. Without it, buyers get Whop's orders page.
6. Apple Pay: the domain file is already served by this site. Check Whop shows www.mastergrowbot.com as verified.

## 2. Supabase (project vofwdhlwsahwxecewyek)

1. Authentication, URL Configuration: **add** these three. Do not touch the Site URL or the four existing entries.
   - `https://www.mastergrowbot.com/auth/callback`
   - `https://www.mastergrowbot.com/pro`
   - `http://localhost:8080/auth/callback`
2. Edge Functions, Secrets: add `WHOP_WEB_PRO_PRODUCT_ID`. Confirm `WHOP_API_KEY` and `WHOP_COMPANY_ID` exist (names only).
3. Deploy `supabase/functions/web-pro` (`index.ts` and `access.ts`) with **Verify JWT on**.
4. Leave on: anonymous sign-ins, email sign-ups, Google. Leave off: Confirm email, manual linking.

## 3. Google sign-in

The live sign-in page loads with no redirect error (checked 2026-11-23). In Google Cloud, confirm the consent screen is **In production**. In Testing, only listed test users can sign in.

## 4. Apple sign-in (can follow later)

Creating a Services ID needs an App ID with Sign in with Apple. Turning that on for the live `com.mastergrowbot.ai` invalidates its provisioning profiles for the next build, so use a separate App ID.

1. Identifiers, App IDs: create `com.mastergrowbot.ai.webauth` with Sign in with Apple.
2. Identifiers, Services IDs: create `com.mastergrowbot.ai.web`, enable Sign in with Apple, primary App ID from step 1, domain `vofwdhlwsahwxecewyek.supabase.co`, return URL `https://vofwdhlwsahwxecewyek.supabase.co/auth/v1/callback`.
3. Keys: create a Sign in with Apple key for that App ID. Download the `.p8` once and store it outside this repository.
4. Run the script below, then paste the result into Supabase, Authentication, Providers, Apple, with Client IDs `com.mastergrowbot.ai.web`. Keep "Allow users without an email" off.

   ```powershell
   node scripts/generate-apple-client-secret.mjs TEAM_ID KEY_ID com.mastergrowbot.ai.web C:\path\AuthKey.p8
   ```

5. Set a calendar reminder for the printed expiry. The secret lasts 180 days.
6. Set `VITE_ENABLE_APPLE_AUTH=true` in Vercel and redeploy.

## 5. Test, then go live

1. With the branch merged and no plan IDs in Vercel, confirm `/pro` says "opening soon".
2. Locally, put the two plan IDs in `.env.local`, run `npm run dev`, open `http://localhost:8080/pro`, sign in with email and reach checkout.
3. Make one real $9.99 purchase, confirm it unlocks, run one photo report, cancel from Account, then refund yourself in Whop and confirm access ends.
4. In Vercel, Production, set the variables below and redeploy.

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_WHOP_WEB_PRO_ANNUAL_PLAN_ID` | yearly `plan_...` |
| `NEXT_PUBLIC_WHOP_WEB_PRO_MONTHLY_PLAN_ID` | monthly `plan_...` |
| `VITE_ENABLE_APPLE_AUTH` | `true` only after section 4 |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | optional: the code already points at the live project and ignores any other |

5. After launch, add `/pro` to `public/sitemap.xml`.

To switch Web Pro off, remove both plan IDs and redeploy. Existing subscribers then cannot reach the workspace, so email them first.

## Known limits

- The AI service has an existing cap of $1.90 a week per account, and each photo report reserves at least $0.025. "Unlimited" would be untrue, so Web Pro promises and enforces 40 reports a week (about $52 a year at most).
- `gemini-v3` still accepts photo requests from any signed-in account, including the app's anonymous ones. Web Pro's check does not close that, and tightening it would break the mobile app. The existing cost cap limits the exposure.
- Email sign-up does not verify the address, so someone could register an address they do not own. Turn on Confirm email only after custom SMTP is set and tested with the app.
- Password help is by email until custom SMTP is on.
- A yearly Web Pro sale nets about $57. A $99 app sale nets about $84 at a 15% store fee or $69 at 30%. Phone visitors are therefore shown the app first everywhere.
