# PR Checklist – Quiz Completion Fix

This PR introduces a transactional migration to replace `public.mark_user_completed_quiz` with an auth.uid()-based, idempotent version and updates the `mark-quiz-completed` edge function to call the RPC and handle errors gracefully.

Verification steps (staging/dev only – do NOT run on prod yet):

1) Database migration
- Apply the migration.
- Re-run migration (idempotency) – should succeed without changes.

2) Authenticated flow (happy path)
- Sign in as a test user.
- From the app, trigger the Thank You flow that invokes `mark-quiz-completed`.
- Expect HTTP 200 with `{ success: true, has_completed_quiz: true }`.
- In `user_profiles`, verify a single row for the user with `has_completed_quiz = true` and `updated_at` changed.

3) Re-run (no-op behavior)
- Invoke the edge function again as the same user.
- Expect HTTP 200; no duplicate rows; `has_completed_quiz` remains true.

4) RLS unaffected
- Try calling the RPC without Authorization header (e.g., curl without Bearer token).
- Expect 400 from edge or error from RPC (auth.uid() is null).
- Confirm no other user’s profile can be modified.

5) Error handling
- Temporarily remove Authorization when invoking the edge function.
- Expect `{ error: "Failed to mark quiz as completed" }` and HTTP 400.

6) Regression checks
- ThankYou page still navigates correctly after success.
- No references to non-existent columns remain (e.g., `user_profiles.email`, `pending_subscriptions.has_completed_quiz`).

Notes
- No schema changes were made.
- No triggers were added.
- Shared Supabase backend for `main` and `ios-main` is safe; apply migration before deploying the updated edge function.
