import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { WhopCheckoutEmbed } from '@whop/checkout/react';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { usePlaybookOffer } from '@/hooks/usePlaybookOffer';
import { useWhopCheckoutTracking } from '@/hooks/useWhopCheckoutTracking';
import { PLAYBOOK_PLAN_ID, PLAYBOOK_FILES_URL, PLAYBOOK_CONTENT_URL, playbookEcommercePayload } from '@/data/playbook';
import { trackCheckoutSuccess, trackEvent } from '@/lib/analytics';
import '@/components/landing/premium.css';

export default function PlaybookCheckout() {
  const offer = usePlaybookOffer();
  const [completed, setCompleted] = useState(false);
  const started = useRef(false);
  const payload = useMemo(() => playbookEcommercePayload(offer.price, 'premium_checkout'), [offer.price]);
  const onComplete = useCallback((planId: string, receiptId: string | undefined, signal: string) => {
    if (planId !== PLAYBOOK_PLAN_ID || !receiptId) return;
    trackCheckoutSuccess(payload, receiptId, { whop_signal_source: signal, value_basis: 'advertised_offer', financial_source: 'Whop payment record' });
    setCompleted(true);
  }, [payload]);
  const { hostRef, checkoutState, handleComplete, handleStateChange } = useWhopCheckoutTracking({ planId: PLAYBOOK_PLAN_ID, payload, onComplete });
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    trackEvent('begin_checkout', payload);
    trackEvent('playbook_begin_checkout', payload);
  }, [payload]);
  return <div className="premium-site min-h-screen bg-[#030906] text-white">
    <Helmet><title>Playbook checkout | MasterGrowbot AI</title><meta name="robots" content="noindex,follow" /></Helmet>
    <LandingNav />
    <main className="mx-auto grid max-w-5xl gap-10 px-5 py-12 lg:grid-cols-[.8fr_1.2fr]">
      <section>
        <Link to="/playbooks" className="text-sm text-emerald-300 underline">Back to Playbooks</Link>
        <h1 className="mt-6 text-3xl font-bold">AI Plant Observation Playbook</h1>
        <p className="mt-5 text-3xl font-bold text-emerald-300">${offer.price} <span className="text-sm font-normal text-white/65">USD · one-time</span></p>
        <ul className="mt-7 space-y-4 text-sm leading-6 text-white/80">
          <li>32-page Playbook with eight worked AI prompt walkthroughs</li><li>Eight-page printable and fillable field workbook</li>
          <li>12-page Equipment Quickstart + two worksheets</li><li>CSV log + copy-ready prompt text file</li><li>Six files through your Whop account after payment</li>
        </ul>
        <p className="mt-6 text-sm font-semibold text-emerald-200">The $19 Quickstart is already included.</p>
        <p className="mt-5 text-xs leading-6 text-white/65">Digital guides. Hardware and app subscriptions are separate. Observation and responsible AI use; no cultivation instructions or guaranteed outcomes. Any applicable tax, final total and purchase terms appear in Whop checkout.</p>
      </section>
      <section className="min-w-0 rounded-2xl bg-white p-3 text-black sm:p-6" aria-label="Secure Whop checkout">
        {completed ? <div className="py-8"><h2 className="text-2xl font-bold">Your checkout is complete.</h2><p className="mt-4 leading-7">Check your Whop receipt, then sign in with the account used to purchase.</p><div className="mt-6 flex flex-wrap gap-4"><a href={PLAYBOOK_CONTENT_URL} className="font-bold text-emerald-800 underline">Open Start Here</a><a href={PLAYBOOK_FILES_URL} className="font-bold text-emerald-800 underline">Open your files</a></div></div> : <>
          {checkoutState === 'timeout' || checkoutState === 'disabled' ? <p role="status" className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">The embedded form is taking longer to load. Use full-page Whop checkout below to continue.</p> : null}
          <div ref={hostRef}><WhopCheckoutEmbed planId={PLAYBOOK_PLAN_ID} returnUrl="https://www.mastergrowbot.com/playbooks/thank-you" collectShippingAddress={false} theme="light" onComplete={(id, receipt) => handleComplete(id, receipt, 'react_on_complete')} onStateChange={state => handleStateChange(String(state), 'react_on_state_change')} /></div>
          <a href={offer.hostedUrl} onClick={() => trackEvent('checkout_fallback_click', payload)} className="mt-6 block min-h-12 rounded-xl border border-gray-300 px-4 py-3 text-center text-sm font-semibold underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800">Open secure full-page Whop checkout</a>
        </>}
      </section>
    </main><LandingFooter />
  </div>;
}
