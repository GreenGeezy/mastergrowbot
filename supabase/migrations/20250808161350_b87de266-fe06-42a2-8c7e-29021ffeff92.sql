-- ---
-- Streak update functions and triggers
-- This migration creates a reusable function to update a user's streak
-- and attaches AFTER INSERT triggers to plant_analyses and chat_history.
-- It is idempotent and safe to re-run.
-- ---

-- 1) Core function to update the streak for a given user
CREATE OR REPLACE FUNCTION public.update_streak_for_user(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_current_streak integer;
  v_last_action date;
  v_grace_days integer;
  v_days_diff integer;
BEGIN
  -- Try to get an existing row
  SELECT current_streak, last_action, grace_days
  INTO v_current_streak, v_last_action, v_grace_days
  FROM public.user_streaks
  WHERE user_id = user_uuid;

  -- If no row exists, create one with current_streak = 1
  IF NOT FOUND THEN
    INSERT INTO public.user_streaks (user_id, current_streak, last_action, grace_days)
    VALUES (user_uuid, 1, CURRENT_DATE, 0)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN;
  END IF;

  -- Compute day difference between today and last_action
  v_days_diff := CURRENT_DATE - v_last_action;

  -- Advance/reset logic per spec:
  --  • If today = last_action + 1 day → current_streak += 1
  --  • If today > last_action + 2 days → current_streak = 1
  IF v_days_diff = 1 THEN
    v_current_streak := v_current_streak + 1;
  ELSIF v_days_diff > 2 THEN
    v_current_streak := 1;
  END IF;

  -- Always set last_action = today (leave grace_days unchanged)
  UPDATE public.user_streaks
  SET current_streak = v_current_streak,
      last_action = CURRENT_DATE
  WHERE user_id = user_uuid;
END;
$$;

-- 2) Trigger function to call the updater from insert events
CREATE OR REPLACE FUNCTION public.update_streak_on_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- For chat_history, skip AI messages
  IF TG_TABLE_NAME = 'chat_history' THEN
    IF NEW.is_ai IS TRUE THEN
      RETURN NEW;
    END IF;
  END IF;

  -- Update streak for the record's user
  PERFORM public.update_streak_for_user(NEW.user_id);
  RETURN NEW;
END;
$$;

-- 3) Create triggers (only if they don't already exist)
DO $$
BEGIN
  -- Attach to plant_analyses inserts
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_plant_analyses_update_streak'
  ) THEN
    CREATE TRIGGER on_plant_analyses_update_streak
    AFTER INSERT ON public.plant_analyses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_streak_on_activity();
  END IF;

  -- Attach to chat_history inserts
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_chat_history_update_streak'
  ) THEN
    CREATE TRIGGER on_chat_history_update_streak
    AFTER INSERT ON public.chat_history
    FOR EACH ROW
    EXECUTE FUNCTION public.update_streak_on_activity();
  END IF;
END $$;