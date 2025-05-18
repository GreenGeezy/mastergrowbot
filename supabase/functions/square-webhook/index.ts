
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Force fresh deployment with latest SQUARE_WEBHOOK_SIGNATURE_KEY secret value
console.log('Square webhook function starting - FORCED FRESH DEPLOYMENT v5 - ' + new Date().toISOString());

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This secret is now set in the Edge Function settings
const SQUARE_WEBHOOK_SIGNATURE_KEY = Deno.env.get("SQUARE_WEBHOOK_SIGNATURE_KEY") || "";
console.log("Signature key loaded:", SQUARE_WEBHOOK_SIGNATURE_KEY ? "YES - key available" : "NO - key missing!");

// Default subscription durations in days
const SUBSCRIPTION_DURATIONS = {
  weekly: 7,
  monthly: 30,
  quarterly: 90,
  annual: 365,
  basic: 30, // Default to 30 days for "basic" plan
};

serve(async (req) => {
  console.log("Square webhook received request - " + new Date().toISOString());
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the Square-Signature header
    const squareSignature = req.headers.get("Square-Signature") || "";
    
    // Parse the request body
    const body = await req.text();
    
    // Log raw signature and request body (for debugging)
    console.log("Received Square webhook signature:", squareSignature);
    console.log("Received Square webhook body length:", body.length);
    console.log("Signature key available:", !!SQUARE_WEBHOOK_SIGNATURE_KEY);
    
    let eventData;
    try {
      eventData = JSON.parse(body);
      console.log("Received Square webhook event type:", eventData.type);
      console.log("Webhook payload sample:", JSON.stringify(eventData).substring(0, 200) + "...");
    } catch (error) {
      console.error("Failed to parse webhook JSON:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON payload" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Verify signature if signature key is provided
    if (SQUARE_WEBHOOK_SIGNATURE_KEY) {
      const signatureValid = await verifySquareSignature(body, squareSignature, SQUARE_WEBHOOK_SIGNATURE_KEY);
      if (!signatureValid) {
        console.error("Invalid Square webhook signature");
        return new Response(
          JSON.stringify({ success: false, error: "Invalid signature" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
        );
      } else {
        console.log("Square webhook signature verified successfully");
      }
    } else {
      console.warn("Square webhook signature verification skipped - no signature key provided");
    }
    
    // Process different event types from Square
    if (eventData.type === "payment.updated") {
      return await handlePaymentUpdated(eventData, supabase, corsHeaders);
    } else if (eventData.type === "invoice.payment_made" || eventData.type === "invoice.paid") {
      return await handleInvoicePaid(eventData, supabase, corsHeaders);
    } else if (eventData.type === "subscription.updated" || eventData.type === "subscription.created") {
      return await handleSubscriptionEvent(eventData, supabase, corsHeaders);
    } else if (eventData.type === "order.fulfilled" || eventData.type === "order.updated") {
      return await handleOrderEvent(eventData, supabase, corsHeaders);
    } else {
      // Log unhandled event types
      console.log(`Unhandled Square event type: ${eventData.type}`);
      return new Response(
        JSON.stringify({ success: true, message: "Event received but not processed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing Square webhook:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Helper function to verify Square webhook signature using HMAC
async function verifySquareSignature(payload: string, signature: string, signingKey: string): Promise<boolean> {
  try {
    console.log("Starting signature verification process");
    
    // Check if signature exists and has the correct format
    if (!signature || signature.trim() === "") {
      console.error("Empty signature");
      return false;
    }
    
    // Square's signature format is t=timestamp,v1=signature
    // Parse the signature components
    if (!signature.includes(',') || !signature.includes('=')) {
      console.error("Invalid signature format - missing expected delimiters");
      return false;
    }
    
    const signatureParts = signature.split(',');
    if (signatureParts.length < 2) {
      console.error("Invalid signature format - not enough parts");
      return false;
    }
    
    // Extract timestamp and actual signature
    const timestampPart = signatureParts[0]; // t=1234567890
    const signaturePart = signatureParts[1]; // v1=actual_signature
    
    if (!timestampPart.startsWith('t=') || !signaturePart.startsWith('v1=')) {
      console.error("Invalid signature format - missing expected components");
      return false;
    }
    
    const timestamp = timestampPart.substring(2);
    const actualSignature = signaturePart.substring(3);
    
    console.log("Signature parts extracted:", {
      timestamp: timestamp,
      signatureLength: actualSignature.length
    });
    
    // Create the string to sign (timestamp + . + payload)
    const stringToSign = `${timestamp}.${payload}`;
    
    // Compute the expected signature using Web Crypto API
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(signingKey),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(stringToSign)
    );
    
    // Convert to hex string for comparison
    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log("Signature verification comparison:", {
      actualSignatureLength: actualSignature.length,
      expectedSignatureLength: expectedSignature.length,
      actualSignaturePrefix: actualSignature.substring(0, 6) + "...",
      expectedSignaturePrefix: expectedSignature.substring(0, 6) + "..." // Log just a prefix for security
    });
    
    const isValid = expectedSignature === actualSignature;
    console.log("Signature verification result:", isValid ? "VALID" : "INVALID");
    
    return isValid;
  } catch (e) {
    console.error("Error verifying signature:", e);
    return false;
  }
}

// Helper function to determine subscription type from Square data
function determineSubscriptionType(eventData: any): string {
  // Extract subscription type from Square data
  // This logic will depend on how your Square products are set up
  
  // Try to get subscription type from various possible locations in the payload
  // Check order details if available
  if (eventData.data?.object?.order?.line_items) {
    const lineItems = eventData.data.object.order.line_items;
    for (const item of lineItems) {
      const name = item.name?.toLowerCase() || "";
      if (name.includes("annual") || name.includes("yearly")) return "annual";
      if (name.includes("quarterly") || name.includes("3 month")) return "quarterly";
      if (name.includes("monthly")) return "monthly";
      if (name.includes("weekly")) return "weekly";
    }
  }
  
  // Check subscription plan if available
  if (eventData.data?.object?.subscription?.plan_id) {
    const planId = eventData.data.object.subscription.plan_id;
    if (planId.includes("annual")) return "annual";
    if (planId.includes("quarter")) return "quarterly";
    if (planId.includes("month")) return "monthly";
    if (planId.includes("week")) return "weekly";
  }
  
  // Check subscription cadence if available
  if (eventData.data?.object?.subscription?.cadence) {
    const cadence = eventData.data.object.subscription.cadence.toLowerCase();
    if (cadence.includes("annual")) return "annual";
    if (cadence.includes("quarterly")) return "quarterly";
    if (cadence.includes("month")) return "monthly";
    if (cadence.includes("week")) return "weekly";
  }
  
  // Check invoice items if available
  if (eventData.data?.object?.invoice?.line_items) {
    const lineItems = eventData.data.object.invoice.line_items;
    for (const item of lineItems) {
      const description = item.description?.toLowerCase() || "";
      if (description.includes("annual") || description.includes("yearly")) return "annual";
      if (description.includes("quarterly") || description.includes("3 month")) return "quarterly";
      if (description.includes("monthly")) return "monthly";
      if (description.includes("weekly")) return "weekly";
    }
  }
  
  // Default to basic if type couldn't be determined
  return "basic";
}

// Helper function to extract customer email from Square data
function extractCustomerEmail(eventData: any): string | null {
  // Try to extract email from different possible locations in the payload
  
  // Check customer object if available
  if (eventData.data?.object?.customer?.email_address) {
    return eventData.data.object.customer.email_address;
  }
  
  // Check order fulfillment recipients if available
  if (eventData.data?.object?.order?.fulfillments) {
    for (const fulfillment of eventData.data.object.order.fulfillments) {
      if (fulfillment.recipient?.email_address) {
        return fulfillment.recipient.email_address;
      }
    }
  }
  
  // Check invoice recipient if available
  if (eventData.data?.object?.invoice?.primary_recipient?.email_address) {
    return eventData.data.object.invoice.primary_recipient.email_address;
  }
  
  // Check subscription customer if available
  if (eventData.data?.object?.subscription?.customer_id) {
    // Note: This would require an additional API call to Square to get the customer's email
    console.log("Customer ID found but email not available in webhook payload:", 
                eventData.data.object.subscription.customer_id);
  }
  
  // No email found
  console.log("Could not extract customer email from webhook data");
  return null;
}

// Helper function to calculate expiry date based on subscription type
function calculateExpiryDate(subscriptionType: string): Date {
  const daysToAdd = SUBSCRIPTION_DURATIONS[subscriptionType] || SUBSCRIPTION_DURATIONS.basic;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysToAdd);
  return expiryDate;
}

// Handler for payment.updated events
async function handlePaymentUpdated(eventData: any, supabase: any, corsHeaders: any) {
  // Only process completed payments
  if (eventData.data?.object?.payment?.status !== "COMPLETED") {
    console.log("Payment not completed, skipping");
    return new Response(
      JSON.stringify({ success: true, message: "Payment not completed, no action taken" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }
  
  const customerEmail = extractCustomerEmail(eventData);
  if (!customerEmail) {
    return new Response(
      JSON.stringify({ success: false, error: "Customer email not found in payment data" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
  
  const subscriptionType = determineSubscriptionType(eventData);
  const expiryDate = calculateExpiryDate(subscriptionType);
  const orderId = eventData.data?.object?.payment?.order_id || 
                  eventData.data?.object?.payment?.id || 
                  "unknown_order";
  
  // Create or update pending subscription
  return await createPendingSubscription(
    customerEmail, 
    subscriptionType, 
    expiryDate, 
    orderId, 
    supabase, 
    corsHeaders
  );
}

// Handler for invoice.paid events
async function handleInvoicePaid(eventData: any, supabase: any, corsHeaders: any) {
  const customerEmail = extractCustomerEmail(eventData);
  if (!customerEmail) {
    return new Response(
      JSON.stringify({ success: false, error: "Customer email not found in invoice data" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
  
  const subscriptionType = determineSubscriptionType(eventData);
  const expiryDate = calculateExpiryDate(subscriptionType);
  const orderId = eventData.data?.object?.invoice?.id || 
                  eventData.data?.id || 
                  "unknown_invoice";
  
  // Create or update pending subscription
  return await createPendingSubscription(
    customerEmail, 
    subscriptionType, 
    expiryDate, 
    orderId, 
    supabase, 
    corsHeaders
  );
}

// Handler for subscription.updated and subscription.created events
async function handleSubscriptionEvent(eventData: any, supabase: any, corsHeaders: any) {
  // Only process active subscriptions
  if (eventData.data?.object?.subscription?.status !== "ACTIVE") {
    console.log("Subscription not active, skipping");
    return new Response(
      JSON.stringify({ success: true, message: "Subscription not active, no action taken" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }
  
  const customerEmail = extractCustomerEmail(eventData);
  if (!customerEmail) {
    return new Response(
      JSON.stringify({ success: false, error: "Customer email not found in subscription data" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
  
  const subscriptionType = determineSubscriptionType(eventData);
  
  // For subscriptions, we'll use a far future expiry date since Square handles billing
  const farFutureDate = new Date('9999-12-31');
  
  const orderId = eventData.data?.object?.subscription?.id || 
                  eventData.data?.id || 
                  "unknown_subscription";
  
  // Create or update pending subscription
  return await createPendingSubscription(
    customerEmail, 
    subscriptionType, 
    farFutureDate,  // Use far future date for subscriptions
    orderId, 
    supabase, 
    corsHeaders
  );
}

// Handler for order.fulfilled and order.updated events
async function handleOrderEvent(eventData: any, supabase: any, corsHeaders: any) {
  const customerEmail = extractCustomerEmail(eventData);
  if (!customerEmail) {
    return new Response(
      JSON.stringify({ success: false, error: "Customer email not found in order data" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
  
  const subscriptionType = determineSubscriptionType(eventData);
  const expiryDate = calculateExpiryDate(subscriptionType);
  const orderId = eventData.data?.object?.order?.id || 
                  eventData.data?.id || 
                  "unknown_order";
  
  // Create or update pending subscription
  return await createPendingSubscription(
    customerEmail, 
    subscriptionType, 
    expiryDate, 
    orderId, 
    supabase, 
    corsHeaders
  );
}

// Create or update a pending subscription record
async function createPendingSubscription(
  email: string, 
  subscriptionType: string, 
  expiryDate: Date,
  orderId: string,
  supabase: any,
  corsHeaders: any
) {
  console.log("Creating pending subscription:", {
    email,
    subscriptionType,
    expiryDate: expiryDate.toISOString(),
    orderId
  });
  
  // Create or update a pending subscription record
  const { data, error } = await supabase
    .from("pending_subscriptions")
    .upsert({
      email: email,
      subscription_type: subscriptionType,
      square_order_id: orderId,
      consumed: false,
      expires_at: expiryDate.toISOString()
    }, { onConflict: "email" });
  
  if (error) {
    console.error("Error creating pending subscription:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to create pending subscription" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
  
  console.log("Pending subscription created/updated successfully");
  
  // Try to mark the user's quiz as completed if they already exist
  try {
    // Call the SQL function that marks the user as having completed the quiz
    // This function will handle finding the user by email and updating their profile
    const { error: markQuizError } = await supabase.rpc('mark_user_completed_quiz', { 
      user_email: email 
    });
    
    if (markQuizError) {
      // If the function fails (likely because the user doesn't exist yet), just log it
      // This is not a critical error as the user will complete the quiz when they sign up
      console.log("User not found to mark quiz as completed (they may not have signed up yet):", markQuizError);
    } else {
      console.log("User found and quiz marked as completed");
    }
  } catch (err) {
    console.error("Error trying to mark user's quiz as completed:", err);
    // This is not a critical error, so continue processing
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: "Pending subscription created successfully",
      email,
      subscriptionType,
      expiryDate: expiryDate.toISOString()
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
  );
}
