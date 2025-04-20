CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  has_pending_sub BOOLEAN;
  sub_type TEXT;
  expiry TIMESTAMP WITH TIME ZONE;
  is_required BOOLEAN;
  supabase_url TEXT;
  anon_key TEXT;
BEGIN
  -- Create user profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  -- Check if a pending subscription exists for the user
  SELECT EXISTS (
    SELECT 1
    FROM public.pending_subscriptions
    WHERE email = new.email
    AND consumed = FALSE
  ) INTO has_pending_sub;

  -- Get subscription details if pending subscription exists
  IF has_pending_sub THEN
    SELECT subscription_type, expires_at
    INTO sub_type, expiry
    FROM public.pending_subscriptions
    WHERE email = new.email
    AND consumed = FALSE
    LIMIT 1;
  END IF;
  
  -- Check if quiz and subscription are required
  SELECT value::BOOLEAN INTO is_required FROM public.site_settings WHERE name = 'require_quiz_and_subscription';

  -- If pending subscription exists, create active subscription and send email
  IF has_pending_sub THEN
    -- Mark pending subscription as consumed and create subscription
    UPDATE public.pending_subscriptions
    SET consumed = TRUE
    WHERE email = new.email
    AND consumed = FALSE;

    -- Create subscription
    INSERT INTO public.subscriptions (user_id, subscription_type, expires_at)
    VALUES (new.id, sub_type, expiry);
    
    -- Send subscription confirmation email
    PERFORM net.http_post(
      url := CONCAT(Deno.env.get('SUPABASE_URL'), '/functions/v1/send-subscription-email'),
      headers := jsonb_build_object(
        'Authorization', CONCAT('Bearer ', Deno.env.get('SUPABASE_ANON_KEY')),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'email', new.email,
        'subscriptionType', sub_type
      )
    );
  END IF;

  -- If quiz and subscription are required, check if the user has completed the quiz
  IF is_required THEN
    -- Check if the user has completed the quiz
    IF NOT EXISTS (SELECT 1 FROM public.quiz_responses WHERE user_id = new.id) THEN
      RAISE EXCEPTION 'User must complete the quiz before accessing the application.';
    END IF;

    -- Check if the user has an active subscription
    IF NOT has_pending_sub AND NOT EXISTS (SELECT 1 FROM public.subscriptions WHERE user_id = new.id AND expires_at > NOW()) THEN
      RAISE EXCEPTION 'User must have an active subscription to access the application.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;
