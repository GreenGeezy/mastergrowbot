
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // Parse the webhook payload
    const payload = await req.json();
    console.log("Received Square webhook payload:", payload);

    // Extract order information
    const orderId = payload.data?.object?.order_id;
    const customerEmail = payload.data?.object?.customer?.email_address;
    const orderTotal = payload.data?.object?.total_money?.amount;

    if (!orderId || !customerEmail) {
      console.error("Missing required fields in webhook payload");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Determine subscription type based on order amount
    // Assuming annual is anything over $100 (10000 cents)
    const subscriptionType = (orderTotal && orderTotal >= 10000) ? 'annual' : 'monthly';

    // Call the database function to handle the payment
    const { data, error } = await supabaseClient.rpc('handle_square_payment', {
      order_id: orderId,
      customer_email: customerEmail,
      subscription_type: subscriptionType,
    });

    if (error) {
      console.error("Error handling Square payment:", error);
      throw error;
    }

    console.log("Successfully processed Square payment for:", customerEmail);
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Error in square-webhook function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
