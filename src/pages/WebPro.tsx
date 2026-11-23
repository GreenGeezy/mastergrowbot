import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight, Lock, Smartphone } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { realReports } from '@/components/landing/RealReports';
import { AppPlatformButtons } from '@/components/landing/cta';
import { appStoreUrl, playStoreUrl } from '@/components/landing/ctaLinks';
import { trackEvent } from '@/lib/analytics';
import {
  ANNUAL_PER_MONTH, ANNUAL_SAVING_PERCENT, availablePlans, PLANS, rememberPlan, SUPPORT_EMAIL, WEB_PRO_URL, webProLive, WEEKLY_PHOTO_REPORTS, type PlanKey,
} from '@/lib/webPro';

// Sign-in and checkout code loads only when a visitor asks for it, so this page stays fast.
const WebProAccount = lazy(() => import('@/components/web-pro/WebProAccount'));
const EliteWaitlist = lazy(() => import('@/components/web-pro/EliteWaitlist'));

const SYNC_NOTE = 'MasterGrowbot Web Pro gives you full browser access today. 1-tap iOS and Android sync is planned for a future mobile update.';

const faqItems = [
  {
    name: 'Is Web Pro the same as the MasterGrowbot AI app subscription?',
    text: 'No. Web Pro works in your browser and the app subscription works in the app, so each is bought separately today. 1-tap iOS and Android sync is planned for a future mobile update.',
  },
  {
    name: 'I already pay for the app. Do I need Web Pro?',
    text: 'No. Keep using the app. Web Pro is for growers who want photo reports and saved grow numbers on a computer. It does not change or replace an app subscription.',
  },
  {
    name: 'How many plant photo reports do I get?',
    text: `Up to ${WEEKLY_PHOTO_REPORTS} photo reports every week. Saved numbers and checklists do not count toward that limit.`,
  },
  {
    name: 'How do I cancel Web Pro?',
    text: 'Open Account inside Web Pro and choose Manage or cancel subscription. It opens your Whop billing page, where you can cancel anytime and keep access until the end of the period you paid for.',
  },
  {
    name: 'What happens to my photos?',
    text: 'Your photo is resized in your browser, which also removes its location details, then sent for the report. A small preview is saved with the report in your account, and you can delete it anytime.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.name, acceptedAnswer: { '@type': 'Answer', text: item.text } })),
};
const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.mastergrowbot.com/' },
    { '@type': 'ListItem', position: 2, name: 'Web Pro', item: WEB_PRO_URL },
  ],
};

const FEATURES = [
  `Up to ${WEEKLY_PHOTO_REPORTS} AI plant photo reports every week`,
  'A first action and fix steps in every report',
  'Saved VPD, light and grow week numbers',
  'Grow checklists and printable reports',
];

/** A failed download of the account code should never blank the page. */
class AccountBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="mx-auto max-w-lg rounded-3xl border border-white/15 bg-[#070b08] p-8 text-center font-sans">
        <p className="font-semibold text-white">This section did not load.</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-4 h-12 rounded-full bg-landing-green px-6 font-bold text-black">Reload</button>
        <p className="mt-4 text-sm text-white/65">Still stuck? Email {SUPPORT_EMAIL}.</p>
      </div>
    );
  }
}

const Spinner = () => (
  <div role="status" className="mx-auto flex min-h-[420px] w-full max-w-lg items-center justify-center rounded-3xl border border-white/15 bg-[#070b08]">
    <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-landing-green" aria-hidden="true" /><span className="sr-only">Loading</span>
  </div>
);

