
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

    // If only email is provided, look up the user_id
    if (!userId && email) {
      const { data: userData, error: userError } = await supabaseClient
        .from("user_profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (userError) {
        // If user profile doesn't exist, lookup in auth.users
        const { data: authUser, error: authError } = await supabaseClient.auth.admin.getUserByEmail(email);
        
        if (authError || !authUser) {
          return new Response(
            JSON.stringify({ error: "User not found" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 404,
            }
          );
        }
        
        userId = authUser.user.id;
      } else {
        userId = userData.id;
      }
    }

    // Update user profile to mark quiz as completed
    const { error: updateError } = await supabaseClient
      .from("user_profiles")
      .upsert({
        id: userId,
        has_completed_quiz: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (updateError) {
      throw updateError;
    }

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
    }

    return new Response(
      JSON.stringify({ success: true, message: "User quiz status updated" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error marking quiz as completed:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
