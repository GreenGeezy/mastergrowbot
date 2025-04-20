
-- Function to mark a user as having completed the quiz
CREATE OR REPLACE FUNCTION public.mark_user_completed_quiz(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update the user profile to mark quiz as completed
  UPDATE public.user_profiles
  SET has_completed_quiz = true,
      updated_at = NOW()
  WHERE id = user_id;
  
  -- If no row was updated, insert a new one
  IF NOT FOUND THEN
    INSERT INTO public.user_profiles (id, email, has_completed_quiz, updated_at)
    VALUES (user_id, user_email, true, NOW());
  END IF;
  
  -- Add a default quiz response if none exists
  INSERT INTO public.quiz_responses (
    user_id, 
    experience_level, 
    growing_method, 
    challenges, 
    monitoring_method, 
    nutrient_type, 
    goals
  )
  VALUES (
    user_id, 
    'intermediate', 
    'indoor', 
    ARRAY['none']::TEXT[], 
    'manual', 
    'organic', 
    ARRAY['learn']::TEXT[]
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$;
