import { FormEvent, useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSignup({ heading: Heading = 'h2' }: { heading?: 'h1' | 'h2' }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          sourceForm: window.location.pathname === '/newsletter' ? 'newsletter_page' : 'homepage_newsletter',
          interestProduct: 'Cannabis AI News & Tools',
          utm_source: attribution.get('utm_source') || 'website',
          utm_medium: attribution.get('utm_medium') || 'organic',
          utm_campaign: attribution.get('utm_campaign') || 'monthly_briefing',
          utm_content: attribution.get('utm_content') || '',
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }

      setSuccess(true);
      setEmail('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-9 max-w-3xl rounded-2xl border border-landing-green/20 bg-landing-green/[0.07] p-5 shadow-xl shadow-landing-green/10 backdrop-blur sm:p-6">
      <div className="mb-4 flex flex-col items-center gap-3 text-center">
        <img src="/newsletter-logo.png" alt="" width="64" height="64" loading="lazy" className="rounded-xl" />
        <div>
          <Heading className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">
            Cannabis AI News &amp; Tools
          </Heading>
          <p className="mt-2 text-sm leading-relaxed text-white/55 sm:text-base">
            What can AI already do in cannabis? Get the research, tools, and stories worth your time in one short email each month.
          </p>
          <p className="mt-3 text-sm text-white/85">Join free and get three copyable prompts for checking a vendor claim, comparing quotes, and reading an earnings report.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
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
            {isSubmitting ? 'Joining...' : 'Get the prompts and newsletter'}
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
            <p>Your three prompts are ready. The newsletter arrives monthly.</p>
            <a href="/downloads/cannabis-ai-desk-cards.html" download className="mt-2 inline-block font-semibold text-landing-green underline">Download the printable desk cards</a>
          </div>
        )}

        <p className="mt-3 text-xs leading-relaxed text-white/38">
          Free monthly email. No spam. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
