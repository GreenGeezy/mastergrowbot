// Supabase Edge Function: update-streak
// Updates the authenticated user's Bud Boost Run streak based on "today" vs last_action
// Notes:
// - This function is optional; database triggers already auto-update streaks.
// - Useful for manual/backfill calls or future workflows.
// - Requires Authorization header (verify_jwt = true).

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to get UTC-start-of-day for correct day-diff logic across timezones
function startOfUtcDate(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase env vars");
      return new Response(
        JSON.stringify({ error: "Server not configured: missing SUPABASE env vars" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

    // Identify user from JWT
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      console.warn("Auth failed or user missing", userErr);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    // Fetch current streak row
    const { data: streak, error: streakErr } = await supabase
      .from("user_streaks")
      .select("current_streak, last_action, grace_days")
      .eq("user_id", userId)
      .maybeSingle();

    const today = startOfUtcDate(new Date());

    if (streakErr) {
      console.error("Error fetching streak", streakErr);
      return new Response(JSON.stringify({ error: "Failed to fetch streak" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!streak) {
      // No row exists → insert with current_streak = 1 and last_action = today
      const { error: insertErr } = await supabase.from("user_streaks").insert({
        user_id: userId,
        current_streak: 1,
        last_action: today.toISOString().slice(0, 10), // store as date
      });

      if (insertErr) {
        console.error("Error inserting new streak row", insertErr);
        return new Response(JSON.stringify({ error: "Failed to initialize streak" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ current_streak: 1, last_action: today.toISOString().slice(0, 10) }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Row exists → compute day difference
    const lastAction = startOfUtcDate(new Date(streak.last_action));
    const dayDiff = Math.floor((today.getTime() - lastAction.getTime()) / 86_400_000);

    let nextStreak = streak.current_streak;
    if (dayDiff === 1) {
      nextStreak = nextStreak + 1;
    } else if (dayDiff > 2) {
      nextStreak = 1;
    }

    const { error: updateErr } = await supabase
      .from("user_streaks")
      .update({
        current_streak: nextStreak,
        last_action: today.toISOString().slice(0, 10),
      })
      .eq("user_id", userId);

    if (updateErr) {
      console.error("Error updating streak", updateErr);
      return new Response(JSON.stringify({ error: "Failed to update streak" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ current_streak: nextStreak, last_action: today.toISOString().slice(0, 10) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Unhandled error in update-streak", e);
    return new Response(JSON.stringify({ error: "Unhandled error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
