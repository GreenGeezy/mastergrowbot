
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
    // Log Supabase configuration
    console.log("Creating Supabase client with URL:", Deno.env.get('SUPABASE_URL')?.substring(0, 10) + "...");
    console.log("Service role key available:", !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Parse request body with error handling
    let body;
    try {
      body = await req.json();
      console.log("Request body parsed successfully");
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      throw new Error("Invalid request format: " + parseError.message);
    }
    
    const { email } = body;
    console.log("Email from request:", email ? `${email.substring(0, 3)}...` : "not provided");

    if (!email) {
      console.error("Email is required but was not provided");
      throw new Error('Email is required');
    }

    // Check if user already exists
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  } finally {
    console.log("==== Email Verification Function Completed ====");
  }
})
