import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RewardCheckRequest {
  current_streak: number;
}

interface RewardUnlockedResponse {
  badges: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  avatars: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

Deno.serve(async (req) => {
  console.log('🎯 Starting check-streak-rewards function...');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Set the auth context for the client
    const token = authHeader.replace('Bearer ', '');
    await supabaseClient.auth.setAuth(token);

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      console.error('❌ Invalid or expired token:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // Parse request body to get current streak
    const body = await req.json() as RewardCheckRequest;
    const currentStreak = body.current_streak;

    if (typeof currentStreak !== 'number' || currentStreak < 0) {
      console.error('❌ Invalid streak value:', currentStreak);
      return new Response(
        JSON.stringify({ error: 'Invalid current_streak value' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`🔥 Checking rewards for streak: ${currentStreak} days`);

    // Call the database function to check and unlock rewards
    const { data: rewardResult, error: rewardError } = await supabaseClient
      .rpc('check_and_unlock_streak_rewards', { current_user_streak: currentStreak });

    if (rewardError) {
      console.error('❌ Error checking streak rewards:', rewardError);
      return new Response(
        JSON.stringify({ error: 'Failed to check streak rewards', details: rewardError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const newRewards = rewardResult as RewardUnlockedResponse;
    console.log('🎉 Newly unlocked rewards:', {
      badges: newRewards.badges.length,
      avatars: newRewards.avatars.length
    });

    // Log individual rewards for debugging
    if (newRewards.badges.length > 0) {
      console.log('🏆 New badges unlocked:', newRewards.badges.map(b => b.name));
    }
    if (newRewards.avatars.length > 0) {
      console.log('🎨 New avatars unlocked:', newRewards.avatars.map(a => a.name));
    }

    return new Response(
      JSON.stringify({
        success: true,
        newly_unlocked: newRewards,
        message: `Checked rewards for ${currentStreak}-day streak`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Unexpected error in check-streak-rewards:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});