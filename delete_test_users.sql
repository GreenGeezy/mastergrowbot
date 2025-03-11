
-- More comprehensive user deletion process
-- This should be run directly in the SQL Editor

-- Function to check for and remove any pending subscriptions
CREATE OR REPLACE FUNCTION check_and_remove_pending_subscriptions(email_param TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM pending_subscriptions WHERE email = email_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- First, get the emails for specific users to clean up pending_subscriptions
DO $$
DECLARE
  user_email TEXT;
BEGIN
  -- Process each user ID and clean up pending subscriptions
  
  -- For user c3af456b-bf2e-4e7e-b20b-41d818cac0ba
  SELECT email INTO user_email FROM auth.users WHERE id = 'c3af456b-bf2e-4e7e-b20b-41d818cac0ba';
  IF user_email IS NOT NULL THEN
    PERFORM check_and_remove_pending_subscriptions(user_email);
  END IF;
  
  -- For user ec922992-0022-42c0-bd83-6f9acc9ce2e8
  SELECT email INTO user_email FROM auth.users WHERE id = 'ec922992-0022-42c0-bd83-6f9acc9ce2e8';
  IF user_email IS NOT NULL THEN
    PERFORM check_and_remove_pending_subscriptions(user_email);
  END IF;
  
  -- For user 0bcc8fbd-5f98-4204-9900-56d59fa9abcb
  SELECT email INTO user_email FROM auth.users WHERE id = '0bcc8fbd-5f98-4204-9900-56d59fa9abcb';
  IF user_email IS NOT NULL THEN
    PERFORM check_and_remove_pending_subscriptions(user_email);
  END IF;
  
  -- For user 7c5bc430-88cf-43bc-b3c4-c73597894f0b
  SELECT email INTO user_email FROM auth.users WHERE id = '7c5bc430-88cf-43bc-b3c4-c73597894f0b';
  IF user_email IS NOT NULL THEN
    PERFORM check_and_remove_pending_subscriptions(user_email);
  END IF;
END $$;

-- Now safely delete the users
SELECT safely_delete_user('c3af456b-bf2e-4e7e-b20b-41d818cac0ba');
SELECT safely_delete_user('ec922992-0022-42c0-bd83-6f9acc9ce2e8');
SELECT safely_delete_user('0bcc8fbd-5f98-4204-9900-56d59fa9abcb');
SELECT safely_delete_user('7c5bc430-88cf-43bc-b3c4-c73597894f0b');
