

-- More comprehensive user deletion process
-- This should be run directly in the SQL Editor

-- Function to check for and remove any pending subscriptions
CREATE OR REPLACE FUNCTION check_and_remove_pending_subscriptions(email_param TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM pending_subscriptions WHERE email = email_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create an improved user deletion function that first identifies and removes all related data
CREATE OR REPLACE FUNCTION public.safely_delete_user(user_id_to_delete uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get the user's email for cleanup
  SELECT email INTO user_email FROM auth.users WHERE id = user_id_to_delete;
  
  -- Clean up all dependent tables in the correct order
  -- First remove any pending subscriptions for this user
  IF user_email IS NOT NULL THEN
    DELETE FROM public.pending_subscriptions WHERE email = user_email;
  END IF;
  
  -- Delete from all related tables that have user_id references
  DELETE FROM public.assistant_settings WHERE user_id = user_id_to_delete;
  DELETE FROM public.chat_history WHERE user_id = user_id_to_delete;
  DELETE FROM public.plant_analyses WHERE user_id = user_id_to_delete;
  DELETE FROM public.quiz_responses WHERE user_id = user_id_to_delete;
  DELETE FROM public.subscriptions WHERE user_id = user_id_to_delete;
  DELETE FROM public.share_metrics WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_feedback WHERE user_id = user_id_to_delete;
  
  -- Important: Delete from user_profiles BEFORE deleting from auth.users
  -- This is critical as the foreign key constraint is causing the error
  DELETE FROM public.user_profiles WHERE id = user_id_to_delete;
  
  -- Finally, after all dependencies are cleaned up, delete the user
  DELETE FROM auth.users WHERE id = user_id_to_delete;
END;
$$;

-- Now safely delete the users, excluding 945c75d4-f5b3-4eb0-937b-8e76048222f2
DO $$
BEGIN
  -- Try deleting users from the list shown in the dashboard image
  PERFORM safely_delete_user('0bcc8fbd-5f98-4204-9900-66d99faadcbc');
  PERFORM safely_delete_user('3de2c0e-d347-424d-9eb7-2b8b9fd22d4d');
  PERFORM safely_delete_user('7c5ec20-d8c4-431c-b3c4-c73578d4f70b');
  PERFORM safely_delete_user('e3af4546-bf2d-4a7a-b208-411d81aac5ba');
  PERFORM safely_delete_user('ec922992-0022-42c0-bd83-6f9acc9ce2e8');
END
$$;

