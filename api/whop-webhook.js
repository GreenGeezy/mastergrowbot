import { createHmac } from "crypto";

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!webhookSecret || !resendApiKey) {
    console.error("Missing required environment variables");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  // Verify Whop webhook signature
  const signature = req.headers["x-whop-signature"] || "";
  const timestamp = req.headers["x-whop-timestamp"] || "";
  const payload = JSON.stringify(req.body);

  try {
    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = createHmac("sha256", webhookSecret)
      .update(signedPayload)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return res.status(401).json({ error: "Invalid signature" });
    }
  } catch (err) {
    console.error("Signature verification error:", err);
    return res.status(401).json({ error: "Signature verification failed" });
  }

  // Strictly filter for payment.succeeded events
  const eventType = req.body?.event;
  if (eventType !== "payment.succeeded") {
    console.log(`Ignoring event: ${eventType}`);
    return res.status(200).json({ received: true, ignored: true });
  }

  // Extract customer info from Whop payload
  const customerEmail = req.body?.data?.customer?.email;
  const customerName = req.body?.data?.customer?.name || "Grower";
  const planId = req.body?.data?.plan?.id || req.body?.data?.product?.id || "unknown";

  console.log("Payment succeeded:", {
    planId,
    customerEmail,
    customerName,
    timestamp: new Date().toISOString(),
  });

  if (!customerEmail) {
    console.error("No customer email found in payload");
    return res.status(400).json({ error: "Missing customer email" });
  }

  // Build email content
  const subject = "Access Granted: Your Master IPM Playbook for Elite Growers!";

  const textBody = `Hey ${customerName},

You now have the definitive resource for mitigating risk and optimizing your harvest. The Master Cannabis IPM Playbook is designed to move you from reactive troubleshooting to proactive cultivation mastery.

DOWNLOAD HERE: https://drive.google.com/file/d/1kFtY7BYbl3Gn9mE5ve0_Gt_mrNoZFQwS/view?usp=sharing

To get the most out of your purchase, ensure you have the MasterGrowbot AI mobile app installed. Use the links below to sync your diagnostics with the playbook strategies in real time.

iOS: https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060
Android: https://play.google.com/store/apps/details?id=com.mastergrowbot.app

Welcome to the inner circle of high performance cultivation.

Best,
Smart Ag AI`;

  const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hey ${customerName},</p>

  <p>You now have the definitive resource for mitigating risk and optimizing your harvest. The Master Cannabis IPM Playbook is designed to move you from reactive troubleshooting to proactive cultivation mastery.</p>

  <p style="text-align: center; margin: 30px 0;">
    <a href="https://drive.google.com/file/d/1kFtY7BYbl3Gn9mE5ve0_Gt_mrNoZFQwS/view?usp=sharing" 
       style="display: inline-block; background-color: #22c55e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
      DOWNLOAD YOUR PLAYBOOK
    </a>
  </p>

  <p>To get the most out of your purchase, ensure you have the MasterGrowbot AI mobile app installed. Use the links below to sync your diagnostics with the playbook strategies in real time.</p>

  <p style="text-align: center; margin: 20px 0;">
    <a href="https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060" 
       style="display: inline-block; background-color: #000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 5px; font-size: 14px;">
      Download for iOS
    </a>
    <a href="https://play.google.com/store/apps/details?id=com.mastergrowbot.app" 
       style="display: inline-block; background-color: #000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 5px; font-size: 14px;">
      Download for Android
    </a>
  </p>

  <p>Welcome to the inner circle of high performance cultivation.</p>

  <p>Best,<br>Smart Ag AI</p>
</body>
</html>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Smart Ag AI <support@mastergrowbot.com>",
        to: [customerEmail],
        subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", result);
      return res.status(500).json({
        error: "Failed to send email",
        details: result,
      });
    }

    console.log("Email sent successfully:", {
      id: result.id,
      to: customerEmail,
      planId,
    });

    return res.status(200).json({
      received: true,
      emailSent: true,
      emailId: result.id,
      planId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      error: "Failed to send email",
      message: error.message,
    });
  }
}
