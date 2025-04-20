
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

    // Instead of trying to send an email directly, we'll return the verification link
    // that can be included in Square emails or used elsewhere
    
    // Generate signup verification link via another edge function
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
          testMode: true, // This makes it return the link instead of sending an email
          createTestSubscription: true // This creates a subscription record
        })
      }
    );

    if (!verificationResponse.ok) {
      const errorText = await verificationResponse.text();
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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
