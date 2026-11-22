import { FormEvent, useId, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { referral } from '@/lib/referral';
import './newsletter-signup.css';

// sourceForm values must match the allowlist in api/newsletter/subscribe.js.
// Each value names a form physically placed on that surface, never a link to another page.
export type SignupPlacement = 'newsletter_page' | 'newsletter_grow_week' | 'newsletter_homepage_footer';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requestedKey = 'mgb.newsletter.requested';

type Props = {
  placement: SignupPlacement;
  tone?: 'paper' | 'night';
  heading?: string;
  headingLevel?: 'h2' | 'h3';
  lede?: string;
  button?: string;
  campaign?: string;
};

export default function NewsletterSignup({ placement, tone = 'paper', heading, headingLevel: H = 'h2', lede, button = 'Get the weekly email', campaign = 'weekly_edition' }: Props) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'pending'>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim();
    if (!emailPattern.test(address)) { setError('Enter an email address like name@example.com.'); return; }
    setError(''); setState('sending');
    const r = referral();
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: address, sourcePage: window.location.pathname, sourceForm: placement, interestProduct: 'Cannabis AI News & Tools',
          utm_source: r.utm_source || 'website', utm_medium: r.utm_medium || 'organic', utm_campaign: r.utm_campaign || campaign, utm_content: r.utm_content || placement,
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string; confirmationSent?: boolean } | null;
      if (!response.ok) throw new Error(data?.error || 'That didn’t go through. Please try again.');
      const sent = data?.confirmationSent === true;
      setState(sent ? 'sent' : 'pending');
      trackEvent('newsletter_signup_request', { placement, confirmation_sent: sent });
      try { localStorage.setItem(requestedKey, new Date().toISOString().slice(0, 10)); } catch { /* optional */ }
      if (sent) setEmail('');
    } catch (e) {
      setState('idle');
      setError(e instanceof Error ? e.message : 'That didn’t go through. Please try again.');
    }
  }

  return (
    <div className={`nls nls-${tone}`}>
      {heading && <H className="nls-heading">{heading}</H>}
      {lede && <p className="nls-lede">{lede}</p>}
      {state === 'sent' ? (
        <div className="nls-done" role="status">
          <p className="nls-done-title"><Check size={18} aria-hidden="true" /> One more step: confirm your email.</p>
          <ol>
            <li>Open the message from <b>Cannabis AI News &amp; Tools</b>.</li>
            <li>Tap <b>Confirm my email address</b>, then the button on the page that opens.</li>
            <li>Nothing after five minutes? Check Promotions or Spam.</li>
          </ol>
          <p className="nls-fine">You won’t get the weekly email until you confirm.</p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="nls-form">
          <label htmlFor={id} className="nls-label">Email address</label>
          <div className="nls-row">
            <input id={id} type="email" inputMode="email" autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="name@example.com" aria-invalid={Boolean(error)} aria-describedby={id + '-note'} />
            <button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : button}<ArrowRight size={16} aria-hidden="true" /></button>
          </div>
          <p id={id + '-note'} className={error ? 'nls-error' : 'nls-fine'} role={error ? 'alert' : undefined}>
            {error || (state === 'pending'
              ? 'Your request is saved, but the confirmation email didn’t send. Press the button again in a few minutes.'
              : 'Free. One email a week. Unsubscribe in one click.')}
          </p>
        </form>
      )}
    </div>
  );
}
