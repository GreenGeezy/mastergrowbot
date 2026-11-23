# Web to mobile sync plan (Phase 2, not built)

Nothing here is coded. The mobile repository is unchanged: its `main` branch is Android, its `ios` branch is iOS, and the iOS app has Premium video, which Android does not.

## Where things stand

- The apps start instantly with an anonymous Supabase session. RevenueCat identity is a device-local `mg_rc_stable_id`, moved to `session.user.id` only for Premium purchases.
- Web Pro accounts are normal Supabase users. Their subscription lives in Whop, linked through `app_metadata.web_pro`.

## The important difference from the original plan

Because Web Pro is sold through Whop, `Purchases.logIn({ appUserID: session.user.id })` alone will **not** unlock the app: RevenueCat has no record of the sale. Choose one:

1. **App asks `web-pro` (recommended).** After an optional sign-in, the app calls `web-pro` with `{ action: 'status' }` and treats `active` as Pro alongside RevenueCat. No write access to RevenueCat, and cancellations apply by themselves. The function's allowed origins need the app's origin added.
2. **Server grants `pro` in RevenueCat** to the Supabase ID, with an end date matching Whop's period. Simpler in the app, but needs a write-capable RevenueCat key and a job that renews and revokes grants.

## App change

1. Settings: an optional "Sign in to link Web Pro" button. Anonymous instant start stays the default (Apple 5.1.1(v)).
2. Offer Sign in with Apple beside Google and email (Apple 4.8). Append `com.mastergrowbot.ai` to the Supabase Apple Client IDs.
3. Signing in replaces the anonymous session. Before that, either offer to copy the grower's plants, journal and tasks, or keep the anonymous session for data and use a second Supabase client only to check Web Pro. The second is safer: no grower loses a journal.
4. Never call `signOut` on the anonymous session without a copy: it cannot be recovered.
5. If the device has a store subscription, keep it. Restore Purchases must work as it does now.
6. Android first needs the same account-linking code as iOS. Ship each from its own branch.

## Store rules

- Apple 3.1.3(b) lets an app honour a subscription bought elsewhere when the same thing is also sold in the app. Do not link to or mention the web price in the app.
- Once the app collects an email, update App Privacy (email, linked to the user) and Play Data safety in the same release.

## Tests before release

Anonymous user with no link, link with active, cancelled and expired Web Pro, store subscriber who also links, wrong account, offline launch, sign out, delete account, and iOS Premium video still requiring `machine_vision`.
