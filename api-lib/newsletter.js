export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RESEND_API_BASE = "https://api.resend.com";
const DEFAULT_NOTIFY_EMAILS = ["mastergrowbotai@gmail.com", "agcomsol@gmail.com"];
const DEFAULT_FROM_EMAIL = "Cannabis AI Signal <newsletter@mastergrowbot.com>";
const DEFAULT_FORMSPREE_FORM_ID = "mrerazdy";
const MEXICO_CITY_TIME_ZONE = "America/Mexico_City";
const NEWSLETTER_START_DATE = process.env.NEWSLETTER_START_DATE || "2026-07-03";

export const newsletterTitle = "Cannabis AI Signal";

export const productLinks = {
  ios: "https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060",
  android: "https://play.google.com/store/apps/details?id=com.mastergrowbot.app",
  book: "https://www.amazon.com/dp/B0H5LWKBSV",
  growTech: "https://www.mastergrowbot.com/grow-tech",
  growGuides: "https://www.mastergrowbot.com/grow-guides",
  vpdCalculator: "https://www.mastergrowbot.com/vpd-calculator",
};

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function sanitizeText(value, fallback = "") {
  return String(value || fallback).trim().slice(0, 240);
}

export function getNotifyEmails() {
  const configured = String(process.env.NEWSLETTER_NOTIFY_EMAILS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return configured.length > 0 ? configured : DEFAULT_NOTIFY_EMAILS;
}

export function getFromEmail() {
  return process.env.NEWSLETTER_FROM_EMAIL || DEFAULT_FROM_EMAIL;
}

export function isNewsletterConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_NEWSLETTER_SEGMENT_ID);
}

export function isGoogleLeadWebhookConfigured() {
  return Boolean(process.env.GOOGLE_LEADS_WEBHOOK_URL);
}

export function isFormspreeLeadBackupConfigured() {
  return Boolean(process.env.FORMSPREE_NEWSLETTER_FORM_ID || DEFAULT_FORMSPREE_FORM_ID);
}

export async function resendRequest(path, options = {}) {
  const response = await fetch(`${RESEND_API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || data?.error || `Resend request failed: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function buildContactPayload({ email, name, sourcePage, sourceForm, interestProduct, utm }) {
  return {
    email,
    unsubscribed: false,
    properties: {
      name: sanitizeText(name),
      sourcePage: sanitizeText(sourcePage, "/"),
      sourceForm: sanitizeText(sourceForm, "newsletter"),
      interestProduct: sanitizeText(interestProduct),
      utm_source: sanitizeText(utm?.utm_source),
      utm_medium: sanitizeText(utm?.utm_medium),
      utm_campaign: sanitizeText(utm?.utm_campaign),
      utm_content: sanitizeText(utm?.utm_content),
      subscribedAt: new Date().toISOString(),
    },
    segments: [{ id: process.env.RESEND_NEWSLETTER_SEGMENT_ID }],
  };
}

export async function createNewsletterContact(payload) {
  try {
    return await resendRequest("/contacts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (![400, 409, 422].includes(error.status)) {
      throw error;
    }

    const contactKey = encodeURIComponent(payload.email);
    const updated = await resendRequest(`/contacts/${contactKey}`, {
      method: "PATCH",
      body: JSON.stringify({
        unsubscribed: false,
        properties: payload.properties,
      }),
    });

    await resendRequest(
      `/contacts/${contactKey}/segments/${encodeURIComponent(process.env.RESEND_NEWSLETTER_SEGMENT_ID)}`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
    ).catch(() => null);

    return updated;
  }
}

export async function sendOwnerNotification({ email, sourcePage, sourceForm, interestProduct }) {
  const subject = `${newsletterTitle}: new subscriber`;
  const details = [
    `Email: ${email}`,
    `Source page: ${sourcePage || "/"}`,
    `Source form: ${sourceForm || "newsletter"}`,
    interestProduct ? `Interest: ${interestProduct}` : null,
    `Created at: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  return resendRequest("/emails", {
    method: "POST",
    body: JSON.stringify({
      from: getFromEmail(),
      to: getNotifyEmails(),
      subject,
      text: details,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827"><h1 style="font-size:20px">${subject}</h1><pre style="white-space:pre-wrap;background:#f3f4f6;padding:16px;border-radius:8px">${details}</pre></div>`,
    }),
  });
}