function PriceCard({ plan, onPlan, onStart }: { plan: PlanKey; onPlan: (plan: PlanKey) => void; onStart: () => void }) {
  const info = PLANS[plan];
  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl border border-landing-green/30 bg-[#070b08] p-5 font-sans shadow-[0_30px_90px_-30px_rgba(29,185,84,0.45)] sm:p-8">
      <p className="text-sm font-semibold text-white">MasterGrowbot Web Pro</p>
      {availablePlans.length > 1 && (
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-white/[0.06] p-1" role="group" aria-label="Choose a plan">
          {availablePlans.map((key) => (
            <button key={key} type="button" aria-pressed={key === plan} onClick={() => onPlan(key)} className={`flex min-h-12 flex-wrap items-center justify-center gap-x-2 rounded-xl px-2 text-sm font-semibold transition ${key === plan ? 'bg-white text-black' : 'text-white/75 hover:text-white'}`}>
              {PLANS[key].label}
              {key === 'annual' && <span className={`text-xs font-bold ${key === plan ? 'text-[#0c6b30]' : 'text-landing-green'}`}>Save {ANNUAL_SAVING_PERCENT}%</span>}
            </button>
          ))}
        </div>
      )}
      <p className="mt-6 flex items-end gap-2"><span className="text-5xl font-bold tracking-tight text-white">{info.display}</span><span className="pb-1.5 text-white/65">a {info.per}</span></p>
      <p className="mt-1.5 min-h-5 text-sm text-landing-green">{plan === 'annual' ? `That is $${ANNUAL_PER_MONTH} a month` : 'Pay month to month'}</p>
      <ul className="mt-6 space-y-3">
        {FEATURES.map((feature) => <li key={feature} className="flex gap-3 text-[15px] leading-snug text-white/85"><Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-landing-green" aria-hidden="true" />{feature}</li>)}
      </ul>
      <button type="button" onClick={onStart} className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-landing-green text-base font-bold text-black shadow-[0_0_32px_rgba(29,185,84,0.3)] transition hover:bg-landing-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-landing-green">
        Start Web Pro <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>
      <p className="mt-4 text-center text-xs leading-relaxed text-white/65">{info.terms} Cancel anytime.</p>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-white/65"><Lock className="h-3.5 w-3.5" aria-hidden="true" /> Secure checkout by Whop</p>
      <button type="button" onClick={onStart} className="mt-2 min-h-11 w-full text-sm font-semibold text-white/75 underline-offset-4 hover:text-white hover:underline">Already subscribed? Sign in</button>
    </div>
  );
}

function ExampleReport({ report, className }: { report: (typeof realReports)[number]; className: string }) {
  return (
    <div className={`mt-8 grid gap-6 lg:grid-cols-2 ${className}`}>
      <img src={report.image} alt={report.alt} width={1448} height={1086} loading="lazy" decoding="async" className="h-full w-full rounded-3xl border border-white/10 object-cover" />
      <div className="rounded-3xl border border-landing-green/25 bg-landing-green/[0.06] p-6 font-sans sm:p-8">
        <p className="text-xl font-bold leading-snug text-white">{report.diagnosis}</p>
        <p className="mt-2 text-sm text-white/70">Health {report.healthScore}, confidence {report.confidence}%, {report.growthStage.toLowerCase()} stage</p>
        <p className="mt-5 text-sm font-semibold text-landing-green">Do this first</p>
        <p className="mt-1.5 font-semibold leading-snug text-white">{report.topAction}</p>
        <ol className="mt-5 space-y-3">
          {report.steps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-relaxed text-white/80"><span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold" aria-hidden="true">{index + 1}</span>{step}</li>)}
        </ol>
        <p className="mt-5 text-xs leading-relaxed text-white/60">Actual MasterGrowbot AI report for this photo, generated November 2026. Guidance from a photo, not a lab test. Results vary with the photo.</p>
      </div>
    </div>
  );
}

/** On phones the app comes first; on computers it sits under the price. During checkout it never moves ahead of the form. */
function AppNote({ location, first }: { location: string; first: boolean }) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  useEffect(() => {
    const ua = navigator.userAgent;
    setPlatform(/iPhone|iPad|iPod/i.test(ua) ? 'ios' : /Android/i.test(ua) ? 'android' : 'other');
  }, []);
  const linkClass = 'font-semibold text-landing-green hover:underline';
  return (
    <div className={`mx-auto flex w-full max-w-lg items-start gap-3 rounded-2xl ${first ? 'order-first mb-4 lg:order-none lg:mb-0 lg:mt-4' : 'mt-4'} border border-white/15 bg-white/[0.04] p-4 font-sans text-sm leading-relaxed text-white/75`}>
      <Smartphone className="mt-0.5 h-5 w-5 flex-shrink-0 text-landing-green" aria-hidden="true" />
      <p>
        Growing from your phone? Get MasterGrowbot AI, with a free 3-day trial for eligible new Pro subscribers:{' '}
        {platform !== 'android' && <a href={appStoreUrl('web-pro')} data-cta-location={`${location}:ios`} className={linkClass}>iPhone app</a>}
        {platform === 'other' && ' or '}
        {platform !== 'ios' && <a href={playStoreUrl('web-pro')} data-cta-location={`${location}:android`} className={linkClass}>Android app</a>}.
      </p>
    </div>
  );
}

