import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { WhopCheckoutEmbed } from '@whop/checkout/react';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { usePlaybookOffer } from '@/hooks/usePlaybookOffer';
import { PLAYBOOK_PLAN_ID } from '@/data/playbook';
import { trackEvent } from '@/lib/analytics';
import '@/components/landing/premium.css';
export default function PlaybookCheckout() {
  const offer=usePlaybookOffer();
  useEffect(()=>{trackEvent('playbook_begin_checkout',{product:'ai-plant-observation-playbook'});},[]);
  return <div className="premium-site min-h-screen bg-[#030906] text-white"><Helmet><title>Playbook checkout | MasterGrowbot</title><meta name="robots" content="noindex,follow"/></Helmet><LandingNav/><main className="mx-auto grid max-w-5xl gap-10 px-5 py-12 lg:grid-cols-[.8fr_1.2fr]"><section><Link to="/playbooks" className="text-sm text-emerald-300">← Back to the Playbook</Link><h1 className="mt-6 text-3xl font-bold">AI Plant Observation Playbook</h1><p className="mt-5 text-3xl font-bold text-emerald-300">${offer.price} <span className="text-sm font-normal text-white/65">USD · one-time</span></p>{offer.isLaunch&&<p className="mt-3 text-sm leading-6 text-white/65">Launch code is applied below. Ends October 16, 2026 at 11:59 p.m. Mexico City time. Regular price $89 after launch.</p>}<ul className="mt-7 space-y-4 text-sm leading-6 text-white/75"><li>24-page Playbook with eight AI prompts</li><li>Six-page printable and fillable workbook</li><li>Nine-page Equipment Quickstart + two worksheets</li><li>CSV log + copy-ready prompt text file</li><li>Digital access through your Whop account</li></ul><p className="mt-7 text-xs leading-6 text-white/55">No hardware, app subscription or recurring guide payment. No cultivation instructions or guaranteed outcomes. Any applicable tax and final total appear in Whop checkout.</p></section><section className="min-w-0 rounded-2xl bg-white p-3 text-black sm:p-6" aria-label="Secure Whop checkout"><WhopCheckoutEmbed key={offer.isLaunch?'launch':'regular'} planId={PLAYBOOK_PLAN_ID} promoCode={offer.promoCode} returnUrl="https://www.mastergrowbot.com/playbooks/thank-you" collectShippingAddress={false} theme="light"/><a href={offer.hostedUrl} onClick={()=>trackEvent('playbook_hosted_checkout_open',{value:offer.price,currency:'USD'})} className="mt-6 block rounded-xl border border-gray-300 px-4 py-3 text-center text-sm font-semibold underline">Open secure Whop checkout in this tab</a></section></main><LandingFooter/></div>;
}
