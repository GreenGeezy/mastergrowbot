
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.5';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// We need to make sure we're using the API key properly
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
if (!RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY environment variable");
}

const resend = new Resend(RESEND_API_KEY);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to send-subscription-email");
    
    const { email, subscriptionType } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }
    
    console.log(`Sending subscription confirmation email to ${email} for ${subscriptionType} subscription`);

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured. Please add it to your Supabase secrets.");
    }

    const { data, error } = await resend.emails.send({
      from: 'Master Growbot <support@mastergrowbot.com>',
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
      console.error("Error from Resend:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully", data }), {
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