export async function sendLeadToGoogleWebhook(lead) {
  if (!process.env.GOOGLE_LEADS_WEBHOOK_URL) {
    return null;
  }

  const response = await fetch(process.env.GOOGLE_LEADS_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: process.env.GOOGLE_LEADS_WEBHOOK_SECRET || "",
      ...lead,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.ok === false) {
    const message = data?.error || `Google lead webhook failed: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function sendLeadToFormspree(lead) {
  const formId = process.env.FORMSPREE_NEWSLETTER_FORM_ID || DEFAULT_FORMSPREE_FORM_ID;

  if (!formId) {
    return null;
  }

  const details = [
    "A new email was submitted on mastergrowbot.com.",
    `Email: ${lead.email}`,
    `Name: ${lead.name || ""}`,
    `Source page: ${lead.sourcePage || ""}`,
    `Source form: ${lead.sourceForm || ""}`,
    `Interest: ${lead.interestProduct || ""}`,
    `Created at: ${lead.createdAt || new Date().toISOString()}`,
    "Notify: Agcomsol@gmail.com, mastergrowbotai@gmail.com",
  ].join("\n");

  const response = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: lead.email,
      name: lead.name || "",
      sourcePage: lead.sourcePage || "",
      sourceForm: lead.sourceForm || "",
      interestProduct: lead.interestProduct || "",
      createdAt: lead.createdAt || new Date().toISOString(),
      utm: JSON.stringify(lead.utm || {}),
      message: details,
      _subject: "New MasterGrowbot AI website email signup",
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.ok === false) {
    const message = data?.error || `Formspree lead backup failed: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function withUtm(url, issueKey, content) {
  const target = new URL(url);
  target.searchParams.set("utm_source", "newsletter");
  target.searchParams.set("utm_medium", "email");
  target.searchParams.set("utm_campaign", `cannabis_ai_signal_${issueKey.replace("ai-cannabis-friday-", "")}`);
  target.searchParams.set("utm_content", content);
  return target.toString();
}

function decodeXml(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function extractRssItems(xml, limit = 2) {
  const matches = Array.from(String(xml || "").matchAll(/<item>([\s\S]*?)<\/item>/g));

  return matches
    .map((match) => {
      const item = match[1];
      const title = decodeXml(item.match(/<title>([\s\S]*?)<\/title>/)?.[1]);
      const link = decodeXml(item.match(/<link>([\s\S]*?)<\/link>/)?.[1]);
      const source = decodeXml(item.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]);

      return title && link ? { title, link, source } : null;
    })
    .filter(Boolean)
    .slice(0, limit);
}

export async function fetchNewsletterSignals() {
  const queries = [
    "cannabis AI grow technology",
    "cannabis cultivation technology greenhouse AI",
    "cannabis extraction genetics research",
  ];

  const results = await Promise.allSettled(
    queries.map(async (query) => {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "MasterGrowbotAI-Newsletter/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`News fetch failed: ${response.status}`);
      }

      return extractRssItems(await response.text(), 2);
    }),
  );

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : [])).slice(0, 5);
}

export function getMexicoCityParts(date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: MEXICO_CITY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    weekday: parts.weekday,
    hour: parts.hour,
    minute: parts.minute,
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    issueKey: `ai-cannabis-friday-${parts.year}-${parts.month}-${parts.day}`,
  };
}

export function shouldSendMonthlyNewsletter(date = new Date()) {
  const parts = getMexicoCityParts(date);
  const dayNumber = Number(parts.day);

  return {
    shouldSend:
      parts.dateKey >= NEWSLETTER_START_DATE &&
      parts.weekday === "Friday" &&
      dayNumber >= 1 &&
      dayNumber <= 7,
    ...parts,
  };
}

