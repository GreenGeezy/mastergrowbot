
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.5'

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

    // SIMPLIFICATION: Check if the user already exists and always generate the appropriate link
    // (either login link for existing users or signup link for new users)
    console.log("Checking if user already exists...");
    const { data: existingUsers, error: userCheckError } = await supabaseClient.auth.admin.listUsers();
    
    let userExists = false;
    let linkType = 'signup';
    
    if (userCheckError) {
      console.error("Error checking existing users:", userCheckError);
    } else {
      userExists = existingUsers.users.some(user => user.email === email);
      console.log("User exists check result:", userExists);
      
      if (userExists) {
        linkType = 'magiclink';
      }
    }
    
    // Generate the appropriate link type (magic link for existing users, signup for new users)
    console.log(`Generating ${linkType} link...`);
    
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: linkType,
      email: email,
      options: {
        redirectTo: `${req.headers.get('origin')}/auth/callback`,
      },
    });

    if (error) {
      console.error(`Error generating ${linkType} link:`, error);
      throw error;
    }

    console.log(`${linkType} link generated successfully`);
    console.log("Action URL available:", !!data?.properties?.action_link);

    // Include detailed information in response for debugging
    return new Response(JSON.stringify({ 
      data,
      meta: {
        userExists,
        linkType,
        timestamp: new Date().toISOString(),
        origin: req.headers.get('origin'),
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  } finally {
    console.log("==== Email Verification Function Completed ====");
  }
})
