import LandingFooter from '@/components/landing/LandingFooter';
import LandingNav from '@/components/landing/LandingNav';
import SEOHead from '@/components/SEOHead';

const CHECKOUT_URL = 'https://whop.com/checkout/plan_Lsx5cbs9qj0J5';

export default function Playbooks() {
  return (
    <div className="min-h-screen bg-[#090d12] bg-[radial-gradient(circle_at_top_right,#153022_0%,#090d12_55%)] text-white flex flex-col">
      <SEOHead
        title="Cannabis IPM Playbook | MasterGrowbot AI"
        description="Stop crop losses fast with The Master Cannabis IPM Playbook. Buy now to download instantly and protect yield with battle-tested SOPs."
        canonicalUrl="https://www.mastergrowbot.com/playbooks"
        ogImage="https://www.mastergrowbot.com/images/ipm-cover.png"
      />

      <LandingNav />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-8">
            <img
              src="/images/ipm-cover.png"
              alt="The Master Cannabis IPM Playbook cover"
              className="w-full max-w-md mx-auto lg:mx-0 rounded-xl shadow-2xl border border-white/10"
              width={445}
              height={335}
            />
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
                PDF Download
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                Instant Delivery
              </span>
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
                Battle-Tested SOPs
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              The Master Cannabis IPM Playbook
            </h1>
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
              Stop crop losses fast with the same integrated pest management protocols used by top commercial growers. This is the definitive field guide to identifying, preventing, and eradicating the pests and pathogens that destroy harvests.
            </p>

            <ul className="space-y-3 text-white/70">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-green-500 shrink-0" />
                <span>Step-by-step identification charts for mites, thrips, aphids, mold, and root rot</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-green-500 shrink-0" />
                <span>Organic and synthetic treatment calendars with exact dilution rates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-green-500 shrink-0" />
                <span>Prevention checklists and environmental controls to stop outbreaks before they start</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-green-500 shrink-0" />
                <span>Compatible with the MasterGrowbot AI mobile app for real-time diagnosis</span>
              </li>
            </ul>

            <div className="pt-4">
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-landing-green px-8 py-4 text-lg font-bold text-black hover:bg-landing-green/90 transition-colors shadow-lg shadow-green-500/20"
              >
                Buy Now — Instant Access
              </a>
              <p className="mt-3 text-sm text-white/50">
                Secure checkout powered by Whop. Instant digital delivery.
              </p>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
