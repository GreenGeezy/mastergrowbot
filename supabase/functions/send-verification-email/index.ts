
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log("==== Email Verification Function Started ====");
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { email, testMode = false } = await req.json();
    
    if (!email) {
      throw new Error('Email is required');
    }

    // Always create a test pending subscription in testMode
    if (testMode) {
      console.log("Creating test pending subscription for:", email);
      
      const { data: existingSubs } = await supabaseClient
        .from('pending_subscriptions')
        .select('id')
        .eq('email', email)
        .eq('consumed', false);
        
      if (!existingSubs?.length) {
        const { error: insertError } = await supabaseClient
          .from('pending_subscriptions')
          .insert({
            email: email,
            subscription_type: 'basic',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            consumed: false,
            square_order_id: 'test-' + Math.random().toString(36).substring(2, 10)
          });
          
        if (insertError) throw insertError;
      }
    }

    // Check if user exists
    const { data: { users }, error: userError } = await supabaseClient.auth.admin.listUsers();
    const userExists = users.some(user => user.email === email);
    
    // Generate appropriate link
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: userExists ? 'magiclink' : 'signup',
      email: email,
      options: {
        redirectTo: `${req.headers.get('origin')}/auth/callback`,
      },
    });

    if (error) throw error;

    console.log(`${userExists ? 'Magic' : 'Signup'} link generated successfully`);

    return new Response(JSON.stringify({
      data,
      type: userExists ? 'magiclink' : 'signup',
      message: `${userExists ? 'Magic' : 'Signup'} link generated successfully`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Function error:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
