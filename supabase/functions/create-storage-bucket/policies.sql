
-- Create RLS policies for plant-images storage bucket
CREATE OR REPLACE FUNCTION create_storage_policies()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Allow authenticated users to upload to plant-images bucket
  INSERT INTO storage.policies (name, bucket_id, operation, definition)
  VALUES (
    'Allow authenticated users to upload plant images',
    'plant-images',
    'INSERT',
    'auth.role() = ''authenticated'''
  )
  ON CONFLICT (name, bucket_id) DO NOTHING;

  -- Allow public read access to plant images
  INSERT INTO storage.policies (name, bucket_id, operation, definition)
  VALUES (
    'Allow public read access to plant images',
    'plant-images',
    'SELECT',
    'true'
  )
  ON CONFLICT (name, bucket_id) DO NOTHING;

  -- Allow users to update their own uploads
  INSERT INTO storage.policies (name, bucket_id, operation, definition)
  VALUES (
    'Allow users to update their own plant images',
    'plant-images',
    'UPDATE',
    'auth.uid()::text = (storage.foldername(name))[1]'
  )
  ON CONFLICT (name, bucket_id) DO NOTHING;

  -- Allow users to delete their own uploads
  INSERT INTO storage.policies (name, bucket_id, operation, definition)
  VALUES (
    'Allow users to delete their own plant images',
    'plant-images',
    'DELETE',
    'auth.uid()::text = (storage.foldername(name))[1]'
  )
  ON CONFLICT (name, bucket_id) DO NOTHING;
END;
$$;
