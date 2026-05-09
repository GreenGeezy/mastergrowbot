import LandingFooter from '@/components/landing/LandingFooter';
import LandingNav from '@/components/landing/LandingNav';
import SEOHead from '@/components/SEOHead';

export default function Success() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex flex-col">
      <SEOHead
        title="Purchase Success | MasterGrowbot AI"
        description="Purchase confirmed. Access your IPM Playbook download from your email or Whop dashboard, then return to MasterGrowbot AI."
        canonicalUrl="https://www.mastergrowbot.com/success"
      />

      <LandingNav />

      <main className="flex-1 px-4 sm:px-6 py-20">
        <div className="max-w-3xl mx-auto rounded-2xl border border-landing-green/30 bg-[#1a1e26] p-8 sm:p-12 text-center shadow-[0_0_40px_rgba(29,185,84,0.08)]">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Purchase Successful! Your canopy is protected.</h1>
          <p className="text-white/75 leading-relaxed mb-8">
            Whop has securely sent the download link for The Master Cannabis IPM Playbook directly to your email inbox. You can also download it immediately from your Whop dashboard library.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-landing-green px-6 py-3 text-base font-semibold text-black hover:bg-landing-green/90 transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
