import { ArrowUpRight, Truck, ShieldCheck, Headphones } from "lucide-react";
export default function OrderQuestions({ checkoutUrl, fulfillmentNote }: { checkoutUrl?: string; fulfillmentNote?: string }) {
 return <section id="growtech-order-answers" className="order-answers" aria-labelledby="order-answers-title">
  <div className="lab-heading"><div><p className="premium-eyebrow">BEFORE YOU ORDER</p><h2 id="order-answers-title">Clear answers. A confident choice.</h2></div></div>
  <div className="order-answer-grid">
   <details><summary><Truck size={18}/> Shipping & delivery</summary><p>{fulfillmentNote || "Check the product’s destination and delivery estimate before ordering."}</p><p>Prices are in USD. Sales tax is shown at checkout. Canadian import charges, if assessed, are not included. Tracking is sent after dispatch. For remote addresses or a particular deadline, contact support@mastergrowbot.com before ordering.</p></details>
   <details><summary><ShieldCheck size={18}/> Returns & order issues</summary><p>Unused, unopened products may be eligible for return within 30 days of delivery. Return shipping is paid by the customer unless an item arrives damaged or incorrect.</p><p>Contact <a href="mailto:support@mastergrowbot.com?subject=GrowTech%20order%20help">support@mastergrowbot.com</a> for return instructions or an order issue.</p></details>
   <details><summary><Headphones size={18}/> Need help completing payment?</summary><p>Use a payment method offered by Whop at checkout. If a payment is declined, check with your bank or try another supported method. Opening a different checkout page does not override a bank or security decline.</p>{checkoutUrl ? <p><a href={checkoutUrl} target="_blank" rel="noopener noreferrer">Open hosted Whop checkout <ArrowUpRight size={14}/></a></p> : <p>The checkout page also includes a hosted Whop link if the embedded form does not load.</p>}<p><a href="mailto:support@mastergrowbot.com?subject=GrowTech%20checkout%20help">Get checkout help</a>. Include the product and error message, never your card details.</p></details>
  </div>
 </section>;
}
