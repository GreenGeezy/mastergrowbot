import { createHash } from "node:crypto";
import { confirmedEmail, sender } from "../../api-lib/confirmation.js";
import { resendRequest } from "../../api-lib/newsletter.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  if (req.method === "GET") {
    return res.status(200).setHeader("Content-Type", "text/html; charset=utf-8").send(
      '<!doctype html><html lang="en"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Confirm your subscription</title><main style="max-width:34rem;margin:12vh auto;padding:1em;font:18px/1.5 system-ui;color:#173b30"><p>Cannabis AI News &amp; Tools</p><h1>Confirm your subscription</h1><p>One short email each week. Unsubscribe anytime.</p><form method="post"><input type="hidden" name="token"><button>Confirm my subscription</button></form><script>document.querySelector("input").value=location.hash.slice(1);history.replaceState(null,"",location.pathname)</script></main></html>');
  }
  if (req.method !== "POST") return res.status(405).end();
  const email = confirmedEmail(req.body?.token);
  if (!email) return res.status(400).send("This confirmation link is invalid or expired. Request another at mastergrowbot.com/newsletter.");
  try {
    const proof = createHash("sha256").update(req.body.token).digest("hex");
    await resendRequest("/emails", {
      method: "POST",
      headers: { "Idempotency-Key": "consent-" + proof },
      body: JSON.stringify({
        from: sender, to: ["agcomsol@gmail.com"],
        subject: "Confirmed opt-in | Cannabis AI News & Tools",
        text: "Explicit weekly newsletter subscription confirmed by inbox link.\nEmail: " + email +
          "\nConsent receipt: " + proof + "\nReconcile against unsubscribes, bounces, complaints and owner tests before adding to the broadcast segment.",
      }),
    });
    return res.status(200).send("Your subscription is confirmed. Look for Cannabis AI News &amp; Tools in your inbox. <a href='/downloads/cannabis-ai-at-work.html?utm_source=confirmation&amp;utm_medium=email&amp;utm_campaign=weekly_workbench'>Open the free Workbench</a>.");
  } catch {
    return res.status(503).send("Confirmation could not finish. Open your email link again to retry.");
  }
}
