-- Create waitlist table for collecting signups
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public signup)
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist
FOR INSERT
WITH CHECK (true);

-- Only authenticated admins can read waitlist
CREATE POLICY "Admins can view waitlist"
ON public.waitlist
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
    AND grow_experience_level = 'admin'
  )
);

-- Add index for email lookups
CREATE INDEX idx_waitlist_email ON public.waitlist(email);

-- Add comment for documentation
COMMENT ON TABLE public.waitlist IS 'Stores waitlist signups for the Coming Soon page';