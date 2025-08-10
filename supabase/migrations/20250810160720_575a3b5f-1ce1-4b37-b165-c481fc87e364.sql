-- 1) Create table for leaderboard profiles (idempotent)
create table if not exists public.leaderboard_profiles (
  user_id uuid not null,
  leaderboard_name text not null default '',
  is_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure primary key on user_id (idempotent via constraint check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'leaderboard_profiles_pkey'
  ) THEN
    ALTER TABLE public.leaderboard_profiles
      ADD CONSTRAINT leaderboard_profiles_pkey PRIMARY KEY (user_id);
  END IF;
END
$$;

-- Ensure FK to auth.users(id) with ON DELETE CASCADE (idempotent via constraint check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leaderboard_profiles_user_id_fkey'
  ) THEN
    ALTER TABLE public.leaderboard_profiles
      ADD CONSTRAINT leaderboard_profiles_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END
$$;

-- Column existence & defaults safety (in case table existed already)
ALTER TABLE public.leaderboard_profiles
  ADD COLUMN IF NOT EXISTS leaderboard_name text not null default '';
ALTER TABLE public.leaderboard_profiles
  ADD COLUMN IF NOT EXISTS is_opt_in boolean not null default false;
ALTER TABLE public.leaderboard_profiles
  ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();
ALTER TABLE public.leaderboard_profiles
  ADD COLUMN IF NOT EXISTS updated_at timestamptz not null default now();

-- Make sure defaults are set as specified
ALTER TABLE public.leaderboard_profiles
  ALTER COLUMN leaderboard_name SET DEFAULT '';
ALTER TABLE public.leaderboard_profiles
  ALTER COLUMN is_opt_in SET DEFAULT false;
ALTER TABLE public.leaderboard_profiles
  ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE public.leaderboard_profiles
  ALTER COLUMN updated_at SET DEFAULT now();

-- 2) Enable RLS
alter table public.leaderboard_profiles enable row level security;

-- Policies: Users can manage their own row (SELECT/INSERT/UPDATE)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'leaderboard_profiles'
      AND policyname = 'Users can select own leaderboard profile'
  ) THEN
    CREATE POLICY "Users can select own leaderboard profile"
      ON public.leaderboard_profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'leaderboard_profiles'
      AND policyname = 'Users can insert own leaderboard profile'
  ) THEN
    CREATE POLICY "Users can insert own leaderboard profile"
      ON public.leaderboard_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'leaderboard_profiles'
      AND policyname = 'Users can update own leaderboard profile'
  ) THEN
    CREATE POLICY "Users can update own leaderboard profile"
      ON public.leaderboard_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Policy: Authenticated users can SELECT opted-in rows (for leaderboard)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'leaderboard_profiles'
      AND policyname = 'Authenticated can view opted-in leaderboard profiles'
  ) THEN
    CREATE POLICY "Authenticated can view opted-in leaderboard profiles"
      ON public.leaderboard_profiles
      FOR SELECT
      TO authenticated
      USING (is_opt_in = true);
  END IF;
END $$;

-- Add updated_at trigger (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'leaderboard_profiles_updated_at'
  ) THEN
    CREATE TRIGGER leaderboard_profiles_updated_at
    BEFORE UPDATE ON public.leaderboard_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 3) Index for ranking display (idempotent)
create index if not exists idx_user_streaks_rank
  on public.user_streaks (current_streak desc, last_action desc);
