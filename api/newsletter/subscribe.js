import {
  buildContactPayload,
  createNewsletterContact,
  emailPattern,
  isGoogleLeadWebhookConfigured,
  isNewsletterConfigured,
  newsletterTitle,
  normalizeEmail,
  sendLeadToGoogleWebhook,
  sendOwnerNotification,
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

  if (!isGoogleLeadWebhookConfigured() && !isNewsletterConfigured()) {
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
    const googleLead = await sendLeadToGoogleWebhook(lead).catch((error) => {
      console.error("Google lead webhook failed:", {
        message: error.message,
        status: error.status,
        data: error.data,
      });
      return null;
    });

    let contact = null;

    if (isNewsletterConfigured()) {
      contact = await createNewsletterContact(buildContactPayload(lead));

      await sendOwnerNotification({
        email,
        sourcePage,
        sourceForm,
        interestProduct,
      }).catch((error) => {
        console.error("Newsletter owner notification failed:", error.message);
      });
    }

    if (!googleLead && !contact) {
      throw new Error("Lead storage is not configured.");
    }

    return res.status(200).json({
      ok: true,
      googleLeadSaved: Boolean(googleLead),
      contactId: contact?.id || contact?.data?.id || null,
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
