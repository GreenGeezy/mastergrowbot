
-- Remove the attachments column and its comment from chat_history table
ALTER TABLE public.chat_history 
DROP COLUMN IF EXISTS attachments;
