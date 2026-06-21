import { FormEvent, useState } from 'react';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSignup() {
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

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          sourcePage: '/',
          sourceForm: 'homepage_newsletter',
          interestProduct: 'Cannabis AI Signal',
          utm_source: 'website',
          utm_medium: 'organic',
          utm_campaign: 'homepage_monthly_newsletter_signup',
          utm_content: 'cannabis_ai_signal',
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
        <div className="inline-flex items-center gap-2 rounded-full border border-landing-green/25 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-landing-green">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Monthly signal brief
        </div>
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">
            Cannabis AI Signal
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/55 sm:text-base">
            Where the cutting edge of AI and cannabis collide. Monthly news, opinions, AI grow tactics,
            extraction ideas, and cannabis science signals sent the first Friday of every month.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
        <label htmlFor="newsletter-email" className="sr-only">
          Join Cannabis AI Signal
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
            {isSubmitting ? 'Joining...' : 'Join Free'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {error && (
          <p id="newsletter-email-error" className="mt-3 text-sm font-medium text-red-300">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-3 rounded-lg border border-landing-green/30 bg-landing-green/10 px-3 py-2 text-sm font-medium text-landing-green">
            You are on the list. Watch for the next first-Friday edition.
          </p>
        )}

        <p className="mt-3 text-xs leading-relaxed text-white/38">
          Free monthly email. No spam. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
