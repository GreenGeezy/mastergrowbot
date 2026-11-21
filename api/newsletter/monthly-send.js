export default function handler(_req, res) {
  return res.status(410).json({ message: "Monthly editions are scheduled individually in Resend." });
}
