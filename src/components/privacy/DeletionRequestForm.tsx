import { useForm, ValidationError } from '@formspree/react';

export default function DeletionRequestForm() {
  const [state, handleSubmit] = useForm('mrerazdy');

  if (state.succeeded) {
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
        <ValidationError field="name" errors={state.errors} className="text-red-400 text-xs mt-1 block" />
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
        <ValidationError field="email" errors={state.errors} className="text-red-400 text-xs mt-1 block" />
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
        <ValidationError field="message" errors={state.errors} className="text-red-400 text-xs mt-1 block" />
      </div>

      {/* Form-level errors (e.g. inactive form, blocked) */}
      {state.errors && state.errors.getFormErrors().length > 0 && (
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
        disabled={state.submitting}
        className="w-full py-3 rounded-xl bg-landing-green text-black font-semibold text-sm hover:bg-landing-green/90 disabled:opacity-50 transition-colors duration-200"
      >
        {state.submitting ? 'Submitting…' : 'Submit Deletion Request'}
      </button>
    </form>
  );
}
