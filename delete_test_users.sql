
-- Improved comprehensive user deletion process
-- This should be run directly in the SQL Editor

-- Function to check if a user exists in auth.users table
CREATE OR REPLACE FUNCTION user_exists(user_id_param uuid) 
RETURNS boolean AS $$
DECLARE
  user_count integer;
BEGIN
  SELECT COUNT(*) INTO user_count 
  FROM auth.users 
  WHERE id = user_id_param;
  
  RETURN user_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
  -- Check if user exists first
  IF NOT user_exists(user_id_to_delete) THEN
    RAISE NOTICE 'User with ID % does not exist, skipping deletion', user_id_to_delete;
    RETURN;
  END IF;

  -- Get the user's email for cleanup
  SELECT email INTO user_email FROM auth.users WHERE id = user_id_to_delete;
  RAISE NOTICE 'Deleting user: ID %, Email %', user_id_to_delete, user_email;
  
  -- Clean up all dependent tables in the correct order
  -- First remove any pending subscriptions for this user
  IF user_email IS NOT NULL THEN
    DELETE FROM public.pending_subscriptions WHERE email = user_email;
  END IF;
  
  -- First, delete from shared_analyses that reference plant_analyses
  DELETE FROM public.shared_analyses sa
  USING public.plant_analyses pa
  WHERE pa.user_id = user_id_to_delete
  AND sa.analysis_id = pa.id;
  
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
  
  RAISE NOTICE 'Successfully deleted user with ID %', user_id_to_delete;
END;
$$;

-- Function to safely attempt deleting users from a list
CREATE OR REPLACE FUNCTION attempt_delete_users(user_ids uuid[])
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  result_message text := '';
  success_count int := 0;
  error_count int := 0;
  error_text text;
BEGIN
  FOREACH user_id IN ARRAY user_ids LOOP
    BEGIN
      PERFORM safely_delete_user(user_id);
      success_count := success_count + 1;
      result_message := result_message || 'Successfully deleted user: ' || user_id || E'\n';
    EXCEPTION WHEN OTHERS THEN
      error_count := error_count + 1;
      GET STACKED DIAGNOSTICS error_text = PG_EXCEPTION_CONTEXT;
      result_message := result_message || 'Failed to delete user: ' || user_id || 
                        ' - Error: ' || SQLERRM || E'\n' || 'Context: ' || error_text || E'\n';
    END;
  END LOOP;
  
  result_message := 'Deletion summary: ' || success_count || ' succeeded, ' || 
                    error_count || ' failed' || E'\n\n' || result_message;
  
  RETURN result_message;
END;
$$;

-- Now safely attempt to delete the specified user IDs
SELECT attempt_delete_users(ARRAY[
  'ec522892-2022-42c0-bdd3-691acc51ae28'::uuid,
  '09cc8fbd-5f58-4204-9900-66d95faebdcb'::uuid,
  '72c5ec30-88cf-43bc-b3c4-c7357784f70b'::uuid,
  '0a82de0f-942c-4cfa-b706-43d1aef4abaf'::uuid,
  '7fe10678-900b-42ce-940f-e625631f55a0'::uuid,
  '1da5b169-1827-40d9-ac8e-fe11a048cc1f'::uuid,
  '05086798-9bfb-4090-85b3-51e21cec44a7'::uuid
]);