export function buildNewsletterIssue(issueKey, signals = []) {
  const iosUrl = withUtm(productLinks.ios, issueKey, "ios_app_primary");
  const androidUrl = withUtm(productLinks.android, issueKey, "android_app_secondary");
  const bookUrl = withUtm(productLinks.book, issueKey, "amazon_ipm_playbook");
  const growTechUrl = withUtm(productLinks.growTech, issueKey, "grow_tech_kit");
  const growGuidesUrl = withUtm(productLinks.growGuides, issueKey, "grow_guides");
  const vpdUrl = withUtm(productLinks.vpdCalculator, issueKey, "vpd_calculator");
  const subject = "Cannabis AI Signal: Where AI and Cannabis Collide";
  const newsText =
    signals.length > 0
      ? signals
          .map((item, index) => `${index + 1}. ${item.title}${item.source ? ` (${item.source})` : ""}: ${item.link}`)
          .join("\n")
      : "No live headlines were available at send time, so this issue uses the evergreen grow-tech brief.";
  const newsHtml =
    signals.length > 0
      ? `<ul style="margin:10px 0 0;padding-left:20px;color:rgba(255,255,255,0.66);font-size:15px;line-height:1.65;">${signals
          .map(
            (item) =>
              `<li style="margin-bottom:8px;"><a href="${item.link}" style="color:#22c55e;font-weight:700;">${item.title}</a>${item.source ? ` <span style="color:rgba(255,255,255,0.42);">(${item.source})</span>` : ""}</li>`,
          )
          .join("")}</ul>`
      : `<p style="margin:10px 0 0;color:rgba(255,255,255,0.66);font-size:15px;line-height:1.65;">No live headlines were available at send time, so this issue uses the evergreen grow-tech brief.</p>`;

  const text = `${newsletterTitle}

Hi Grower,

Here is this month's Cannabis AI Signal: where the cutting edge of AI and cannabis collide for growers, extractors, geneticists, and cannabis operators.

1. Grow-tech news to watch
AI vision tools are getting better at turning messy grow-room photos into structured observations. The practical move: keep your photos consistent so your records become more useful over time.

Current news signals:
${newsText}

2. AI workflow worth trying
Before asking AI for help, write down cultivar, stage, medium, last watering, EC or ppm if known, pH if known, temperature, humidity, and what changed recently. Better context produces better guidance.

3. Cultivation tip to use this month
Take one canopy-wide photo and one close-up photo every time you document a problem. The pair helps you see both pattern and symptom.

4. Extraction and genetics angle
For extractors and breeders, start connecting plant observations to finished-product notes. Resin quality, terpene expression, vigor, and stress response become more valuable when they are tracked together.

5. MasterGrowbot AI pick
Use MasterGrowbot AI for scan support, keep the IPM Playbook close, and shop the Grow Tech Kit if you want better photo and grow-room inputs.

Download MasterGrowbot AI on iOS: ${iosUrl}
Download MasterGrowbot AI on Android: ${androidUrl}
Get the Amazon IPM Playbook: ${bookUrl}
Shop the Grow Tech Kit: ${growTechUrl}
Use the VPD Calculator: ${vpdUrl}
Read Grow Guides: ${growGuidesUrl}

You are receiving this because you joined the MasterGrowbot AI list.
Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}`;

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${subject}</title>
  </head>
  <body style="margin:0;background:#020604;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;color:transparent;">Monthly AI, cannabis, grow tech, extraction, and cannabis science signals.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#020604;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border:1px solid rgba(34,197,94,0.22);border-radius:18px;overflow:hidden;background:#07110c;box-shadow:0 0 48px rgba(34,197,94,0.13);">
            <tr>
              <td style="padding:28px 24px 18px;background:linear-gradient(145deg,#07110c,#020604);">
                <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#22c55e;font-weight:700;">Cannabis AI Signal</div>
                <h1 style="margin:14px 0 0;font-size:34px;line-height:1.08;color:#ffffff;letter-spacing:-0.02em;">Where AI and cannabis collide.</h1>
                <p style="margin:16px 0 0;font-size:16px;line-height:1.65;color:rgba(255,255,255,0.68);">Hi Grower, here is this month's signal from the cutting edge of AI, cannabis science, grow tech, extraction, genetics, and smarter cultivation.</p>
                <div style="margin-top:24px;"><a href="${iosUrl}" style="display:inline-block;background:#22c55e;color:#020604;text-decoration:none;font-weight:800;border-radius:10px;padding:14px 18px;">Download MasterGrowbot AI on iOS</a></div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 24px;">
                <div style="padding:18px;border:1px solid rgba(255,255,255,0.08);border-radius:14px;background:rgba(255,255,255,0.035);">
                  <h2 style="margin:0;color:#ffffff;font-size:20px;">1. Grow-tech news to watch</h2>
                  <p style="margin:10px 0 0;color:rgba(255,255,255,0.66);font-size:15px;line-height:1.65;">AI vision tools are getting better at turning messy grow-room photos into structured observations. The practical move: keep your photos consistent so your records become more useful over time.</p>
                  ${newsHtml}
                </div>
                <div style="margin-top:14px;padding:18px;border:1px solid rgba(255,255,255,0.08);border-radius:14px;background:rgba(255,255,255,0.035);">
                  <h2 style="margin:0;color:#ffffff;font-size:20px;">2. AI workflow worth trying</h2>
                  <p style="margin:10px 0 0;color:rgba(255,255,255,0.66);font-size:15px;line-height:1.65;">Before asking AI for help, write down cultivar, stage, medium, last watering, pH if known, temperature, humidity, and what changed recently. Better context produces better guidance.</p>
                </div>
                <div style="margin-top:14px;padding:18px;border:1px solid rgba(255,255,255,0.08);border-radius:14px;background:rgba(255,255,255,0.035);">
                  <h2 style="margin:0;color:#ffffff;font-size:20px;">3. Cultivation tip to use this month</h2>
                  <p style="margin:10px 0 0;color:rgba(255,255,255,0.66);font-size:15px;line-height:1.65;">Take one canopy-wide photo and one close-up photo every time you document a problem. The pair helps you see both pattern and symptom.</p>
                </div>
                <div style="margin-top:14px;padding:18px;border:1px solid rgba(255,255,255,0.08);border-radius:14px;background:rgba(255,255,255,0.035);">
                  <h2 style="margin:0;color:#ffffff;font-size:20px;">4. Extraction and genetics angle</h2>
                  <p style="margin:10px 0 0;color:rgba(255,255,255,0.66);font-size:15px;line-height:1.65;">For extractors and breeders, start connecting plant observations to finished-product notes. Resin quality, terpene expression, vigor, and stress response become more valuable when they are tracked together.</p>
                </div>
                <div style="margin-top:14px;padding:18px;border:1px solid rgba(34,197,94,0.18);border-radius:14px;background:rgba(34,197,94,0.08);">
                  <h2 style="margin:0;color:#ffffff;font-size:20px;">5. MasterGrowbot AI pick</h2>
                  <p style="margin:10px 0 16px;color:rgba(255,255,255,0.66);font-size:15px;line-height:1.65;">Use the app for scan support, keep the IPM Playbook close, and shop the Grow Tech Kit if you want better photo and grow-room inputs.</p>
                  <p style="margin:0 0 10px;"><a href="${androidUrl}" style="color:#22c55e;font-weight:700;">Download on Android</a></p>
                  <p style="margin:0 0 10px;"><a href="${bookUrl}" style="color:#22c55e;font-weight:700;">Get the Amazon IPM Playbook</a></p>
                  <p style="margin:0;"><a href="${growTechUrl}" style="color:#22c55e;font-weight:700;">Shop the Grow Tech Kit</a></p>
                </div>
                <div style="margin-top:14px;padding:18px;border:1px solid rgba(255,255,255,0.08);border-radius:14px;background:rgba(255,255,255,0.035);">
                  <h2 style="margin:0;color:#ffffff;font-size:20px;">Free tools to keep close</h2>
                  <p style="margin:10px 0 16px;color:rgba(255,255,255,0.66);font-size:15px;line-height:1.65;">Use the VPD Calculator and Grow Guides when you want a quick grow-room check without slowing down your day.</p>
                  <p style="margin:0 0 10px;"><a href="${vpdUrl}" style="color:#22c55e;font-weight:700;">Open the VPD Calculator</a></p>
                  <p style="margin:0;"><a href="${growGuidesUrl}" style="color:#22c55e;font-weight:700;">Read Grow Guides</a></p>
                </div>
                <p style="margin:22px 0 0;color:rgba(255,255,255,0.46);font-size:12px;line-height:1.6;">MasterGrowbot AI supports grow documentation and AI-assisted plant guidance. It does not guarantee diagnosis, yields, or legal compliance. Always follow your local laws.</p>
                <p style="margin:16px 0 0;color:rgba(255,255,255,0.46);font-size:12px;line-height:1.6;">You are receiving this because you joined the MasterGrowbot AI list. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#22c55e;">Unsubscribe</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { name: issueKey, subject, html, text };
}
