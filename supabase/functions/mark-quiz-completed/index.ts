
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Initialize Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // Parse request body
    const requestData = await req.json();
    const { user_id, email, subscription_type = "basic" } = requestData;

    console.log("Mark quiz completed request:", { 
      user_id, 
      email, 
      subscription_type 
    });

    let userId = user_id;

    // If no user_id but email is provided, try to look up the user by email
    if (!userId && email) {
      console.log("Looking up user by email:", email);
      
      // First, try to find the user in auth.users
      const { data: authUser, error: authError } = await supabaseClient.auth.admin.listUsers({
        filters: {
          email: email
        }
      });

      if (authError) {
        console.error("Error looking up user by email:", authError);
      } else if (authUser && authUser.users.length > 0) {
        userId = authUser.users[0].id;
        console.log("Found user ID by email:", userId);
      } else {
        console.log("No user found with email:", email);
      }
    }

    // If we have a user ID, update the user's metadata and profiles table
    if (userId) {
      console.log("Updating user metadata for user ID:", userId);
      
      // Update auth user metadata
      const { error: updateError } = await supabaseClient.auth.admin.updateUserById(userId, {
        user_metadata: { has_completed_quiz: true }
      });

      if (updateError) {
        console.error("Error updating user metadata:", updateError);
      }

      // Update user profile to mark quiz as completed
      const { error: profileError } = await supabaseClient
        .from("user_profiles")
        .upsert({
          id: userId,
          email: email,
          has_completed_quiz: true
        });

      if (profileError) {
        console.error("Error updating user profile:", profileError);
      }

      // Create or update user quiz responses with default values
      const { error: quizError } = await supabaseClient
        .from("quiz_responses")
        .upsert({
          user_id: userId,
          experience_level: 'intermediate',
          growing_method: 'indoor',
          challenges: ['none'],
          monitoring_method: 'manual',
          nutrient_type: 'organic',
          goals: ['learn']
        });

      if (quizError) {
        console.error("Error creating quiz responses:", quizError);
      }

      // Check for pending subscriptions - FIXED to handle multiple rows
      const { data: pendingSubs, error: pendingError } = await supabaseClient
        .from("pending_subscriptions")
        .select("*")
        .eq("email", email)
        .eq("consumed", false);

      if (pendingError) {
        console.error("Error checking pending subscriptions:", pendingError);
      } else {
        // Get the most recent pending subscription if multiple exist
        const pendingSub = pendingSubs && pendingSubs.length > 0 
          ? pendingSubs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
          : null;

        if (pendingSub) {
          console.log("Activating pending subscription:", pendingSub);
          
          try {
            // Create or update subscription record
            const { error: subError } = await supabaseClient
              .from("subscriptions")
              .upsert({
                user_id: userId,
                subscription_type: pendingSub.subscription_type || subscription_type || "basic",
                status: "active",
                starts_at: new Date().toISOString(),
                expires_at: pendingSub.subscription_type === "annual" 
                  ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                  : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              });
            
            if (subError) {
              console.error("Error creating subscription:", subError);
            } else {
              // Mark the pending subscription as consumed
              await supabaseClient
                .from("pending_subscriptions")
                .update({ consumed: true })
                .eq("id", pendingSub.id);
              
              console.log("Successfully activated subscription for user");
            }
          } catch (error) {
            console.error("Exception when activating subscription:", error);
          }
        } else if (subscription_type) {
          // No pending subscription found, but we'll still create one if subscription_type is provided
          console.log("Creating new subscription with type:", subscription_type);
          
          try {
            const { error: subError } = await supabaseClient
              .from("subscriptions")
              .upsert({
                user_id: userId,
                subscription_type: subscription_type,
                status: "active",
                starts_at: new Date().toISOString(),
                expires_at: subscription_type === "annual" 
                  ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                  : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              });
            
            if (subError) {
              console.error("Error creating new subscription:", subError);
            } else {
              console.log("Successfully created new subscription for user");
            }
          } catch (error) {
            console.error("Exception when creating subscription:", error);
          }
        }
      }
    }

    // For admin/special case: direct database activation without auth
    // This is a special function to directly mark quiz as completed when requested
    if (email && !userId) {
      try {
        console.log("Running manual activation for email without user ID:", email);
        
        // Create a pending subscription if it doesn't exist
        const { error: pendingError } = await supabaseClient
          .from("pending_subscriptions")
          .upsert({
            email: email,
            subscription_type: subscription_type || "basic",
            has_completed_quiz: true,
            consumed: false,
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          });
        
        if (pendingError) {
          console.error("Error creating pending subscription:", pendingError);
        } else {
          console.log("Successfully created pending subscription for future activation");
        }
      } catch (error) {
        console.error("Error in manual activation:", error);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in mark-quiz-completed function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
