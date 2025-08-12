PR Title: chore/security-audit-report

Summary
- Adds documentation: Security Audit Report focusing on exposure of emails and payment identifiers.
- No code/policy changes; this PR is documentation only.

Scope
- Searched SQL migrations and current Supabase schema for columns matching: email, transaction, payment.
- Identified tables/views containing those columns and documented RLS and SELECT policies.
- Highlighted any publicly readable (anon) resources and exactly which columns are exposed.

Key Findings
- Publicly readable (anon) resources:
  - pending_subscriptions: exposes email, subscription_type, square_order_id, expires_at, consumed, created_at, id
  - shared_analyses: exposes id, analysis_id, share_token, expires_at, created_at
  - plant_analyses: row-restricted public read (when shared); exposes multiple analysis columns including user_id, image_url, diagnosis
  - assistant_settings: rows with user_id IS NULL are publicly readable (no email/payment columns)
- Not publicly readable but relevant:
  - subscriptions: contains square_order_id (payment reference); owner-only SELECT
  - user_feedback: beta_testing_email; owner-only SELECT; insert open to anyone
  - support_messages: includes email; SELECT policy uses email = CURRENT_USER (may be ineffective for end-user scoping); not public

Risks to Consider (no action in this PR)
- pending_subscriptions public read likely exposes user emails and order references to anon.
- shared_analyses and corresponding plant_analyses exposure appears intentional; confirm business intent.
- Validate support_messages policy behavior against Supabase Auth expectations.

Files Added
- docs/security-audit-report.md — Full report

No other changes.
