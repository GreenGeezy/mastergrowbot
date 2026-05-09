export default function DeletionRequestForm() {
  return (
    <form action="https://formspree.io/f/mrerazdy" method="POST" className="space-y-4">
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

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-landing-green text-black font-semibold text-sm hover:bg-landing-green/90 transition-colors duration-200"
      >
        Submit Deletion Request
      </button>
    </form>
  );
}
