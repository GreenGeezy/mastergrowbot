
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to send-subscription-email");
    
    const { email, subscriptionType, squareOrderId } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }
    
    console.log(`Processing subscription for ${email} (${subscriptionType}) with order ID: ${squareOrderId || 'N/A'}`);

    // Create a test subscription in the database
    try {
      // First, let's create a pending subscription directly
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase configuration");
      }
      
      // Create the pending subscription
      const response = await fetch(`${supabaseUrl}/rest/v1/pending_subscriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          email: email,
          subscription_type: subscriptionType || 'basic',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          consumed: false,
          square_order_id: squareOrderId || `square-${Date.now()}`
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error creating pending subscription:", errorText);
        throw new Error(`Failed to create subscription: ${errorText}`);
      }
      
      console.log("Successfully created pending subscription");
    } catch (error) {
      console.error("Error creating subscription:", error);
      // Continue anyway - we'll still try to generate the verification link
    }

    // Generate verification link that can be included in Square emails
    const verificationResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-verification-email`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          testMode: true // This makes it return the link instead of sending an email
        })
      }
    );

    if (!verificationResponse.ok) {
      const errorText = await verificationResponse.text();
      console.error("Error generating verification link:", errorText);
      throw new Error(`Failed to generate verification link: ${errorText}`);
    }

    const verificationData = await verificationResponse.json();
    const verificationLink = verificationData?.data?.properties?.action_link || null;

    console.log("Generated verification link for Square integration");
    
    if (!verificationLink) {
      throw new Error("Failed to generate verification link");
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Subscription created and ready for verification",
      verificationLink: verificationLink,
      instructions: "Add this verification link to your Square emails or marketing messages"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing subscription:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Return 200 even for errors to avoid issues with the frontend
    });
  }
});
