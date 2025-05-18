import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Force fresh deployment with latest SQUARE_WEBHOOK_SIGNATURE_KEY secret value
console.log('Square webhook function starting - FORCED FRESH DEPLOYMENT v12 - ' + new Date().toISOString());

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This secret is now set in the Edge Function settings
const SQUARE_WEBHOOK_SIGNATURE_KEY = Deno.env.get("SQUARE_WEBHOOK_SIGNATURE_KEY") || "";
console.log("Signature key loaded:", SQUARE_WEBHOOK_SIGNATURE_KEY ? "YES - key available" : "NO - key missing!");

// The webhook endpoint URL for signature validation
const WEBHOOK_URL = "https://inbfxduleyhygxatxmre.supabase.co/functions/v1/square-webhook";

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
  
  // ENHANCED DEBUGGING: Log all request headers to identify what Square is actually sending
  const headersObj = Object.fromEntries(req.headers.entries());
  console.log("All request headers:", JSON.stringify(headersObj));
  
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
    
    // ENHANCED HEADER EXTRACTION: Try all possible signature header names with case variations
    let squareSignature = "";
    const possibleHeaderNames = [
      "Square-Signature", 
      "X-Square-Signature", 
      "square-signature", 
      "x-square-signature",
      // Add more variations if needed
    ];
    
    // Try to find the signature in any of the possible header names
    for (const headerName of possibleHeaderNames) {
      const value = req.headers.get(headerName);
      if (value) {
        console.log(`Found signature in header: ${headerName}`);
        squareSignature = value;
        break;
      }
    }
    
    // If still not found, try to search case-insensitively across all headers
    if (!squareSignature) {
      console.log("Signature not found in standard header names, searching all headers...");
      const headerEntries = Array.from(req.headers.entries());
      for (const [key, value] of headerEntries) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('square') && lowerKey.includes('signature')) {
          console.log(`Found signature in non-standard header: ${key}`);
          squareSignature = value;
          break;
        }
      }
    }
    
    if (!squareSignature) {
      console.error("Square webhook signature header not found in request headers");
      console.log("Available headers:", Object.keys(headersObj).join(", "));
      return new Response(
        JSON.stringify({ success: false, error: "Missing signature header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    console.log("Square signature header found:", squareSignature);
    
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
      const signatureValid = await verifySquareSignature(req.headers, body, squareSignature, SQUARE_WEBHOOK_SIGNATURE_KEY);
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

// Helper function to verify Square webhook signature using HMAC - COMPLETELY REWRITTEN
async function verifySquareSignature(headers: Headers, payload: string, signature: string, signingKey: string): Promise<boolean> {
  try {
    console.log("Starting signature verification process");
    
    // Check if signature exists and is not empty
    if (!signature || signature.trim() === "") {
      console.error("Empty signature header");
      return false;
    }
    
    console.log("Full signature header:", signature);
    
    // Extract the timestamp from the separate Square-Request-Timestamp header
    let timestamp = headers.get('Square-Request-Timestamp') || 
                   headers.get('square-request-timestamp');
                   
    if (!timestamp) {
      // Try to find timestamp in any header that might contain it
      const allHeaders = Object.fromEntries(headers.entries());
      const timestampHeaderKey = Object.keys(allHeaders).find(key => 
        key.toLowerCase().includes('square') && key.toLowerCase().includes('timestamp')
      );
      
      if (timestampHeaderKey) {
        timestamp = allHeaders[timestampHeaderKey];
        console.log(`Found timestamp in header: ${timestampHeaderKey}`);
      }
    }
    
    if (!timestamp) {
      console.warn("No Square-Request-Timestamp header found, using current time as fallback");
      timestamp = Math.floor(Date.now() / 1000).toString();
    }
    
    console.log(`Using timestamp: ${timestamp}`);
    
    // According to Square's documentation, the string to sign is: WEBHOOK_URL + REQUEST_BODY
    const stringToSign = WEBHOOK_URL + payload;
    console.log(`String to sign constructed: URL(${WEBHOOK_URL.length} chars) + BODY(${payload.length} chars) = ${stringToSign.length} total chars`);
    
    // Import the signing key as a CryptoKey
    const encoder = new TextEncoder();
    const keyData = encoder.encode(signingKey);
    console.log(`Importing signing key (${signingKey.length} chars) for HMAC-SHA256`);
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    // Compute the expected signature
    console.log("Computing HMAC-SHA256...");
    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(stringToSign)
    );
    
    // Convert the signature to lowercase hex
    const computedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log("Signature verification comparison:");
    console.log(`  Received signature length: ${signature.length}`);
    console.log(`  Computed signature length: ${computedSignature.length}`);
    console.log(`  Received signature prefix: ${signature.substring(0, 8)}...`);
    console.log(`  Computed signature prefix: ${computedSignature.substring(0, 8)}...`);
    
    // Try different comparison methods
    
    // Method 1: Direct hexadecimal comparison
    let isValid = computedSignature === signature;
    console.log(`Direct hex comparison: ${isValid ? "MATCH" : "NO MATCH"}`);
    
    // Method 2: Base64 comparison (if signature appears to be base64)
    if (!isValid && signature.match(/^[A-Za-z0-9+/=]+$/)) {
      try {
        // Decode the base64 signature to bytes
        console.log("Attempting base64 signature comparison...");
        const rawBytes = atob(signature);
        
        // Convert binary string to byte array
        const signatureArray = Uint8Array.from(rawBytes, c => c.charCodeAt(0));
        
        // Convert our computed signature from hex to bytes for comparison
        const computedArray = new Uint8Array(computedSignature.length / 2);
        for (let i = 0; i < computedSignature.length; i += 2) {
          computedArray[i/2] = parseInt(computedSignature.substring(i, i + 2), 16);
        }
        
        // Compare the byte arrays
        isValid = signatureArray.length === computedArray.length && 
                 signatureArray.every((val, i) => val === computedArray[i]);
        
        console.log(`Base64 byte comparison: ${isValid ? "MATCH" : "NO MATCH"}`);
        
        if (!isValid) {
          // Convert base64 to hex as another comparison method
          const hexFromBase64 = Array.from(signatureArray)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
            
          console.log(`  Base64 decoded to hex prefix: ${hexFromBase64.substring(0, 8)}...`);
          
          isValid = computedSignature === hexFromBase64;
          console.log(`Base64->hex comparison: ${isValid ? "MATCH" : "NO MATCH"}`);
        }
      } catch (e) {
        console.error("Failed to decode base64 signature:", e);
      }
    }
    
    // Method 3: Use Square's exact signature generation algorithm
    // This approach replicates Square's exact method for generating the signature
    if (!isValid) {
      try {
        console.log("Attempting Square's documented signature algorithm...");
        
        // Create an HMAC using the binary key
        const hmac = await crypto.subtle.sign(
          "HMAC",
          key, 
          encoder.encode(stringToSign)
        );
        
        // Convert the HMAC result to base64
        const hmacBase64 = btoa(String.fromCharCode(...new Uint8Array(hmac)));
        console.log(`  Square algorithm computed signature: ${hmacBase64.substring(0, 8)}...`);
        
        isValid = hmacBase64 === signature;
        console.log(`Square algorithm comparison: ${isValid ? "MATCH" : "NO MATCH"}`);
      } catch (e) {
        console.error("Failed Square's documented algorithm comparison:", e);
      }
    }
    
    console.log("Final signature verification result:", isValid ? "VALID" : "INVALID");
    
    if (!isValid) {
      console.log("First mismatch at position:", findFirstDifferencePosition(computedSignature, signature));
    }
    
    return isValid;
  } catch (e) {
    console.error("Error verifying signature:", e);
    return false;
  }
}

// Helper function to find the first position where two strings differ
function findFirstDifferencePosition(str1: string, str2: string): string {
  const minLength = Math.min(str1.length, str2.length);
  
  for (let i = 0; i < minLength; i++) {
    if (str1[i] !== str2[i]) {
      return `Position ${i}: '${str1[i]}' vs '${str2[i]}'`;
    }
  }
  
  if (str1.length !== str2.length) {
    return `Strings match up to position ${minLength} but have different lengths`;
  }
  
  return "Strings are identical";
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
