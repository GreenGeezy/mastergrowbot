
-- Create deletion_requests table
CREATE TABLE public.deletion_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  profile_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a deletion request (public form)
CREATE POLICY "Anyone can submit deletion request"
ON public.deletion_requests
FOR INSERT
WITH CHECK (true);

-- Only service role can read/manage deletion requests
CREATE POLICY "Service role can manage deletion requests"
ON public.deletion_requests
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Add index on email for lookups
CREATE INDEX idx_deletion_requests_email ON public.deletion_requests (email);