export default function WebPro() {
  const [plan, setPlan] = useState<PlanKey>(availablePlans[0] ?? 'annual');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const report = realReports[0];

  // Returning buyers and anyone coming back from sign-in or payment go straight to their account.
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    let hasSession = false;
    try { hasSession = Boolean(localStorage.getItem('sb-vofwdhlwsahwxecewyek-auth-token')); } catch { /* storage blocked */ }
    if (hasSession || window.location.hash === '#account' || query.has('payment') || query.has('status')) setOpen(true);
    trackEvent('web_pro_view');
  }, []);

  const start = (location: string) => {
    trackEvent('web_pro_start', { plan, cta_location: location });
    rememberPlan(plan);
    setOpen(true);
    requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const choose = (next: PlanKey) => { setPlan(next); rememberPlan(next); };

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <SEOHead
        title="Web Pro: Plant Photo Reports Online | MasterGrowbot AI"
        description="Get AI cannabis plant photo reports in your browser, with saved VPD, light and grow week numbers. Start Web Pro, or try the MasterGrowbot AI app free."
        canonicalUrl={WEB_PRO_URL}
      />
      <Helmet>
        {!webProLive && <meta name="robots" content="noindex,follow" />}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <LandingNav />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 font-sans text-sm text-white/60">
          <Link to="/" className="hover:text-white">Home</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><span>Web Pro</span>
        </nav>

        <section className={active ? '' : 'grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14'}>
          <div className={active ? 'sr-only' : 'lg:pt-6'}>
            <p className="font-sans text-sm font-semibold text-landing-green">For your computer</p>
            <h1 className="mt-3 font-sans text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">Plant photo reports, in your browser</h1>
            <p className="mt-5 max-w-xl font-sans text-lg leading-relaxed text-white/75">Upload a photo of your cannabis plant. Get a health score, the most likely issue, what to do first and the steps to fix it, saved to your account.</p>
            {!active && (
              <figure className="mt-8 hidden overflow-hidden rounded-3xl border border-white/10 lg:block">
                <img src={report.image} alt={report.alt} width={1448} height={1086} className="aspect-[16/9] w-full object-cover" />
                <figcaption className="flex items-center justify-between gap-4 bg-white/[0.04] px-5 py-4 font-sans">
                  <span><span className="block text-xs text-white/60">Actual MasterGrowbot AI report for this photo</span><span className="mt-1 block font-semibold text-white">{report.diagnosis}</span></span>
                  <span className="text-right"><span className="block text-2xl font-bold text-orange-300">{report.healthScore}</span><span className="text-xs text-white/60">Health</span></span>
                </figcaption>
              </figure>
            )}
          </div>

          <div id="account" ref={panel} className="flex scroll-mt-24 flex-col">
            {!webProLive ? (
              <div className="mx-auto w-full max-w-lg rounded-3xl border border-white/15 bg-[#070b08] p-6 text-center font-sans sm:p-8">
                <h2 className="font-sans text-2xl font-bold">Web Pro is opening soon</h2>
                <p className="mt-3 leading-relaxed text-white/70">Plant photo reports are ready today in the MasterGrowbot AI app. Eligible new Pro subscribers can try 3 days free.</p>
                <AppPlatformButtons campaign="web-pro" location="web-pro-soon" className="pt-5" />
              </div>
            ) : open ? (
              <AccountBoundary><Suspense fallback={<Spinner />}><WebProAccount plan={plan} onPlan={setPlan} onActive={setActive} /></Suspense></AccountBoundary>
            ) : (
              <PriceCard plan={plan} onPlan={choose} onStart={() => start('web-pro-hero')} />
            )}
            {webProLive && !active && <AppNote location="web-pro-hero" first={!open} />}
          </div>
        </section>

        {!active && (
          <>
            <section className="mt-20 sm:mt-28" aria-labelledby="web-pro-report">
              <h2 id="web-pro-report" className="max-w-2xl font-sans text-3xl font-bold tracking-tight sm:text-4xl">One photo in. A clear plan out.</h2>
              {/* Computers already see the leaf report above, so they get the healthy plant here. */}
              <ExampleReport report={report} className="lg:hidden" />
              <ExampleReport report={realReports[1]} className="hidden lg:grid" />
            </section>

            <section className="mt-20 sm:mt-28" aria-labelledby="web-or-app">
              <h2 id="web-or-app" className="font-sans text-3xl font-bold tracking-tight sm:text-4xl">Web Pro or the app?</h2>
              <p className="mt-3 max-w-2xl font-sans leading-relaxed text-white/70">{SYNC_NOTE}</p>
              <div className="mt-8 grid gap-5 font-sans md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <h3 className="font-sans text-xl font-bold">The app is best in the grow room</h3>
                  <p className="mt-3 leading-relaxed text-white/75">Snap a photo beside your plant, keep a grow journal, get daily tasks and look up strains. Free 3-day trial for eligible new Pro subscribers.</p>
                  <AppPlatformButtons campaign="web-pro" location="web-pro-compare" className="pt-6 sm:!flex-col sm:!items-stretch" />
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <h3 className="font-sans text-xl font-bold">Web Pro is best at your desk</h3>
                  <p className="mt-3 leading-relaxed text-white/75">Upload photos from any computer, save VPD, light and grow week numbers, work through checklists and print reports.</p>
                  {webProLive && !open && <button type="button" onClick={() => start('web-pro-compare')} className="mt-6 inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 font-semibold transition hover:border-landing-green">Start Web Pro <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>}
                </div>
              </div>
            </section>

            <section className="mx-auto mt-20 max-w-3xl sm:mt-28" aria-labelledby="web-pro-faq">
              <h2 id="web-pro-faq" className="font-sans text-3xl font-bold tracking-tight sm:text-4xl">Web Pro questions</h2>
              <div className="mt-6 divide-y divide-white/10 border-y border-white/10 font-sans">
                {faqItems.map((item) => (
                  <details key={item.name} className="group">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">{item.name}<ChevronRight className="h-5 w-5 flex-shrink-0 text-landing-green transition group-open:rotate-90" aria-hidden="true" /></summary>
                    <p className="pb-5 leading-relaxed text-white/75">{item.text}</p>
                  </details>
                ))}
              </div>
              <p className="mt-6 font-sans text-sm text-white/70">
                Free to use, no sign in: <Link to="/vpd-calculator" className="text-landing-green hover:underline">VPD calculator</Link>, <Link to="/cannabis-symptom-checker" className="text-landing-green hover:underline">symptom checker</Link> and <Link to="/grow-guides" className="text-landing-green hover:underline">cannabis grow guides</Link>.
              </p>
              {webProLive && (
                <details className="mt-10 font-sans text-sm text-white/55" onToggle={() => setTeamOpen(true)}>
                  <summary className="cursor-pointer py-2 hover:text-white/80">Running a commercial team?</summary>
                  <div className="mt-3">{teamOpen && <Suspense fallback={null}><EliteWaitlist /></Suspense>}</div>
                </details>
              )}
            </section>
          </>
        )}
      </main>
      <LandingFooter />
    </div>
  );
}
