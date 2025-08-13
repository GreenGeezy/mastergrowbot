-- Create badges catalog table (read-only reference data)
CREATE TABLE public.badges_catalog (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon_url TEXT,
  description TEXT NOT NULL,
  unlock_requirement INTEGER NOT NULL, -- streak days required
  badge_type TEXT DEFAULT 'streak' CHECK (badge_type IN ('streak', 'achievement')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user badges table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES public.badges_catalog(id),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, badge_id)
);

-- Create avatar customizations catalog
CREATE TABLE public.avatar_customizations_catalog (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  description TEXT NOT NULL,
  unlock_requirement INTEGER NOT NULL, -- streak days required
  customization_type TEXT DEFAULT 'background' CHECK (customization_type IN ('background', 'frame', 'effect')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user avatars table
CREATE TABLE public.user_avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_customization_id TEXT NOT NULL REFERENCES public.avatar_customizations_catalog(id),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT false,
  UNIQUE(user_id, avatar_customization_id)
);

-- Enable RLS on all tables
ALTER TABLE public.badges_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_customizations_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_avatars ENABLE ROW LEVEL SECURITY;

-- RLS Policies for badges_catalog (read-only for authenticated users)
CREATE POLICY "Authenticated users can read badges catalog" 
ON public.badges_catalog FOR SELECT 
TO authenticated 
USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can read their own badges" 
ON public.user_badges FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges" 
ON public.user_badges FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own badges" 
ON public.user_badges FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for avatar_customizations_catalog (read-only for authenticated users)
CREATE POLICY "Authenticated users can read avatar customizations catalog" 
ON public.avatar_customizations_catalog FOR SELECT 
TO authenticated 
USING (true);

-- RLS Policies for user_avatars
CREATE POLICY "Users can read their own avatars" 
ON public.user_avatars FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own avatars" 
ON public.user_avatars FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own avatars" 
ON public.user_avatars FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create storage buckets for assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('badge-icons', 'badge-icons', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('avatar-backgrounds', 'avatar-backgrounds', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp']);

-- Storage policies for badge icons
CREATE POLICY "Public can view badge icons"
ON storage.objects FOR SELECT
USING (bucket_id = 'badge-icons');

CREATE POLICY "Authenticated users can upload badge icons"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'badge-icons');

-- Storage policies for avatar backgrounds  
CREATE POLICY "Public can view avatar backgrounds"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatar-backgrounds');

CREATE POLICY "Authenticated users can upload avatar backgrounds"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatar-backgrounds');

-- Insert sample badge data
INSERT INTO public.badges_catalog (id, name, icon_url, description, unlock_requirement) VALUES
('bud_booster_level_1', 'Bud Booster Level 1', 'https://inbfxduleyhygxatxmre.supabase.co/storage/v1/object/public/badge-icons/glowing_leaf.png', 'Reward for maintaining a 3-day Bud Boost Streak', 3),
('bud_booster_level_2', 'Bud Booster Level 2', 'https://inbfxduleyhygxatxmre.supabase.co/storage/v1/object/public/badge-icons/flowering_bud.png', 'Reward for maintaining a 7-day Bud Boost Streak', 7),
('bud_booster_level_3', 'Bud Booster Level 3', 'https://inbfxduleyhygxatxmre.supabase.co/storage/v1/object/public/badge-icons/master_grower.png', 'Reward for maintaining a 14-day Bud Boost Streak', 14),
('bud_booster_level_4', 'Bud Booster Level 4', 'https://inbfxduleyhygxatxmre.supabase.co/storage/v1/object/public/badge-icons/cannabis_champion.png', 'Reward for maintaining a 30-day Bud Boost Streak', 30);

-- Insert sample avatar customization data
INSERT INTO public.avatar_customizations_catalog (id, name, image_url, description, unlock_requirement) VALUES
('grow_room_background_1', 'Sunny Greenhouse', 'https://inbfxduleyhygxatxmre.supabase.co/storage/v1/object/public/avatar-backgrounds/greenhouse_bg.png', 'Reward unlocked via Bud Boost Streak milestones', 5),
('grow_room_background_2', 'Hydroponic Lab', 'https://inbfxduleyhygxatxmre.supabase.co/storage/v1/object/public/avatar-backgrounds/hydro_lab_bg.png', 'Reward unlocked via Bud Boost Streak milestones', 10),
('grow_room_background_3', 'Master Grower Suite', 'https://inbfxduleyhygxatxmre.supabase.co/storage/v1/object/public/avatar-backgrounds/master_suite_bg.png', 'Reward unlocked via Bud Boost Streak milestones', 20);

-- Create function to check and unlock badges based on streak
CREATE OR REPLACE FUNCTION public.check_and_unlock_streak_rewards(current_user_streak INTEGER)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_uuid UUID;
  newly_unlocked JSON := '{"badges": [], "avatars": []}';
  badge_record RECORD;
  avatar_record RECORD;
  badge_array JSON[] := '{}';
  avatar_array JSON[] := '{}';
BEGIN
  user_uuid := auth.uid();
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Check for unlockable badges
  FOR badge_record IN 
    SELECT bc.id, bc.name, bc.description, bc.unlock_requirement
    FROM badges_catalog bc
    WHERE bc.unlock_requirement <= current_user_streak
    AND NOT EXISTS (
      SELECT 1 FROM user_badges ub 
      WHERE ub.user_id = user_uuid AND ub.badge_id = bc.id
    )
  LOOP
    -- Unlock the badge
    INSERT INTO user_badges (user_id, badge_id)
    VALUES (user_uuid, badge_record.id);
    
    badge_array := badge_array || json_build_object(
      'id', badge_record.id,
      'name', badge_record.name,
      'description', badge_record.description
    );
  END LOOP;

  -- Check for unlockable avatar customizations
  FOR avatar_record IN 
    SELECT ac.id, ac.name, ac.description, ac.unlock_requirement
    FROM avatar_customizations_catalog ac
    WHERE ac.unlock_requirement <= current_user_streak
    AND NOT EXISTS (
      SELECT 1 FROM user_avatars ua 
      WHERE ua.user_id = user_uuid AND ua.avatar_customization_id = ac.id
    )
  LOOP
    -- Unlock the avatar customization
    INSERT INTO user_avatars (user_id, avatar_customization_id, is_active)
    VALUES (user_uuid, avatar_record.id, false);
    
    avatar_array := avatar_array || json_build_object(
      'id', avatar_record.id,
      'name', avatar_record.name,
      'description', avatar_record.description
    );
  END LOOP;

  -- Build the result
  newly_unlocked := json_build_object(
    'badges', array_to_json(badge_array),
    'avatars', array_to_json(avatar_array)
  );

  RETURN newly_unlocked;
END;
$$;