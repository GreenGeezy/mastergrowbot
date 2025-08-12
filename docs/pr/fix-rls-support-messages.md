# PR: fix/rls-support-messages — Safety Checklist

This PR tightens RLS on public.support_messages while allowing guest (anon) INSERT and disallowing anon SELECT. No app code changes.

Security Notes
- support_messages: RLS enabled; policies:
  - Service role manage all (USING/CHECK auth.role() = 'service_role')
  - Insert allowed for anyone (WITH CHECK true)
  - Authenticated users can SELECT their own rows by email (USING (auth.jwt()->>'email') = email)
- pending_subscriptions: Client should use RPCs; direct SELECT by anon must return 0 rows.

Verification Checklist (copy/paste)

A) Pending Subscriptions
1) As anon → 0 rows
- REST (recommended)
  curl -s \
    -H "apikey: $SUPABASE_ANON_KEY" \
    "$SUPABASE_URL/rest/v1/pending_subscriptions?select=*&limit=1" | jq
  # Expect: [] (no rows)

- SQL (RLS simulation — requires a role without BYPASSRLS)
  select set_config('request.jwt.claims', '{"role":"anon"}', true);
  select * from public.pending_subscriptions limit 1;  -- Expect 0 rows

2) As authenticated test user → only own rows by email
- REST
  # Obtain access_token for test user, then:
  curl -s \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    --get \
    --data-urlencode "select=id,subscription_type" \
    --data-urlencode "email=eq.$TEST_EMAIL" \
    "$SUPABASE_URL/rest/v1/pending_subscriptions" | jq
  # Expect: only rows for $TEST_EMAIL

- SQL (RLS simulation — requires non-bypass role)
  select set_config('request.jwt.claims', '{"role":"authenticated","email":"' || current_setting('request.jwt.claims', true) || '"}', true);
  select id, subscription_type from public.pending_subscriptions where email=(auth.jwt()->>'email');

3) RPC: sanitized columns only (no square_order_id, no email)
- REST
  curl -s \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{}' \
    "$SUPABASE_URL/rest/v1/rpc/get_my_pending_subscriptions" | jq
  # Expect columns: id, subscription_type, expires_at, consumed, created_at (no email, no square_order_id)

- SQL
  select * from public.get_my_pending_subscriptions();

B) Support Messages
4) support_messages visibility
- Anon SELECT → 0 rows
  curl -s -H "apikey: $SUPABASE_ANON_KEY" "$SUPABASE_URL/rest/v1/support_messages?select=*&limit=1" | jq
  # Expect: []

- Signed-in user sees only own rows (by email rule)
  curl -s \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    "$SUPABASE_URL/rest/v1/support_messages?select=*&email=eq.$TEST_EMAIL" | jq
  # Expect: only rows with email == $TEST_EMAIL

C) App Smoke Test (UI)
- Profile page loads
- Chat loads and sends/receives messages
- Plant scan page loads and can upload/scan
- Grow guide loads and search works

Notes
- For REST tests, set environment variables:
  export SUPABASE_URL=https://inbfxduleyhygxatxmre.supabase.co
  export SUPABASE_ANON_KEY="<anon key>"
  export ACCESS_TOKEN="<user access token>"
  export TEST_EMAIL="<user email>"
- SQL editor often runs with elevated role that bypasses RLS; use REST tests for definitive RLS verification.
