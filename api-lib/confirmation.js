import { createHmac, timingSafeEqual } from "node:crypto";
import { emailPattern, resendRequest } from "./newsletter.js";

export const sender = "Cannabis AI News & Tools <editor@news.mastergrowbot.com>";
const day = 86400000;
function signature(payload) {
  return createHmac("sha256", process.env.NEWSLETTER_CONFIRM_SECRET || process.env.RESEND_API_KEY)
    .update("newsletter-confirm-v1:" + payload).digest("base64url");
}

export async function requestConfirmation(email) {
  const payload = Buffer.from(JSON.stringify([email, Math.floor(Date.now() / day), "weekly"])).toString("base64url");
  const mac = signature(payload);
  const url = "https://www.mastergrowbot.com/api/newsletter/confirm#" + payload + "." + mac;
  return resendRequest("/emails", {
    method: "POST",
    headers: { "Idempotency-Key": "confirm-" + mac },
    body: JSON.stringify({
      from: sender, to: [email], reply_to: "newsletter@mastergrowbot.com",
      subject: "Confirm your subscription to Cannabis AI News & Tools",
      text: "You requested one weekly email about cannabis and AI. Confirm your email here: " + url + "\nIf you did not request this, you can ignore this email.",
      html: '<p>You requested one weekly email about cannabis and AI.</p><p><a href="' + url + '">Confirm my email address</a></p><p>If you did not request this, you can ignore this email.</p>',
    }),
  });
}

export function confirmedEmail(token, now = Date.now()) {
  if (typeof token !== "string" || token.length > 900) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !/^[A-Za-z0-9_-]+$/.test(parts[0])) return null;
  const expected = Buffer.from(signature(parts[0]));
  const actual = Buffer.from(parts[1]);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const [email, issued] = JSON.parse(Buffer.from(parts[0], "base64url").toString());
    const age = Math.floor(now / day) - issued;
    return Number.isInteger(issued) && age >= 0 && age < 7 && emailPattern.test(email) ? email : null;
  } catch { return null; }
}
