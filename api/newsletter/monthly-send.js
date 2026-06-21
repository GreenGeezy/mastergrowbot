import {
  buildNewsletterIssue,
  fetchNewsletterSignals,
  getFromEmail,
  getNotifyEmails,
  isNewsletterConfigured,
  newsletterTitle,
  resendRequest,
  shouldSendMonthlyNewsletter,
} from "../../api-lib/newsletter.js";

function getBearerToken(req) {
  const auth = String(req.headers.authorization || "");
  return auth.startsWith("Bearer ") ? auth.slice("Bearer ".length).trim() : "";
}

function isAuthorized(req) {
  const expected = process.env.NEWSLETTER_CRON_SECRET || process.env.CRON_SECRET;

  if (!expected) {
    return false;
  }

  const token = getBearerToken(req) || String(req.query?.secret || "");
  return token === expected;
}

async function listSegmentContacts(segmentId) {
  const contacts = [];
  let cursor = null;

  do {
    const query = new URLSearchParams({ limit: "100" });
    if (cursor) {
      query.set("cursor", cursor);
    }

    const response = await resendRequest(
      `/segments/${encodeURIComponent(segmentId)}/contacts?${query.toString()}`,
      { method: "GET" },
    );
    const page = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];

    contacts.push(...page);
    cursor = response?.next_cursor || response?.nextCursor || null;
  } while (cursor);

  return contacts;
}

async function broadcastExists(issueKey) {
  const response = await resendRequest("/broadcasts", { method: "GET" });
  const broadcasts = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];

  return broadcasts.some((broadcast) => broadcast?.name === issueKey);
}

async function sendOwnerCronNotice(subject, text) {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  return resendRequest("/emails", {
    method: "POST",
    body: JSON.stringify({
      from: getFromEmail(),
      to: getNotifyEmails(),
      subject,
      text,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827"><h1 style="font-size:20px">${subject}</h1><pre style="white-space:pre-wrap;background:#f3f4f6;padding:16px;border-radius:8px">${text}</pre></div>`,
    }),
  }).catch((error) => {
    console.error("Newsletter cron notice failed:", error.message);
    return null;
  });
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const now = req.query?.date ? new Date(String(req.query.date)) : new Date();
  const schedule = shouldSendMonthlyNewsletter(Number.isNaN(now.getTime()) ? new Date() : now);

  if (!schedule.shouldSend) {
    return res.status(200).json({
      ok: true,
      skipped: true,
      reason: "Not the first Friday send window.",
      dateKey: schedule.dateKey,
      issueKey: schedule.issueKey,
    });
  }

  if (!isNewsletterConfigured()) {
    return res.status(200).json({
      ok: true,
      skipped: true,
      setupRequired: true,
      reason: "Resend newsletter environment variables are not configured.",
      issueKey: schedule.issueKey,
    });
  }

  try {
    if (await broadcastExists(schedule.issueKey)) {
      return res.status(200).json({
        ok: true,
        skipped: true,
        duplicate: true,
        issueKey: schedule.issueKey,
      });
    }

    const contacts = await listSegmentContacts(process.env.RESEND_NEWSLETTER_SEGMENT_ID);
    const activeContacts = contacts.filter((contact) => !contact?.unsubscribed);

    if (activeContacts.length > 100) {
      const text = `${newsletterTitle} was not sent automatically because the active list has ${activeContacts.length} contacts and the free Resend plan allows 100 emails per day. Create manual follow-up batches or upgrade Resend before sending ${schedule.issueKey}.`;

      await sendOwnerCronNotice(`${newsletterTitle}: free-tier send paused`, text);

      return res.status(200).json({
        ok: true,
        skipped: true,
        freeTierPaused: true,
        activeContacts: activeContacts.length,
        issueKey: schedule.issueKey,
      });
    }

    const signals = await fetchNewsletterSignals().catch((error) => {
      console.error("Newsletter news signal fetch failed:", error.message);
      return [];
    });
    const issue = buildNewsletterIssue(schedule.issueKey, signals);
    const created = await resendRequest("/broadcasts", {
      method: "POST",
      body: JSON.stringify({
        name: issue.name,
        audienceId: process.env.RESEND_NEWSLETTER_AUDIENCE_ID || undefined,
        segmentId: process.env.RESEND_NEWSLETTER_SEGMENT_ID,
        from: getFromEmail(),
        subject: issue.subject,
        html: issue.html,
        text: issue.text,
      }),
    });
    const broadcastId = created?.id || created?.data?.id;

    if (!broadcastId) {
      throw new Error("Resend did not return a broadcast id.");
    }

    const sent = await resendRequest(`/broadcasts/${encodeURIComponent(broadcastId)}/send`, {
      method: "POST",
      body: JSON.stringify({}),
    });

    return res.status(200).json({
      ok: true,
      sent: true,
      issueKey: schedule.issueKey,
      activeContacts: activeContacts.length,
      broadcastId,
      result: sent,
    });
  } catch (error) {
    console.error("Newsletter monthly send failed:", {
      message: error.message,
      status: error.status,
      data: error.data,
    });

    return res.status(500).json({
      error: "Newsletter monthly send failed.",
      issueKey: schedule.issueKey,
    });
  }
}
