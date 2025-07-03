
-- Add attachment support to chat_history table
ALTER TABLE public.chat_history 
ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.chat_history.attachments IS 'Array of attachment objects with URL, filename, and type information';
