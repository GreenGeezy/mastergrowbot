
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://inbfxduleyhygxatxmre.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYmZ4ZHVsZXloeWd4YXR4bXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NDc2MjksImV4cCI6MjA0OTMyMzYyOX0.l0HrL8MlQrRmIEALGTEOhPz41QhzQ_F73A0C8FsIAeQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    fetch: (url, options) => {
      // Add additional logging for debugging auth and user operations
      if (url.toString().includes('/auth/') || url.toString().includes('/users/')) {
        console.log('Auth operation:', url, options?.method);
      }
      return fetch(url, options);
    }
  }
});

// Initialize storage bucket
(async () => {
  try {
    // Try to create the bucket via our edge function
    const { error } = await supabase.functions.invoke('create-storage-bucket');
    if (error) {
      console.error('Error creating storage bucket:', error);
    } else {
      console.log('Storage bucket setup completed');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
})();

// Safe delete users helper function that cleans up all related data first
export const safeDeleteUser = async (userId: string) => {
  try {
    // First clean up user data via RPC function
    const { error: rpcError } = await supabase.rpc('safely_delete_user', {
      user_id_to_delete: userId
    });
    
    if (rpcError) {
      console.error('Error in data cleanup:', rpcError);
      return { success: false, error: rpcError };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in user deletion process:', error);
    return { success: false, error };
  }
};
