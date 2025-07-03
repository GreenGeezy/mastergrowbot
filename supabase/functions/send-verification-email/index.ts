import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://deno.land/x/supabase@1.0.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log("==== Email Verification Function Started ====");
  console.log(`Request method: ${req.method}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    let body;
    try {
      body = await req.json();
      console.log("Request body parsed successfully");
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      throw new Error("Invalid request format: " + parseError.message);
    }
    
    const { email, testMode = false, createTestSubscription = false } = body;
    console.log("Function parameters:", { 
      email: email ? `${email.substring(0, 3)}...` : "not provided",
      testMode,
      createTestSubscription
    });

    if (!email) {
      console.error("Email is required but was not provided");
      throw new Error('Email is required');
    }

    // If createTestSubscription is true, create a test pending subscription
    if (createTestSubscription) {
      console.log("Creating test pending subscription for email:", email);
      
      try {
        // First, check if there's already a pending subscription
        const { data: existingSubscriptions } = await supabaseClient
          .from('pending_subscriptions')
          .select('id')
          .eq('email', email)
          .eq('consumed', false);
          
        if (existingSubscriptions && existingSubscriptions.length > 0) {
          console.log("Existing pending subscription found, updating instead of creating new");
          
          // Update the existing subscription
          const { data: updatedSub, error: updateError } = await supabaseClient
            .from('pending_subscriptions')
            .update({
              subscription_type: 'basic',
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
              consumed: false,
              square_order_id: 'test-' + Math.random().toString(36).substring(2, 10)
            })
            .eq('email', email)
            .eq('consumed', false)
            .select();
            
          if (updateError) {
            console.error("Error updating existing pending subscription:", updateError);
            throw updateError;
          }
          
          console.log("Successfully updated pending subscription:", updatedSub);
        } else {
          // Create a new test pending subscription
          const { data: newSub, error: insertError } = await supabaseClient
            .from('pending_subscriptions')
            .insert({
              email: email,
              subscription_type: 'basic',
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
              consumed: false,
              square_order_id: 'test-' + Math.random().toString(36).substring(2, 10)
            })
            .select();
            
          if (insertError) {
            console.error("Error creating test pending subscription:", insertError);
            throw insertError;
          }
          
          console.log("Successfully created test pending subscription:", newSub);
        }
      } catch (subError) {
        console.error("Subscription creation/update error:", subError);
        throw new Error(`Failed to create test subscription: ${subError.message}`);
      }
    }

    // If in test mode or createTestSubscription is true, always generate a signup link
    if (testMode || createTestSubscription) {
      console.log(`Generating test verification link for ${testMode ? 'test mode' : 'test subscription'}`);
      const { data, error } = await supabaseClient.auth.admin.generateLink({
        type: 'signup',
        email: email,
        options: {
          redirectTo: `${req.headers.get('origin')}/auth/callback`,
        },
      });

      if (error) {
        console.error("Test mode link generation error:", error);
        throw error;
      }

      console.log("Test verification link generated successfully");
      console.log("Link URL available:", !!data?.properties?.action_link);
      
      return new Response(JSON.stringify({ 
        data,
        meta: {
          timestamp: new Date().toISOString(),
          origin: req.headers.get('origin'),
          type: testMode ? 'test-signup' : 'test-subscription-signup',
          verificationLink: data?.properties?.action_link
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Existing logic for non-test mode remains the same
    console.log("Checking if user already exists...");
    const { data: existingUser, error: userCheckError } = await supabaseClient.auth.admin.listUsers();
    
    if (userCheckError) {
      console.error("Error checking existing users:", userCheckError);
    } else {
      const userExists = existingUser.users.some(user => user.email === email);
      console.log("User exists check result:", userExists);
      
      if (userExists) {
        console.log("User already exists, sending magic link instead of signup link");
        const { data: magicLinkData, error: magicLinkError } = await supabaseClient.auth.admin.generateLink({
          type: 'magiclink',
          email: email,
          options: {
            redirectTo: `${req.headers.get('origin')}/auth/callback`,
          },
        });
        
        if (magicLinkError) {
          console.error("Magic link generation error:", magicLinkError);
          throw magicLinkError;
        }
        
        console.log("Magic link generated successfully");
        return new Response(JSON.stringify({ data: magicLinkData, type: 'magiclink' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    }

    // Generate signup link
    console.log("Generating signup link...");
    console.log("Redirect URL:", `${req.headers.get('origin')}/auth/callback`);
    
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: 'signup',
      email: email,
      options: {
        redirectTo: `${req.headers.get('origin')}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error generating signup link:", error);
      throw error;
    }

    console.log("Signup link generated successfully");
    console.log("Action URL available:", !!data?.properties?.action_link);

    // Include detailed information in response for debugging
    return new Response(JSON.stringify({ 
      data,
      meta: {
        timestamp: new Date().toISOString(),
        origin: req.headers.get('origin'),
        type: 'signup'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Function error:", error);
    console.error("Stack trace:", error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } finally {
    console.log("==== Email Verification Function Completed ====");
  }
})
