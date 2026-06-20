const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, productName, sourcePage } = req.body || {};

  if (!email || !emailPattern.test(String(email))) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  if (!productName || typeof productName !== "string") {
    return res.status(400).json({ error: "Missing selected product." });
  }

  const lead = {
    email: String(email).trim().toLowerCase(),
    productName,
    createdAt: new Date().toISOString(),
    sourcePage: sourcePage || "/grow-tech",
  };

  // TODO: Connect this placeholder to the production lead store
  // (for example Firebase, Supabase, Resend audience, or CRM) before launch.
  if (process.env.NODE_ENV !== "production") {
    console.info("Grow Tech waitlist lead:", lead);
  }

  return res.status(200).json({ ok: true });
}
