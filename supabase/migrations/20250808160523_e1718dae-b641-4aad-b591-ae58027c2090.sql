-- Create user_streaks table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'user_streaks'
  ) THEN
    CREATE TABLE public.user_streaks (
      user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      current_streak integer NOT NULL DEFAULT 0,
      last_action date NOT NULL DEFAULT CURRENT_DATE,
      grace_days integer NOT NULL DEFAULT 0
    );
  END IF;
END $$;

-- Enable RLS (safe to run multiple times)
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own streak row (idempotent creation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'user_streaks' 
      AND policyname = 'Users can manage their own streak'
  ) THEN
    CREATE POLICY "Users can manage their own streak"
    ON public.user_streaks
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Service role full access (idempotent creation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'user_streaks' 
      AND policyname = 'Service role can manage user_streaks'
  ) THEN
    CREATE POLICY "Service role can manage user_streaks"
    ON public.user_streaks
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;
