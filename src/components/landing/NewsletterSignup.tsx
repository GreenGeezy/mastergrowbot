import { FormEvent, useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSignup({ heading: Heading = 'h2', homeJournal = false }: { heading?: 'h1' | 'h2'; homeJournal?: boolean }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placement = homeJournal ? 'newsletter_home_journal' : Heading === 'h1' ? 'newsletter_page' : 'homepage_newsletter';
  const referral = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  if (!referral.has('utm_source')) referral.set('utm_source', placement);
  const workbenchUrl = '/downloads/cannabis-ai-at-work.html?' + referral.toString();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!emailPattern.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const attribution = new URLSearchParams(window.location.search);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          sourcePage: window.location.pathname,
          sourceForm: placement,
          interestProduct: 'Cannabis AI News & Tools',
          utm_source: attribution.get('utm_source') || 'website',
          utm_medium: attribution.get('utm_medium') || 'organic',
          utm_campaign: attribution.get('utm_campaign') || 'weekly_workbench',
          utm_content: attribution.get('utm_content') || '',
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }

      const receipt = await response.json();
      setConfirmationSent(receipt.confirmationSent === true);
      setSuccess(true);
      setEmail('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newsletter-editorial mx-auto max-w-3xl overflow-hidden rounded-xl bg-[#132f25] text-[#f4f0df] shadow-lg">
      {!homeJournal && <img src="/downloads/home-grow-cover.webp" alt="A field notebook beside a home-grown cannabis plant" width="1440" height="810" loading="lazy" className="h-40 w-full object-cover object-[65%_55%] sm:h-52" />}
      <div className="px-5 pt-6 text-left sm:px-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#e9c88b]">The weekly email</p>
        <Heading className="font-serif text-3xl font-normal text-[#fff8e8] sm:text-4xl">Cannabis AI News &amp; Tools</Heading>
        <p className="mb-4 mt-3 text-base leading-relaxed text-[#e3e7d4]">{homeJournal ? 'What can a camera really tell you about a plant? Get reporting on questions like this, plus an AI technique you can try in your own grow.' : 'From a single plant at home to a commercial greenhouse. Get one reported cannabis technology story, the AI news worth following and a practical way to try a tool yourself.'}</p>
        {!homeJournal && <div className="mb-5 grid gap-3 border-y border-[#71836b] py-4 sm:grid-cols-2">
          <a href={'/home-grow-journal?' + referral.toString()} className="block text-[#f2d398]"><strong>For your home grow ↗</strong><span className="mt-1 block text-sm text-[#e3e7d4]">Compare plant photos and build a question for ChatGPT or Claude.</span></a>
          <a href={workbenchUrl} className="block text-[#f2d398]"><strong>For your cannabis business ↗</strong><span className="mt-1 block text-sm text-[#e3e7d4]">Review a sensor log, stock shortfall or procedure change.</span></a>
        </div>}
      </div>
      <form onSubmit={handleSubmit} className="px-5 pb-6 sm:px-8">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address for Cannabis AI News &amp; Tools
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-landing-green" aria-hidden="true" />
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="min-h-12 w-full rounded-lg border border-white/10 bg-black/55 py-3 pl-11 pr-4 text-white placeholder:text-white/30 transition focus:border-landing-green focus:outline-none focus:ring-2 focus:ring-landing-green/40"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'newsletter-email-error' : undefined}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-landing-green px-5 py-3 text-sm font-semibold text-black transition hover:bg-landing-green/90 hover:shadow-lg hover:shadow-landing-green/20 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Joining...' : 'Get the weekly edition'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {error && (
          <p id="newsletter-email-error" className="mt-3 text-sm font-medium text-red-300">
            {error}
          </p>
        )}

        {success && (
          <div role="status" className="mt-3 rounded-lg border border-landing-green/30 bg-landing-green/10 p-4 text-white">
            <p>Your request is saved.</p>
            <p>{confirmationSent ? 'Check your inbox and confirm your address to receive the weekly email.' : 'Your request was saved. Confirmation email delivery is pending.'}</p>
            <a href={workbenchUrl} className="mt-2 inline-block font-semibold text-landing-green underline">Explore the business tools</a>
          </div>
        )}

        <p className="mt-3 text-xs leading-relaxed text-[#ccd5bf]">
          Free weekly email. No spam. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
