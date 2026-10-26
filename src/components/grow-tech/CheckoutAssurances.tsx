import { LockKeyhole, ShieldCheck, Truck } from 'lucide-react';

export default function CheckoutAssurances({ hardware = false }: { hardware?: boolean }) {
  return <ul aria-label="Checkout assurances" className="my-3 flex list-none flex-wrap gap-2 p-0 text-xs font-semibold">
    {hardware && <li className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-3 py-2"><Truck size={15} aria-hidden="true"/>Free shipping · <a href="/grow-tech#shipping-returns" className="underline">Shipping &amp; returns</a></li>}
    <li className="inline-flex items-center gap-1.5 rounded-full border border-current/20 px-3 py-2"><LockKeyhole size={15} aria-hidden="true"/>Secure Whop checkout</li>
    <li className="inline-flex items-center gap-1.5 rounded-full border border-current/20 px-3 py-2"><ShieldCheck size={15} aria-hidden="true"/>One-time payment</li>
  </ul>;
}
