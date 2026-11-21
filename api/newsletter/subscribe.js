import { requestConfirmation } from "../../api-lib/confirmation.js";
import {


  emailPattern,
  isFormspreeLeadBackupConfigured,
  isGoogleLeadWebhookConfigured,
  isNewsletterConfigured,
  newsletterTitle,
  normalizeEmail,
  sendLeadToFormspree,
  sendLeadToGoogleWebhook,

} from "../../api-lib/newsletter.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const email = normalizeEmail(body.email);

  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  const sourcePage = body.sourcePage || req.headers.referer || "/";
  const sourceForm = body.sourceForm || "newsletter";
  const interestProduct = body.interestProduct || body.productName || newsletterTitle;
  const lead = {
    email,
    name: body.name || "",
    createdAt: new Date().toISOString(),
    sourcePage,
    sourceForm,
    interestProduct,
    userAgent: req.headers["user-agent"] || "",
    utm: {
      utm_source: body.utm_source || body.utm?.utm_source || "",
      utm_medium: body.utm_medium || body.utm?.utm_medium || "",
      utm_campaign: body.utm_campaign || body.utm?.utm_campaign || "",
      utm_content: body.utm_content || body.utm?.utm_content || "",
    },
  };

  if (!isFormspreeLeadBackupConfigured() && !isGoogleLeadWebhookConfigured() && !isNewsletterConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("Newsletter setup required. Lead accepted locally:", {
        ...lead,
      });
    }

    return res.status(200).json({
      ok: true,
      setupRequired: true,
      message: "Newsletter setup required. Lead accepted.",
    });
  }

  try {
    const formspreeLead = await sendLeadToFormspree(lead).catch((error) => {
      console.error("Formspree lead backup failed:", {
        message: error.message,
        status: error.status,
        data: error.data,
      });
      return null;
    });

    const googleLead = await sendLeadToGoogleWebhook(lead).catch((error) => {
      console.error("Google lead webhook failed:", {
        message: error.message,
        status: error.status,
        data: error.data,
      });
      return null;
    });

    if (!formspreeLead && !googleLead) {
      throw new Error("Could not record signup consent.");
    }

    const newsletterForm = ["newsletter", "newsletter_page", "homepage_newsletter"].includes(sourceForm);
    let confirmationSent = false;
    if (newsletterForm && process.env.RESEND_API_KEY) {
      try {
        await requestConfirmation(email);
        confirmationSent = true;
      } catch (error) {
        console.error("Confirmation delivery failed", error.status, error.message);
      }
    }
    return res.status(200).json({
      ok: true,
      formspreeSaved: Boolean(formspreeLead),
      googleLeadSaved: Boolean(googleLead),
      confirmationSent,
    });
  } catch (error) {
    console.error("Newsletter subscribe failed:", {
      message: error.message,
      status: error.status,
      data: error.data,
    });

    return res.status(500).json({
      error: "We could not add this email right now. Please try again.",
    });
  }
}
