
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

    // Create a subscription in the database
    try {
      // First, let's create a pending subscription
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase configuration");
      }
      
      // Check for existing pending subscription first
      const checkResponse = await fetch(`${supabaseUrl}/rest/v1/pending_subscriptions?email=eq.${encodeURIComponent(email)}&consumed=eq.false`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        }
      });
      
      const existingSubscriptions = await checkResponse.json();
      
      if (existingSubscriptions && existingSubscriptions.length > 0) {
        // Update existing subscription
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/pending_subscriptions?id=eq.${existingSubscriptions[0].id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            subscription_type: subscriptionType || 'basic',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            consumed: false,
            square_order_id: squareOrderId || `square-${Date.now()}`
          })
        });
        
        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          console.error("Error updating pending subscription:", errorText);
          throw new Error(`Failed to update subscription: ${errorText}`);
        }
        
        console.log("Successfully updated pending subscription");
      } else {
        // Create new pending subscription
        const createResponse = await fetch(`${supabaseUrl}/rest/v1/pending_subscriptions`, {
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
        
        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error("Error creating pending subscription:", errorText);
          throw new Error(`Failed to create subscription: ${errorText}`);
        }
        
        console.log("Successfully created pending subscription");
      }
    } catch (error) {
      console.error("Error managing subscription:", error);
      // Continue anyway - we'll still try to generate the verification link
    }

    // Generate a user link (either login or signup depending on if they exist)
    try {
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
      const isExistingUser = verificationData?.meta?.userExists || false;

      console.log(`Generated ${isExistingUser ? 'login' : 'signup'} link for Square integration`);
      
      if (!verificationLink) {
        throw new Error("Failed to generate link");
      }

      return new Response(JSON.stringify({
        success: true,
        message: isExistingUser 
          ? "Login link created for existing user" 
          : "Signup link created for new user",
        verificationLink: verificationLink,
        isExistingUser: isExistingUser,
        instructions: "Add this link to your Square emails or marketing messages"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      throw new Error(`Link generation failed: ${error.message}`);
    }
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
