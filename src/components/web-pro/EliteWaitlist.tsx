import { type FormEvent, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

// Same Formspree form the Contact page uses. No backend of its own.
const ENDPOINT = 'https://formspree.io/f/mrerazdy';

/**
 * Early interest form for a possible team plan. Shown only to people who already subscribe, and inside a
 * closed disclosure at the very end of /pro, so it never competes with the app or with Web Pro.
 */
export default function EliteWaitlist() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState('sending');
    const data = new FormData(event.currentTarget);
    data.set('_subject', 'MasterGrowbot Elite waitlist');
    data.set('form', 'elite-waitlist');
    try {
      const response = await fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Not sent');
      setState('sent');
      trackEvent('elite_waitlist_join');
    } catch { setState('error'); }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 font-sans">
      <h3 className="font-sans text-base font-bold text-white">MasterGrowbot Elite, for commercial teams</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">Planned at $99 a month or $499 a year: team seats, file uploads and priority AI. It is not available yet. Join the early access list and we will email you if it opens. Web Pro and the app work today.</p>
      {state === 'sent' ? <p role="status" className="mt-4 text-sm font-semibold text-landing-green">You are on the list.</p> : (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label className="flex-1"><span className="sr-only">Work email</span>
            <input type="email" name="email" required autoComplete="email" placeholder="Work email" className="h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-base text-white placeholder:text-white/40 outline-none focus:border-landing-green" />
          </label>
          <button type="submit" disabled={state === 'sending'} className="h-12 rounded-full border border-white/25 px-6 text-sm font-semibold text-white hover:border-white/50 disabled:opacity-60">{state === 'sending' ? 'Joining' : 'Join early access'}</button>
        </form>
      )}
      {state === 'error' && <p role="alert" className="mt-3 text-sm text-red-200">That did not send. Please try again.</p>}
    </section>
  );
}
