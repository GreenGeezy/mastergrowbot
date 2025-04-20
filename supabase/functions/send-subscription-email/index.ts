
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.5';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, subscriptionType } = await req.json();
    
    console.log(`Sending subscription confirmation email to ${email}`);

    const { data, error } = await resend.emails.send({
      from: 'Master Growbot <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to Master Growbot! Your Subscription is Active',
      html: `
        <h1>Thank you for subscribing to Master Growbot!</h1>
        <p>Your ${subscriptionType} subscription is now active.</p>
        <p>You can now access all the features included in your subscription:</p>
        <ul>
          <li>AI-powered growing advice</li>
          <li>Plant health analysis</li>
          <li>Comprehensive grow guide</li>
        </ul>
        <p>Get started right away by visiting <a href="https://mastergrowbot.com/app">your dashboard</a>.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy Growing!<br>The Master Growbot Team</p>
      `,
    });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending subscription email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
