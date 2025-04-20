
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
    
    const { email, subscriptionType } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }
    
    console.log(`Sending subscription confirmation email to ${email} for ${subscriptionType} subscription`);

    const client = new SmtpClient();

    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: "support@mastergrowbot.com",
      password: Deno.env.get('SMTP_PASSWORD'),
    });

    const html = `
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
    `;

    await client.send({
      from: "Master Growbot <support@mastergrowbot.com>",
      to: email,
      subject: "Welcome to Master Growbot! Your Subscription is Active",
      content: "Your subscription is now active!",
      html: html,
    });

    await client.close();

    console.log("Email sent successfully to:", email);

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
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
