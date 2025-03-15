import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://inbfxduleyhygxatxmre.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYmZ4ZHVsZXloeWd4YXR4bXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NDc2MjksImV4cCI6MjA0OTMyMzYyOX0.l0HrL8MlQrRmIEALGTEOhPz41QhzQ_F73A0C8FsIAeQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

// Enhanced logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`[Supabase] Auth state changed: ${event}`, session ? 'User logged in' : 'No user');
  if (session) {
    console.log('[Supabase] User ID:', session.user.id);
    console.log('[Supabase] User email:', session.user.email);
    console.log('[Supabase] User metadata:', session.user.user_metadata);
    
    // Force create profile if we have a user session
    createUserProfileIfNeeded(session.user.id, session.user);
  }
});

// Function to create user profile if it doesn't exist
async function createUserProfileIfNeeded(userId, user) {
  try {
    console.log('[Supabase] Checking if profile exists for user:', userId);
    
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError) {
      console.error('[Supabase] Error checking profile:', profileError);
      return;
    }
    
    if (!profile) {
      console.log('[Supabase] No profile found, creating default profile');
      
      // Extract name from metadata if available
      let username = user.email?.split('@')[0] || 'User';
      if (user.user_metadata?.full_name) {
        username = user.user_metadata.full_name;
      } else if (user.user_metadata?.name) {
        username = user.user_metadata.name;
      }
      
      // Create default profile with required fields
      const defaultProfile = {
        id: userId,
        username,
        grow_experience_level: 'new',
        has_completed_quiz: true, // Auto-complete quiz
        goals: ['learn'],
        challenges: ['none'],
        nutrient_type: 'organic',
        growing_method: 'indoor',
        monitoring_method: 'manual'
      };
      
      const { error: createError } = await supabase
        .from('user_profiles')
        .insert(defaultProfile);
      
      if (createError) {
        console.error('[Supabase] Error creating profile:', createError);
        return;
      }
      
      console.log('[Supabase] Created default profile successfully');
    } else {
      console.log('[Supabase] Profile already exists:', profile);
      
      // If profile exists but quiz not completed, mark it as completed
      if (!profile.has_completed_quiz) {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            has_completed_quiz: true,
            goals: profile.goals || ['learn'],
            challenges: profile.challenges || ['none'],
            nutrient_type: profile.nutrient_type || 'organic',
            growing_method: profile.growing_method || 'indoor',
            monitoring_method: profile.monitoring_method || 'manual'
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error('[Supabase] Error updating profile quiz status:', updateError);
        } else {
          console.log('[Supabase] Updated profile to complete quiz');
        }
      }
    }
  } catch (error) {
    console.error('[Supabase] Unexpected error in profile creation:', error);
  }
}

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

// Enhanced safe delete users helper function with fallback mechanisms
export const safeDeleteUser = async (userId: string) => {
  console.log(`Attempting to delete user with ID: ${userId}`);
  
  try {
    // Try direct admin API first (requires auth.users permissions)
    // Fixed: The deleteUser method takes a string userId parameter, not an object
    const adminDeleteResult = await supabase.auth.admin.deleteUser(userId);
    
    if (!adminDeleteResult.error) {
      console.log('User successfully deleted via admin API');
      return { success: true };
    }
    
    console.log('Admin API deletion failed, error:', adminDeleteResult.error);
    console.log('Falling back to RPC function...');
    
    // Fallback: Try using our SQL RPC function
    const { error: rpcError } = await supabase.rpc('safely_delete_user', {
      user_id_to_delete: userId
    });
    
    if (rpcError) {
      console.error('Error in data cleanup via RPC:', rpcError);
      
      // Additional diagnostic information
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError) {
        console.log('User lookup error:', userError);
        if (userError.message.includes('User not found')) {
          // If user doesn't exist, consider this a "success" since the goal was to delete
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

// Function to check if a user exists
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
