
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse the request body
    const { user_id, email } = await req.json();

    if (!user_id && !email) {
      return new Response(
        JSON.stringify({
          error: "Either user_id or email must be provided",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    let userId = user_id;
    let userEmail = email;

    console.log("mark-quiz-completed called with:", { userId, userEmail });

    // If only email is provided, look up the user_id
    if (!userId && userEmail) {
      // First try to find the user in user_profiles
      const { data: userData, error: userError } = await supabaseClient
        .from("user_profiles")
        .select("id")
        .eq("email", userEmail)
        .single();

      if (userError) {
        console.log("User not found in profiles, checking auth.users");
        // If user profile doesn't exist, lookup in auth.users
        const { data: authUser, error: authError } = await supabaseClient.auth.admin.getUserByEmail(userEmail);
        
        if (authError || !authUser) {
          console.log("User not found in auth.users either:", authError);
          return new Response(
            JSON.stringify({ error: "User not found" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 404,
            }
          );
        }
        
        userId = authUser.user.id;
        console.log("Found user in auth.users:", userId);
      } else {
        userId = userData.id;
        console.log("Found user in profiles:", userId);
      }
    } else if (userId && !userEmail) {
      // If only user_id is provided, look up the email
      const { data: authUser, error: authError } = await supabaseClient.auth.admin.getUserById(userId);
      
      if (authError || !authUser) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          }
        );
      }
      
      userEmail = authUser.user.email;
      console.log("Retrieved email from auth.users:", userEmail);
    }

    // Check for pending subscriptions for this user based on email
    if (userEmail) {
      console.log("Checking for pending subscriptions for:", userEmail);
      const { data: pendingSubs, error: pendingSubError } = await supabaseClient
        .from("pending_subscriptions")
        .select("*")
        .eq("email", userEmail)
        .eq("consumed", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1);

      if (!pendingSubError && pendingSubs && pendingSubs.length > 0) {
        const pendingSub = pendingSubs[0];
        console.log("Found pending subscription:", pendingSub);
        
        // Create or update subscription for this user
        const { error: subscriptionError } = await supabaseClient
          .from("subscriptions")
          .upsert({
            user_id: userId,
            subscription_type: pendingSub.subscription_type,
            expires_at: pendingSub.expires_at,
            status: "active",
          }, { onConflict: 'user_id' });
          
        if (subscriptionError) {
          console.error("Error creating subscription:", subscriptionError);
        } else {
          console.log("Created/updated subscription successfully");
          
          // Mark the pending subscription as consumed
          await supabaseClient
            .from("pending_subscriptions")
            .update({ consumed: true })
            .eq("id", pendingSub.id);
            
          console.log("Marked pending subscription as consumed");
        }
      } else {
        console.log("No pending subscription found or error:", pendingSubError);
      }
    }

    // Update user profile to mark quiz as completed
    const { error: updateError } = await supabaseClient
      .from("user_profiles")
      .upsert({
        id: userId,
        email: userEmail,
        has_completed_quiz: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      throw updateError;
    }
    
    console.log("Updated user profile - marked quiz as completed");

    // Insert a quiz_responses record if one doesn't exist
    const { error: quizResponseError } = await supabaseClient
      .from("quiz_responses")
      .upsert({
        user_id: userId,
        experience_level: "intermediate", // Default values
        growing_method: "indoor",
        challenges: ["none"],
        monitoring_method: "manual",
        nutrient_type: "organic",
        goals: ["learn"],
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (quizResponseError) {
      console.error("Error creating quiz response:", quizResponseError);
      // Continue execution even if this fails
    } else {
      console.log("Created default quiz response");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "User quiz status and subscription updated",
        user_id: userId,
        email: userEmail
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in mark-quiz-completed:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
