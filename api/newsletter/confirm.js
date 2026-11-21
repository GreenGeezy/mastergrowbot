import { confirmedEmail, segment } from "../../api-lib/confirmation.js";
import { resendRequest } from "../../api-lib/newsletter.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  if (req.method === "GET") {
    return res.status(200).setHeader("Content-Type", "text/html; charset=utf-8").send(
      '<!doctype html><html lang="en"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Confirm your subscription</title><main style="max-width:34rem;margin:12vh auto;padding:1em;font:18px/1.5 system-ui;color:#173b30"><p>Cannabis AI News &amp; Tools</p><h1>Confirm your subscription</h1><p>One short email each month. Unsubscribe anytime.</p><form method="post"><input type="hidden" name="token"><button>Confirm my subscription</button></form><script>document.querySelector("input").value=location.hash.slice(1);history.replaceState(null,"",location.pathname)</script></main></html>');
  }
  if (req.method !== "POST") return res.status(405).end();
  const email = confirmedEmail(req.body?.token);
  if (!email) return res.status(400).send("This confirmation link is invalid or expired. Request another at mastergrowbot.com/newsletter.");
  try {
    const path = "/contacts/" + encodeURIComponent(email);
    let contact = await resendRequest(path).catch(error => {
      if (error.status === 404) return null;
      throw error;
    });
    if (!contact) {
      await resendRequest("/contacts", { method: "POST", body: JSON.stringify({ email }) }).catch(error => {
        if (![409,422].includes(error.status)) throw error;
      });
      contact = await resendRequest(path);
    }
    if (contact.unsubscribed) return res.status(200).send("This email address is opted out. Contact newsletter@mastergrowbot.com to change your preference.");
    await resendRequest("/contacts/" + encodeURIComponent(contact.id) + "/segments/" + segment, { method: "POST" });
    return res.status(200).send("Your subscription is confirmed. Look for Cannabis AI News & Tools in your inbox.");
  } catch {
    return res.status(503).send("Confirmation could not finish. Open your email link again to retry.");
  }
}
