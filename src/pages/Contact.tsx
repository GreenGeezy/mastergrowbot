import { useForm, ValidationError } from '@formspree/react';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import SEOHead from '@/components/SEOHead';

const FAQS = [
  {
    q: 'What makes MasterGrowbot AI different from other growing apps?',
    a: 'MasterGrowbot AI is built specifically for cannabis cultivation from the ground up — not a generic plant app adapted for cannabis. It combines AI-powered photo diagnosis, a personalized daily task system, strain-specific grow coaching, VPD tracking, and a full grow journal in one place. The AI is trained on cannabis-specific data so diagnoses are accurate for the unique challenges of cannabis cultivation.',
  },
  {
    q: "What's included in the free 3-day trial?",
    a: 'Your free trial gives you full access to every premium feature: unlimited AI plant scans, personalized grow coaching, the complete strain database, daily task scheduling, grow journal, and harvest window detection. No credit card is required to start on the web app. After the trial, a subscription keeps all premium features active for every grow you run.',
  },
  {
    q: 'Is my grow data safe and private?',
    a: 'Absolutely. Your photos, grow data, and personal information are encrypted and stored securely. We never sell your personal information to third parties. You are always in control of your data and can request full deletion at any time through the app settings or by emailing support@mastergrowbot.com.',
  },
  {
    q: 'How does the AI plant diagnosis feature work?',
    a: "Take a photo of any leaf, bud, or growth abnormality and MasterGrowbot AI's advanced vision AI analyzes it within seconds. The AI is trained on cannabis-specific cultivation data to identify nutrient deficiencies, pests, diseases, and environmental stress with high accuracy. Each diagnosis includes a step-by-step treatment plan matched to your current growth stage and growing medium.",
  },
  {
    q: 'Can I use MasterGrowbot AI for both indoor and outdoor grows?',
    a: 'Yes — MasterGrowbot AI is designed for all growing environments including indoor tents, greenhouses, and outdoor plots. Set up your grow profile with your environment details and the AI tailors all recommendations, feeding schedules, and task reminders specifically to your setup.',
  },
  {
    q: 'How do I manage or cancel my subscription?',
    a: 'Subscriptions are managed through the App Store (iOS) or Google Play (Android). Go to your device subscription settings to upgrade, downgrade, or cancel at any time. Cancellations take effect at the end of the current billing period so you keep access until then.',
  },
];

