import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://inbfxduleyhygxatxmre.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYmZ4ZHVsZXloeWd4YXR4bXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NDc2MjksImV4cCI6MjA0OTMyMzYyOX0.l0HrL8MlQrRmIEALGTEOhPz41QhzQ_F73A0C8FsIAeQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    site: 'https://auth.mastergrowbot.com'
  },
  global: {
    fetch: (url, options) => {
      if (url.toString().includes('/auth/') || url.toString().includes('/users/')) {
        console.log('Auth operation URL:', url.toString());
        console.log('Auth operation method:', options?.method);
      }
      return fetch(url, options);
    }
  }
});

supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  console.log('Session data:', session ? 'User signed in' : 'User signed out');
  console.log('Session details:', session);
  
  if (event === 'SIGNED_IN' && session) {
    const currentPath = window.location.pathname;
    const isAuthPath = currentPath.includes('/auth/callback') || 
                       currentPath.includes('/auth/v1/callback');
    
    if (isAuthPath) {
      console.log('Detecting auth callback completed, redirecting to /chat');
      window.location.href = '/chat';
    }
  }
});

(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
    } else if (data.session) {
      console.log('Existing session found:', data.session.user.email);
      
      const currentPath = window.location.pathname;
      const isAuthPath = currentPath.includes('/auth/callback') || 
                         currentPath.includes('/auth/v1/callback');
      
      if (isAuthPath) {
        console.log('Auth path with session detected, redirecting to /chat');
        window.location.href = '/chat';
      }
    }
  } catch (err) {
    console.error('Unexpected error checking session:', err);
  }
})();

(async () => {
  try {
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

export const safeDeleteUser = async (userId: string) => {
  console.log(`Attempting to delete user with ID: ${userId}`);
  
  try {
    const adminDeleteResult = await supabase.auth.admin.deleteUser(userId);
    
    if (!adminDeleteResult.error) {
      console.log('User successfully deleted via admin API');
      return { success: true };
    }
    
    console.log('Admin API deletion failed, error:', adminDeleteResult.error);
    console.log('Falling back to RPC function...');
    
    const { error: rpcError } = await supabase.rpc('safely_delete_user', {
      user_id_to_delete: userId
    });
    
    if (rpcError) {
      console.error('Error in data cleanup via RPC:', rpcError);
      
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError) {
        console.log('User lookup error:', userError);
        if (userError.message.includes('User not found')) {
          return { success: true, warning: 'User already deleted' };
        }
      } else {
        console.log('User still exists in auth table:', userData);
      }
      
      return { success: false, error: rpcError };
    }
    
    console.log('User successfully deleted via RPC function');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error in user deletion process:', error);
    return { success: false, error };
  }
};

export const checkUserExists = async (userId: string) => {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error) {
      console.log('Error checking user:', error);
      return { exists: false, error };
    }
    
    return { exists: !!data.user, user: data.user };
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return { exists: false, error };
  }
};
