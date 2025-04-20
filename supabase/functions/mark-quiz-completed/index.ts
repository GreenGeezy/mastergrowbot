
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
      
      // Check for pending subscription regardless of whether we found a user
      const { data: userData, error: userError } = await supabaseClient
        .from("pending_subscriptions")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (userError) {
        console.error("Error finding pending subscription:", userError);
      }

      if (userData) {
        console.log("Found pending subscription:", userData);
        
        // Update pending subscription with completed quiz
        await supabaseClient
          .from("pending_subscriptions")
          .update({ has_completed_quiz: true })
          .eq("email", email);
      } else {
        console.log("No pending subscription found for email, creating one");
        
        // Create pending subscription
        await supabaseClient.from("pending_subscriptions").insert({
          email: email,
          subscription_type: subscription_type || "basic",
          has_completed_quiz: true
        });
      }
    }

    // If we have a user ID, update the user's metadata
    if (userId) {
      console.log("Updating user metadata for user ID:", userId);
      
      const { error: updateError } = await supabaseClient.auth.admin.updateUserById(userId, {
        user_metadata: { has_completed_quiz: true }
      });

      if (updateError) {
        console.error("Error updating user metadata:", updateError);
      }

      // Check if there's a pending subscription to activate
      let pendingSub;
      
      if (email) {
        const { data, error: pendingError } = await supabaseClient
          .from("pending_subscriptions")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (pendingError) {
          console.error("Error checking pending subscription:", pendingError);
        } else {
          pendingSub = data;
        }
      }

      if (pendingSub) {
        console.log("Activating pending subscription:", pendingSub);
        
        try {
          const { error: upsertError } = await supabaseClient.from("user_subscriptions").upsert({
            user_id: userId,
            subscription_type: pendingSub.subscription_type || subscription_type || "basic",
            is_active: true,
            start_date: new Date().toISOString(),
            // For annual subscriptions, set expiry to 1 year from now
            end_date: pendingSub.subscription_type === "annual" 
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
          
          if (upsertError) {
            console.error("Error upserting subscription:", upsertError);
          } else {
            console.log("Successfully activated subscription for user");
          }
        } catch (error) {
          console.error("Exception when activating subscription:", error);
        }
      } else if (subscription_type) {
        // No pending subscription found, but we'll still create one if subscription_type is provided
        console.log("Creating new subscription with type:", subscription_type);
        
        try {
          const { error: upsertError } = await supabaseClient.from("user_subscriptions").upsert({
            user_id: userId,
            subscription_type: subscription_type,
            is_active: true,
            start_date: new Date().toISOString(),
            // For annual subscriptions, set expiry to 1 year from now
            end_date: subscription_type === "annual" 
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
          
          if (upsertError) {
            console.error("Error creating new subscription:", upsertError);
          } else {
            console.log("Successfully created new subscription for user");
          }
        } catch (error) {
          console.error("Exception when creating subscription:", error);
        }
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