export default function Contact() {
  const [state, handleSubmit] = useForm('mrerazdy');

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col">
      <SEOHead
        title="Contact & Support | MasterGrowbot AI"
        description="Get support for MasterGrowbot AI. Email support@mastergrowbot.com for help with your iOS or Android cannabis growing app, subscriptions, and account questions."
        canonicalUrl="https://www.mastergrowbot.com/contact"
      />

      <LandingNav />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-16 font-sans">

        {/* App Identity */}
        <div className="text-center mb-12">
          <img
            src="/images/app-icon.png"
            alt="MasterGrowbot AI app icon"
            className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-lg"
            width={64}
            height={64}
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
            Contact & Support
          </h1>
          <p className="text-white/50 text-base">
            MasterGrowbot AI — AI Cannabis Cultivation Assistant
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <a
              href="https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=contact"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 text-xs text-white/50 hover:text-white/80 hover:border-white/30 transition-colors duration-200"
            >
              iOS App
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.mastergrowbot.app&utm_source=website&utm_medium=organic&utm_campaign=contact"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 text-xs text-white/50 hover:text-white/80 hover:border-white/30 transition-colors duration-200"
            >
              Android App
            </a>
          </div>
        </div>

        {/* Primary Email CTA */}
        <div className="text-center p-8 sm:p-10 bg-[#1a1e26] border border-landing-green/25 rounded-2xl mb-8 shadow-[0_0_40px_rgba(29,185,84,0.05)]">
          <p className="text-white/45 text-sm mb-3">Email us anytime</p>
          <a
            href="mailto:support@mastergrowbot.com"
            className="text-2xl sm:text-3xl font-bold text-landing-green hover:text-landing-green/80 transition-colors duration-200 break-all"
          >
            support@mastergrowbot.com
          </a>
          <p className="text-white/35 text-sm mt-4">
            We appreciate every single MasterGrowbot user and will respond to you as soon as possible. Thank you for your patience and support.
          </p>
        </div>

        {/* Quick info row */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="p-4 bg-[#1a1e26] border border-white/[0.06] rounded-xl text-center">
            <p className="text-white/35 text-xs mb-1">App</p>
            <p className="text-white text-sm font-semibold">MasterGrowbot AI</p>
          </div>
          <div className="p-4 bg-[#1a1e26] border border-white/[0.06] rounded-xl text-center">
            <p className="text-white/35 text-xs mb-1">Platforms</p>
            <p className="text-white text-sm font-semibold">iOS & Android</p>
          </div>
          <div className="p-4 bg-[#1a1e26] border border-white/[0.06] rounded-xl text-center">
            <p className="text-white/35 text-xs mb-1">Support</p>
            <p className="text-white text-sm font-semibold">Always Here</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-5">Send a Message</h2>

          {state.succeeded ? (
            <div className="p-6 bg-landing-green/10 border border-landing-green/30 rounded-xl text-center">
              <p className="text-landing-green font-semibold mb-1">Message sent!</p>
              <p className="text-white/50 text-sm">We'll get back to you at your email address within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5" htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1e26] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-landing-green/50 transition-colors"
                />
                <ValidationError field="name" errors={state.errors} className="text-red-400 text-xs mt-1 block" />
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-1.5" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1e26] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-landing-green/50 transition-colors"
                />
                <ValidationError field="email" errors={state.errors} className="text-red-400 text-xs mt-1 block" />
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-1.5" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Describe your issue or question..."
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1e26] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-landing-green/50 transition-colors resize-none"
                />
                <ValidationError field="message" errors={state.errors} className="text-red-400 text-xs mt-1 block" />
              </div>

              {/* Form-level errors (e.g. inactive form, blocked) */}
              {state.errors && state.errors.getFormErrors().length > 0 && (
                <p className="text-red-400 text-sm">
                  Something went wrong. Please email us directly at support@mastergrowbot.com.
                </p>
              )}

              <button
                type="submit"
                disabled={state.submitting}
                className="w-full py-3 rounded-xl bg-landing-green text-black font-semibold text-sm hover:bg-landing-green/90 disabled:opacity-50 transition-colors duration-200"
              >
                {state.submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-5">Common Questions</h2>
          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <div key={i} className="p-5 bg-[#1a1e26] border border-white/[0.06] rounded-xl">
                <p className="text-white font-medium text-sm mb-2">{item.q}</p>
                <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center p-6 bg-[#1a1e26] border border-white/[0.06] rounded-2xl">
          <div className="flex items-center justify-center gap-2 mb-1">
            <img src="/images/app-icon.png" alt="MasterGrowbot AI" className="w-5 h-5 rounded-md" width={20} height={20} />
            <span className="text-white text-sm font-semibold">MasterGrowbot AI</span>
          </div>
          <p className="text-white/40 text-xs mb-4">Your AI master grower, in your pocket. Free 3-day trial.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=contact"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-landing-green/10 border border-landing-green/25 text-landing-green text-xs font-semibold hover:bg-landing-green/20 transition-colors duration-200"
              onClick={() => { if (typeof gtag !== 'undefined') gtag('event', 'app_store_click', { link_url: 'https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060' }); }}
            >
              Download on App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.mastergrowbot.app&utm_source=website&utm_medium=organic&utm_campaign=contact"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-landing-green/10 border border-landing-green/25 text-landing-green text-xs font-semibold hover:bg-landing-green/20 transition-colors duration-200"
              onClick={() => { if (typeof gtag !== 'undefined') gtag('event', 'play_store_click', { link_url: 'https://play.google.com/store/apps/details?id=com.mastergrowbot.app' }); }}
            >
              Get it on Google Play
            </a>
          </div>
        </div>

      </main>

      <LandingFooter />
    </div>
  );
}
