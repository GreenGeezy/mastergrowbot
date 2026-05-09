import { useState, FormEvent } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function DeletionRequestForm() {
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const data = new URLSearchParams();
    const formData = new FormData(form);
    formData.forEach((value, key) => {
      data.append(key, value as string);
    });

    try {
      const response = await fetch('https://formspree.io/f/mrerazdy', {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-6 bg-landing-green/10 border border-landing-green/30 rounded-xl text-center">
        <p className="text-landing-green font-semibold mb-1">Request received!</p>
        <p className="text-white/50 text-sm">
          We will process your data deletion request and confirm via email within 30 days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="_subject" value="Data Deletion Request" />

      <div>
        <label className="block text-sm text-white/50 mb-1.5" htmlFor="deletion-name">
          Name
        </label>
        <input
          id="deletion-name"
          type="text"
          name="name"
          required
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-xl bg-[#0f1117] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-landing-green/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1.5" htmlFor="deletion-email">
          Email address on your account
        </label>
        <input
          id="deletion-email"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl bg-[#0f1117] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-landing-green/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1.5" htmlFor="deletion-message">
          Request details (optional)
        </label>
        <textarea
          id="deletion-message"
          name="message"
          rows={4}
          placeholder="Describe what data you'd like deleted, or simply write 'Delete my account and all data'..."
          className="w-full px-4 py-3 rounded-xl bg-[#0f1117] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-landing-green/50 transition-colors resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm">
          Something went wrong. Please email your request directly to{' '}
          <a href="mailto:support@mastergrowbot.com" className="underline">
            support@mastergrowbot.com
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-3 rounded-xl bg-landing-green text-black font-semibold text-sm hover:bg-landing-green/90 disabled:opacity-50 transition-colors duration-200"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Deletion Request'}
      </button>
    </form>
  );
}
