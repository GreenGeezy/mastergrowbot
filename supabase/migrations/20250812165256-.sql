-- PR: fix/rls-support-messages (guest insert allowed)
-- Goal: Prevent unintended reads of emails; allow anonymous (guest) INSERT, no anon SELECT
-- Idempotent migration

BEGIN;

-- 1) Ensure RLS is enabled on support_messages
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- 2) Remove/disable legacy or conflicting policies
DROP POLICY IF EXISTS "Anyone can create support messages" ON public.support_messages;
DROP POLICY IF EXISTS "Only authenticated users can view their own messages" ON public.support_messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.support_messages;
DROP POLICY IF EXISTS "Service role manage all support messages" ON public.support_messages;
DROP POLICY IF EXISTS "Service role manage all" ON public.support_messages;
DROP POLICY IF EXISTS "User can SELECT own by email" ON public.support_messages;
DROP POLICY IF EXISTS "Authenticated users can insert support messages" ON public.support_messages;
DROP POLICY IF EXISTS "Insert allowed for anyone" ON public.support_messages;
DROP POLICY IF EXISTS "Authenticated users can select own by email" ON public.support_messages;

-- 3a) Service role manage all
CREATE POLICY "Service role manage all"
ON public.support_messages
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3b) Allow INSERT for anyone (including anon)
CREATE POLICY "Insert allowed for anyone"
ON public.support_messages
FOR INSERT
WITH CHECK (true);

-- 3c) Authenticated users can SELECT their own messages by email
CREATE POLICY "Authenticated users can select own by email"
ON public.support_messages
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'email') = email);

COMMIT;