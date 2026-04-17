import { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import SEOHead from '@/components/SEOHead';

const FAQS = [
  {
    q: 'How do I cancel my subscription?',
    a: 'Subscriptions are managed through the App Store (iOS) or Google Play (Android). Go to your device subscription settings and cancel from there. Cancellations take effect at the end of the current billing period.',
  },
  {
    q: 'How do I delete my account and data?',
    a: 'Use the delete account option inside the app settings, or email support@mastergrowbot.com. All personal data is permanently removed within 30 days of a verified request.',
  },
  {
    q: 'I found a bug — how do I report it?',
    a: 'Email support@mastergrowbot.com with a description of the issue, your device model, and your iOS or Android version. Screenshots are always helpful and speed up our response.',
  },
  {
    q: 'How do I get a refund?',
    a: 'iOS refunds are handled by Apple at reportaproblem.apple.com. Android refunds are handled by Google Play. We are unable to process in-app purchase refunds directly.',
  },
];

export default function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xwpkqdkv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      setFormStatus(res.ok ? 'sent' : 'error');
    } catch {
      setFormStatus('error');
    }
  }

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
            We typically respond within 24 hours, Monday through Friday.
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
            <p className="text-white/35 text-xs mb-1">Response</p>
            <p className="text-white text-sm font-semibold">Within 24 hrs</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-5">Send a Message</h2>
          {formStatus === 'sent' ? (
            <div className="p-6 bg-landing-green/10 border border-landing-green/30 rounded-xl text-center">
              <p className="text-landing-green font-semibold mb-1">Message sent!</p>
              <p className="text-white/50 text-sm">We'll get back to you at your email address within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5" htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1e26] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-landing-green/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5" htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1e26] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-landing-green/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Describe your issue or question..."
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1e26] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-landing-green/50 transition-colors resize-none"
                />
              </div>
              {formStatus === 'error' && (
                <p className="text-red-400 text-sm">Something went wrong. Please email us directly at support@mastergrowbot.com.</p>
              )}
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full py-3 rounded-xl bg-landing-green text-black font-semibold text-sm hover:bg-landing-green/90 disabled:opacity-50 transition-colors duration-200"
              >
                {formStatus === 'sending' ? 'Sending…' : 'Send Message'}
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
