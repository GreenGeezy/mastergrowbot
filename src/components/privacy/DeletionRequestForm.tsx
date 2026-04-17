import { useState } from 'react';

export default function DeletionRequestForm() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xwpkqdkv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Data Deletion Request',
          ...form,
        }),
      });
      setFormStatus(res.ok ? 'sent' : 'error');
    } catch {
      setFormStatus('error');
    }
  }

  if (formStatus === 'sent') {
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
      <div>
        <label className="block text-sm text-white/50 mb-1.5" htmlFor="deletion-name">
          Name
        </label>
        <input
          id="deletion-name"
          type="text"
          required
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
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
          required
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
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
          rows={4}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="Describe what data you'd like deleted, or simply write 'Delete my account and all data'..."
          className="w-full px-4 py-3 rounded-xl bg-[#0f1117] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-landing-green/50 transition-colors resize-none"
        />
      </div>
      {formStatus === 'error' && (
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
        disabled={formStatus === 'sending'}
        className="w-full py-3 rounded-xl bg-landing-green text-black font-semibold text-sm hover:bg-landing-green/90 disabled:opacity-50 transition-colors duration-200"
      >
        {formStatus === 'sending' ? 'Submitting…' : 'Submit Deletion Request'}
      </button>
    </form>
  );
}
