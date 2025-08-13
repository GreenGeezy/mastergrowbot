-- Personal Milestone Celebrations for Bud Boost Run Streaks
-- This creates isolated tables for milestone tracking without affecting auth/payment flows

-- Create milestones catalog table (read-only reference data)
CREATE TABLE public.milestones_catalog (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  fun_fact TEXT NOT NULL,
  streak_requirement INTEGER NOT NULL,
  milestone_type TEXT DEFAULT 'streak' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on milestones catalog
ALTER TABLE public.milestones_catalog ENABLE ROW LEVEL SECURITY;

-- Create user milestones table for tracking personal achievements
CREATE TABLE public.user_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  milestone_id TEXT NOT NULL REFERENCES public.milestones_catalog(id),
  celebrated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, milestone_id)
);

-- Enable RLS on user milestones
ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for milestones_catalog (public read access)
CREATE POLICY "Anyone can read milestones catalog"
ON public.milestones_catalog
FOR SELECT
USING (true);

-- RLS Policies for user_milestones (user-specific data only)
CREATE POLICY "Users can read their own milestones"
ON public.user_milestones
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own milestones"
ON public.user_milestones
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
ON public.user_milestones
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Pre-populate milestones catalog with fun streak achievements
INSERT INTO public.milestones_catalog (id, title, fun_fact, streak_requirement) VALUES
('3_day_streak', '3-Day Bud Boost Run Streak Achieved!', 'You''ve boosted enough to start a mini garden!', 3),
('7_day_streak', '7-Day Bud Boost Run Streak Achieved!', 'Your plants are thriving – equivalent to a week''s worth of expert care!', 7),
('14_day_streak', '14-Day Bud Boost Run Streak Achieved!', 'You''ve boosted enough for a virtual harvest!', 14),
('30_day_streak', '30-Day Bud Boost Run Streak Achieved!', 'You''re a growing legend – that''s a full month''s boost power!', 30),
('50_day_streak', '50-Day Bud Boost Run Streak Achieved!', 'Master level dedication! Your expertise could fill a grow book!', 50),
('100_day_streak', '100-Day Bud Boost Run Streak Achieved!', 'Century Club! You''ve officially become a cannabis cultivation guru!', 100);

-- Function to check for new milestone achievements (post-auth only)
CREATE OR REPLACE FUNCTION public.check_personal_milestone_achievements(current_user_streak INTEGER)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_uuid UUID;
  newly_achieved JSON := '{"milestones": []}';
  milestone_record RECORD;
  milestone_array JSON[] := '{}';
BEGIN
  -- Ensure user is authenticated (post-auth safety check)
  user_uuid := auth.uid();
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User not authenticated - milestone checks only work for signed-in users';
  END IF;

  -- Find milestones that user has achieved but not yet celebrated
  FOR milestone_record IN 
    SELECT mc.id, mc.title, mc.fun_fact, mc.streak_requirement
    FROM milestones_catalog mc
    WHERE mc.streak_requirement <= current_user_streak
    AND NOT EXISTS (
      SELECT 1 FROM user_milestones um 
      WHERE um.user_id = user_uuid AND um.milestone_id = mc.id
    )
    ORDER BY mc.streak_requirement ASC
  LOOP
    -- Record the achievement
    INSERT INTO user_milestones (user_id, milestone_id)
    VALUES (user_uuid, milestone_record.id);
    
    -- Add to response array
    milestone_array := milestone_array || json_build_object(
      'id', milestone_record.id,
      'title', milestone_record.title,
      'fun_fact', milestone_record.fun_fact,
      'streak_requirement', milestone_record.streak_requirement
    );
  END LOOP;

  -- Build the result
  newly_achieved := json_build_object(
    'milestones', array_to_json(milestone_array)
  );

  RETURN newly_achieved;
END;
$$;

-- Function to mark milestone as shared (for viral sharing)
CREATE OR REPLACE FUNCTION public.mark_milestone_shared(milestone_achievement_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_uuid UUID;
BEGIN
  user_uuid := auth.uid();
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Update the milestone to mark as shared
  UPDATE user_milestones 
  SET is_shared = true 
  WHERE id = milestone_achievement_id 
  AND user_id = user_uuid;

  RETURN FOUND;
END;
$$;