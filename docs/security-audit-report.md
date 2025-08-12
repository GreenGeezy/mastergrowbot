# Security Audit Report: Emails and Payment Identifiers

Date: 2025-08-12
Scope: Repo + Supabase DB. Searched SQL migrations and schema for column names matching “email”, “transaction”, or “payment”. Focus on where data might be publicly readable (anon role).

Method
- Regex scan across supabase migrations and DB functions for: email|transaction|payment
- Reviewed current schema and RLS policies (from project Supabase metadata)

Findings
1) Tables/Views with email or payment-related identifiers
- pending_subscriptions
  - Columns: email, subscription_type, square_order_id, expires_at, consumed, created_at, id
  - RLS/SELECT:
    - Allow public read (SELECT true) → PUBLICLY READABLE by anon
    - Users can view by email (email = auth.jwt()->>'email')
    - Service role can manage all
  - Risk: Public read exposes email and square_order_id (payment reference) to anyone. Potential enumeration of emails and orders.

- support_messages
  - Columns: name, email, title, message, status, created_at, id
  - RLS/SELECT: "Only authenticated users can view their own messages" (Using: email = CURRENT_USER)
  - Note: CURRENT_USER refers to DB role (e.g., anon/authenticated), not the user email. Likely results in near-zero visibility vs intended. Not publicly readable.

- user_feedback
  - Columns: beta_testing_email (optional), user_id, ratings/fields, created_at, id
  - RLS/SELECT: users can view their own (auth.uid() = user_id). Insert is open to anyone.
  - Not publicly readable; email is not exposed to anon.

- subscriptions
  - Columns: user_id, subscription_type, status, square_order_id, starts_at, expires_at, id
  - RLS/SELECT: users can view own; service role manages. Not publicly readable.

- shared_analyses (VIEW-like table)
  - Columns: id, analysis_id, share_token, expires_at, created_at
  - RLS/SELECT: Anyone can view non-expired (expires_at > now()) → PUBLICLY READABLE by anon
  - Risk: Exposes share_token and analysis linkage publicly.

- plant_analyses
  - Columns: id, user_id, image_url, image_urls, diagnosis, primary_issue, confidence_level, recommended_actions, detailed_analysis, strain_name, growth_stage, created_at, updated_at, etc.
  - RLS/SELECT:
    - Public read when a corresponding shared_analyses row exists (EXISTS join) → PUBLICLY READABLE (row-restricted) by anon
  - Risk: For shared items only, but exposed data includes user_id and potentially sensitive plant images/diagnoses. No email fields here.

- app_config
  - RLS/SELECT: Authenticated users can read; not public. No email/payment columns.

- assistant_settings
  - RLS/SELECT: Anyone can read rows with user_id IS NULL → PUBLICLY READABLE subset
  - Columns include assistant_id and system_instructions (no email/payment). Low sensitivity relative to scope.

- user_access_view
  - View with subscription status data, no email column. No explicit RLS listed (views rely on base tables’ policies). Not flagged for email/payment exposure.

2) SQL migration references found
- 20250420_mark_user_completed_quiz.sql
  - Contains historical references to user email and inserted an email column into user_profiles in the past. Current schema no longer exposes user_profiles.email.
- No columns explicitly named “transaction” or “payment” found; however, square_order_id serves as a payment/transaction identifier in pending_subscriptions and subscriptions.

Publicly Readable (anon) Summary
- pending_subscriptions: email, subscription_type, square_order_id, expires_at, consumed, created_at, id
- shared_analyses: id, analysis_id, share_token, expires_at, created_at
- plant_analyses: Many columns listed above, but only for rows with active shares
- assistant_settings: rows where user_id IS NULL (no email/payment)

Notes and Potential Risks
- The pending_subscriptions “Allow public read” policy is the primary exposure of emails and payment reference (square_order_id) to anon.
- shared_analyses and plant_analyses intentionally expose shared data; ensure this matches product intent.
- support_messages’ SELECT condition (email = CURRENT_USER) likely doesn’t map to end-user emails; confirm intended access.

Next Steps (No changes in this PR)
- Decide if pending_subscriptions should remain publicly readable; if not, restrict anon SELECT and rely on email-scoped or service role access.
- If desired, consider masking square_order_id in any public endpoints or removing public read entirely.
- Review support_messages SELECT policy logic for correctness relative to Supabase Auth.

Appendix: Search Touchpoints
- Edge functions interacting with emails/payments:
- send-verification-email: manages pending_subscriptions by email
- square-webhook: calls handle_square_payment(email, order_id) → writes to pending_subscriptions (publicly readable today)
- mark-quiz-completed: references email/user_id flows; no public data exposure

## Security Notes
- shared_analyses is intentionally public but time-bounded: rows are viewable only while expires_at > now(), and access requires possession of a high-entropy share_token, making it effectively an unguessable link.
- plant_analyses are only readable for rows that have an active share in shared_analyses; otherwise, standard owner-only RLS applies.
- Neither shared_analyses nor the shared subset of plant_analyses contain user emails or payment identifiers (e.g., square_order_id); exposed fields are limited to share metadata and analysis content necessary for viewing.

