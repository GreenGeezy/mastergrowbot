-- Migration: Replace mark_user_completed_quiz with dual signatures (auth.uid()-based)
-- Purpose: Safe across main and ios-main sharing the same backend; no schema changes
-- Strategy: 
--  1) New canonical function: mark_user_completed_quiz() uses auth.uid() only
--  2) Backward-compatible wrapper: mark_user_completed_quiz(user_email text) calls the zero-arg version
--  3) Fully idempotent via CREATE OR REPLACE and wrapped in a transaction

BEGIN;

-- 1) Canonical function: uses the caller's auth.uid()
CREATE OR REPLACE FUNCTION public.mark_user_completed_quiz()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Upsert a minimal profile row and mark quiz as completed; idempotent
  INSERT INTO public.user_profiles (id, has_completed_quiz)
  VALUES (v_user_id, true)
  ON CONFLICT (id) DO UPDATE
    SET has_completed_quiz = true;

  RETURN true;
END;
$$;

-- 2) Backward-compatible wrapper to preserve existing callers that pass email
--    NOTE: Ignores the email and simply routes to the canonical function above.
CREATE OR REPLACE FUNCTION public.mark_user_completed_quiz(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM public.mark_user_completed_quiz();
  RETURN true;
END;
$$;

COMMIT;