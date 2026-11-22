import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, Copy, Check } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { AppPlatformButtons } from '@/components/landing/cta';
import { appStoreUrl, playStoreUrl } from '@/components/landing/ctaLinks';

// ─── Types and constants ──────────────────────────────────────────────────────

type Stage = 'seedling' | 'vegetative' | 'flower';
type Mode = 'ppfd' | 'estimate';
type Fixture = 'ledBar' | 'ledBoard' | 'ledOld' | 'hps' | 'cmh';

const STAGE_ORDER: Stage[] = ['seedling', 'vegetative', 'flower'];

const STAGES: Record<Stage, { label: string; dliMin: number; dliMax: number; ppfd: string; hours: number }> = {
  seedling:   { label: 'Seedlings and clones', dliMin: 10, dliMax: 20, ppfd: '150 to 300', hours: 18 },
  vegetative: { label: 'Vegetative',           dliMin: 25, dliMax: 40, ppfd: '400 to 600', hours: 18 },
  flower:     { label: 'Flower',               dliMin: 35, dliMax: 45, ppfd: '800 to 1,050', hours: 12 },
};

/** Typical photon efficacy in micromoles per joule. Real fixtures vary: check the spec sheet. */
const FIXTURES: Record<Fixture, { label: string; efficacy: number }> = {
  ledBar:   { label: 'LED bar light (newer)',   efficacy: 2.7 },
  ledBoard: { label: 'LED quantum board',       efficacy: 2.5 },
  ledOld:   { label: 'Older purple LED',        efficacy: 1.5 },
  hps:      { label: 'HPS',                     efficacy: 1.7 },
  cmh:      { label: 'CMH / LEC',               efficacy: 1.5 },
};

const TENTS = [
  { label: '2x2 ft', sqft: 4 },
  { label: '2x4 ft', sqft: 8 },
  { label: '3x3 ft', sqft: 9 },
  { label: '4x4 ft', sqft: 16 },
  { label: '5x5 ft', sqft: 25 },
];

/** Share of emitted light that reaches the canopy in a reflective tent. An estimate, not a measurement. */
const CANOPY_CAPTURE = 0.85;
const SQFT_TO_M2 = 0.0929;

const CHART_PPFD = [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100];
const CHART_HOURS = [12, 14, 16, 18, 20, 24];

const APP_STORE_URL = appStoreUrl('grow-light-calculator');
const PLAY_STORE_URL = playStoreUrl('grow-light-calculator');

const dli = (ppfd: number, hours: number) => (ppfd * hours * 3600) / 1_000_000;
const nearest = (list: number[], value: number) => list.reduce((a, b) => (Math.abs(b - value) < Math.abs(a - value) ? b : a));

// ─── Schema ───────────────────────────────────────────────────────────────────

const faqItems = [
  {
    name: 'What is DLI for cannabis?',
    text: 'DLI means daily light integral. It is the total amount of usable light a plant receives in one day, measured in moles per square meter per day. It combines how bright the light is (PPFD) with how many hours it runs, so it is the fairest way to compare an 18 hour veg schedule with a 12 hour flower schedule.',
  },
  {
    name: 'How do I calculate DLI from PPFD?',
    text: 'Multiply PPFD by the hours of light per day, then multiply by 0.0036. For example, 900 PPFD for 12 hours is 900 x 12 x 0.0036 = 38.9 mol per square meter per day. The grow light calculator on this page does the math for you and compares the result to a target range for your growth stage.',
  },
  {
    name: 'What PPFD does cannabis need in flower?',
    text: 'Most photoperiod cannabis does well at 800 to 1,050 PPFD across the canopy in flower on a 12 hour schedule without added CO2. Seedlings and clones need far less, around 150 to 300, and plants in veg usually sit at 400 to 600. Raise intensity in steps and watch the top leaves for bleaching or tacoing.',
  },
  {
    name: 'Can I work out PPFD from watts?',
    text: 'Only roughly. Watts measure the power a light draws, not the light that reaches the leaves. This calculator estimates average PPFD from actual wall watts, the fixture type and your tent size. For a real number, use a PAR meter or the PPFD map from the light maker at your hanging height.',
  },
  {
    name: 'How many watts do I need for a 4x4 grow tent?',
    text: 'With a newer LED bar light, roughly 500 to 700 actual watts covers a 4x4 foot flowering canopy at 800 to 1,050 PPFD. Older or less efficient lights need more watts for the same result. Enter your light and tent in the calculator to see an estimate for your setup.',
  },
  {
    name: 'Can MasterGrowbot AI help me dial in my light?',
    text: 'Yes. MasterGrowbot AI lets you photograph the canopy and get a plant health report that flags signs of light stress, such as bleached tops and upward leaf curl, and it keeps your light settings in the grow journal. Download MasterGrowbot AI free. Eligible new Pro subscribers can try 3 days free.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.name,
    acceptedAnswer: { '@type': 'Answer', text: item.text },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.mastergrowbot.com/' },
    { '@type': 'ListItem', position: 2, name: 'Grow Light Calculator', item: 'https://www.mastergrowbot.com/grow-light-calculator' },
  ],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Grow Light Calculator: Free DLI and PPFD Calculator for Cannabis',
  description: 'Calculate daily light integral (DLI) from PPFD and light hours, or estimate PPFD from light wattage and tent size, with target ranges by cannabis growth stage.',
  url: 'https://www.mastergrowbot.com/grow-light-calculator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Organization', name: 'MasterGrowbot AI', url: 'https://www.mastergrowbot.com' },
};

// ─── Component ────────────────────────────────────────────────────────────────

const labelClass = 'text-xs font-semibold uppercase tracking-wider text-white/40 font-sans';
const numberInputClass = 'w-20 bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center font-sans focus:outline-none focus:border-landing-green/50';

export default function GrowLightCalculator() {
  const [stage, setStage] = useState<Stage>('flower');
  const [mode, setMode] = useState<Mode>('ppfd');
  const [ppfdInput, setPpfdInput] = useState(900);
  const [hours, setHours] = useState(12);
  const [watts, setWatts] = useState(600);
  const [fixture, setFixture] = useState<Fixture>('ledBar');
  const [tentSqft, setTentSqft] = useState(16);
  const [copied, setCopied] = useState(false);

  const stageConfig = STAGES[stage];
  const estimatedPpfd = Math.round((watts * FIXTURES[fixture].efficacy * CANOPY_CAPTURE) / (tentSqft * SQFT_TO_M2));
  const ppfd = mode === 'ppfd' ? ppfdInput : estimatedPpfd;
  const dailyLight = dli(ppfd, hours);

  const withinRange = dailyLight >= stageConfig.dliMin && dailyLight <= stageConfig.dliMax;
  const tooLow = dailyLight < stageConfig.dliMin;
  const close = !withinRange && (tooLow ? dailyLight >= stageConfig.dliMin * 0.85 : dailyLight <= stageConfig.dliMax * 1.15);
  const statusKey = withinRange ? 'green' : close ? 'yellow' : 'red';
  const statusLabel = withinRange ? 'On target' : tooLow ? (close ? 'A little low' : 'Too low') : close ? 'A little high' : 'Too high';

  const colorMap = {
    green:  { text: 'text-landing-green', badge: 'bg-landing-green/10 border-landing-green/30 text-landing-green', card: 'border-landing-green/20 bg-landing-green/5' },
    yellow: { text: 'text-yellow-400',     badge: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400',          card: 'border-yellow-400/20 bg-yellow-400/5' },
    red:    { text: 'text-red-400',        badge: 'bg-red-400/10 border-red-400/30 text-red-400',                  card: 'border-red-400/20 bg-red-400/5' },
  } as const;
  const colors = colorMap[statusKey];

  const stageNameLower = stageConfig.label.toLowerCase();
  const targetDli = tooLow ? stageConfig.dliMin : stageConfig.dliMax;
  const targetPpfd = Math.round((targetDli * 1_000_000) / (hours * 3600) / 10) * 10;
  const targetHours = Math.min(24, Math.max(1, Math.round(((targetDli * 1_000_000) / (ppfd * 3600)) * 2) / 2));
  const dimPercent = Math.round((targetPpfd / ppfd) * 100);

  const verdict = withinRange
    ? `Your daily light is in the target range for ${stageNameLower}. Hold it steady and watch the top leaves.`
    : tooLow
    ? `Your plants are getting less light per day than ${stageNameLower} can use. Growth will be slower and stretchier than it needs to be.`
    : `Your plants are getting more light per day than ${stageNameLower} usually needs. Watch for bleached tops and leaf edges curling up.`;

  const primaryFix = tooLow
    ? `Raise canopy PPFD to about ${targetPpfd} at ${hours} hours`
    : `Lower canopy PPFD to about ${targetPpfd} at ${hours} hours (dim to roughly ${dimPercent}% or raise the light)`;
  const altFix = stage === 'flower'
    ? 'Keep photoperiod plants at 12 hours in flower. Change intensity, not hours.'
    : `Or keep ${ppfd} PPFD and run the light about ${targetHours} hours a day`;

  const gaugeMax = 65;
  const pct = (value: number) => `${(Math.min(value, gaugeMax) / gaugeMax) * 100}%`;

  const handleCopy = () => {
    const text = `My grow light: ${dailyLight.toFixed(1)} DLI (${statusLabel}) | ${stageConfig.label} | ${ppfd} PPFD x ${hours} h | Calculated with MasterGrowbot AI - mastergrowbot.com/grow-light-calculator`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SEOHead
        title="Grow Light Calculator: Free DLI and PPFD | MasterGrowbot AI"
        description="Free grow light calculator for cannabis. Turn PPFD or light watts into DLI, check your stage target, then track your canopy in the MasterGrowbot AI app."
        canonicalUrl="https://www.mastergrowbot.com/grow-light-calculator"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>

      <LandingNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/40 font-sans mb-8 flex-wrap">
          <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-white/60">Grow Light Calculator</span>
        </nav>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <header className="mb-8 space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-landing-green/30 bg-landing-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-landing-green font-sans">
            Free tool. No signup. Works on your phone.
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white font-sans">
            Grow Light Calculator: Free DLI and PPFD Calculator for Cannabis
          </h1>
          <p className="text-base sm:text-lg text-white/60 font-sans max-w-2xl leading-relaxed">
            Find out if your plants are getting too little, too much, or the right amount of light each day. Enter your PPFD, or your light watts and tent size, and get your DLI with a clear target for your growth stage.
          </p>
          <p className="text-sm text-white/40 font-sans">
            See how your canopy responds to the light with a photo health report in{' '}
            <a href={APP_STORE_URL} data-cta-location="light-hero-text:ios" className="text-landing-green hover:underline">MasterGrowbot AI for iOS</a>{' '}
            or{' '}
            <a href={PLAY_STORE_URL} data-cta-location="light-hero-text:android" className="text-landing-green hover:underline">Android</a>. Eligible new Pro subscribers can try 3 days free.
          </p>
        </header>

        <section aria-labelledby="light-quick-answer" className="mb-10 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-landing-green font-sans mb-3">Quick answer</p>
          <h2 id="light-quick-answer" className="text-lg sm:text-xl font-bold text-white font-sans mb-3">
            DLI = PPFD x hours of light x 0.0036
          </h2>
          <p className="text-sm sm:text-base text-white/65 leading-relaxed font-sans">
            Good starting targets for cannabis are 10 to 20 DLI for seedlings and clones, 25 to 40 in veg, and 35 to 45 in flower without added CO2. A flowering canopy at 900 PPFD for 12 hours receives 38.9 DLI, which is on target.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-sans">
            <Link to="/vpd-calculator" className="text-landing-green hover:underline">VPD calculator</Link>
            <Link to="/grow-guides/cannabis-led-grow-lights" className="text-landing-green hover:underline">LED grow lights guide</Link>
            <Link to="/grow-guides/cannabis-light-schedules" className="text-landing-green hover:underline">Cannabis light schedules</Link>
            <a href="#dli-chart" className="text-landing-green hover:underline">Jump to the DLI chart</a>
          </div>
        </section>

        {/* ── CALCULATOR CARD ───────────────────────────────────────────── */}
        <div className="rounded-2xl border border-landing-green/20 bg-gradient-to-b from-landing-green/[0.06] to-transparent p-5 sm:p-8 mb-14 shadow-[0_0_60px_-15px_rgba(74,222,128,0.15)]">
          <div className="mb-7">
            <p className={`${labelClass} mb-3`}>Growth stage</p>
            <div className="flex flex-wrap gap-2">
              {STAGE_ORDER.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setStage(s); setHours(STAGES[s].hours); }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium font-sans transition-all ${
                    stage === s ? 'bg-landing-green text-black' : 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1] hover:text-white'
                  }`}
                >
                  {STAGES[s].label}
                  <span className="ml-1.5 text-xs opacity-60">{STAGES[s].dliMin} to {STAGES[s].dliMax} DLI</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <p className={`${labelClass} mb-2.5`}>What do you know about your light?</p>
                <div className="flex gap-2">
                  {([['ppfd', 'I know my PPFD'], ['estimate', 'Estimate from watts']] as [Mode, string][]).map(([m, label]) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium font-sans transition-all ${
                        mode === m ? 'bg-white/[0.12] text-white border border-white/25' : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/80 border border-transparent'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {mode === 'ppfd' ? (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className={labelClass}>PPFD at the canopy</p>
                    <span className="text-xs text-white/35 font-sans">µmol/m²/s</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="range" min={50} max={1500} step={10} value={ppfdInput} onChange={(e) => setPpfdInput(Number(e.target.value))} className="flex-1 accent-landing-green" aria-label="PPFD at the canopy" />
                    <input type="number" min={50} max={1500} value={ppfdInput} onChange={(e) => setPpfdInput(clamp(Number(e.target.value), 50, 1500))} className={numberInputClass} aria-label="PPFD value" />
                  </div>
                  <p className="mt-2 text-xs text-white/35 font-sans leading-relaxed">Use a PAR meter reading or the PPFD map from your light maker at your hanging height.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <p className={`${labelClass} mb-2.5`}>Light type</p>
                    <select value={fixture} onChange={(e) => setFixture(e.target.value as Fixture)} className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white font-sans focus:outline-none focus:border-landing-green/50" aria-label="Light type">
                      {(Object.keys(FIXTURES) as Fixture[]).map((f) => (
                        <option key={f} value={f} className="bg-zinc-900">{FIXTURES[f].label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <p className={labelClass}>Actual watts from the wall</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="range" min={30} max={1200} step={10} value={watts} onChange={(e) => setWatts(Number(e.target.value))} className="flex-1 accent-landing-green" aria-label="Light wattage" />
                      <input type="number" min={30} max={1200} value={watts} onChange={(e) => setWatts(clamp(Number(e.target.value), 30, 1200))} className={numberInputClass} aria-label="Watts value" />
                    </div>
                  </div>
                  <div>
                    <p className={`${labelClass} mb-2.5`}>Tent or canopy size</p>
                    <div className="flex flex-wrap gap-2">
                      {TENTS.map((t) => (
                        <button
                          key={t.label}
                          type="button"
                          onClick={() => setTentSqft(t.sqft)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium font-sans transition-all ${
                            tentSqft === t.sqft ? 'bg-white/[0.14] text-white border border-white/25' : 'bg-white/[0.05] text-white/55 hover:bg-white/[0.1] border border-transparent'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/35 font-sans leading-relaxed">
                    Estimated average PPFD: <span className="text-white/70 font-semibold">{estimatedPpfd}</span>. This is a rough guide based on typical efficiency for this light type. A PAR meter is more accurate.
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className={labelClass}>Hours of light per day</p>
                  <span className="text-sm font-semibold text-white font-sans">{hours} h</span>
                </div>
                <input type="range" min={8} max={24} step={0.5} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-landing-green" aria-label="Hours of light per day" />
                <div className="flex justify-between text-xs text-white/25 font-sans mt-1.5">
                  <span>8 h</span>
                  <span>24 h</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${colors.card}`}>
              <div className="text-center pb-2">
                <p className={`${labelClass} mb-2`}>Daily light integral</p>
                <p className={`text-7xl font-bold font-sans tracking-tight leading-none ${colors.text}`}>{dailyLight.toFixed(1)}</p>
                <p className="text-base text-white/40 font-sans mt-1">DLI (mol/m²/day)</p>
                <p className="text-xs text-white/25 font-sans mt-2">{ppfd} PPFD for {hours} hours</p>
              </div>

              <div className="flex items-center justify-center">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold font-sans border ${colors.badge}`}>{statusLabel}</span>
              </div>

              <p className="text-xs text-white/35 font-sans text-center">
                Target for {stageNameLower}: {stageConfig.dliMin} to {stageConfig.dliMax} DLI
              </p>

              <div aria-hidden="true" className="px-1">
                <div className="relative h-2.5 rounded-full bg-white/[0.08]">
                  <div className="absolute inset-y-0 rounded-full bg-landing-green/45" style={{ left: pct(stageConfig.dliMin), width: `${((stageConfig.dliMax - stageConfig.dliMin) / gaugeMax) * 100}%` }} />
                  <div className="absolute top-1/2 h-5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)] transition-[left] duration-200" style={{ left: pct(dailyLight) }} />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-white/30 font-sans">
                  <span>0 (dim)</span>
                  <span>30</span>
                  <span>65 DLI (intense)</span>
                </div>
              </div>

              <p className="text-sm text-white/70 font-sans text-center leading-relaxed border-t border-white/[0.07] pt-4">{verdict}</p>

              {!withinRange && (
                <div className="space-y-2.5 border-t border-white/[0.07] pt-4">
                  <p className={labelClass}>Easiest fix</p>
                  <p className="text-sm font-semibold text-white font-sans leading-snug">{primaryFix}</p>
                  <p className="text-xs text-white/35 font-sans">{altFix}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/50 hover:text-white text-sm font-sans transition-all border border-white/[0.07]"
              >
                {copied ? <><Check className="w-4 h-4 text-landing-green" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Results</>}
              </button>
            </div>
          </div>

          {/* Result-aware app CTA */}
          <div className="mt-7 rounded-2xl border border-landing-green/25 bg-black/40 p-5 sm:p-6 text-center">
            <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
              {withinRange ? 'Light on target. Now see how the canopy is taking it.' : 'Light off target? Check your top leaves for stress.'}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-white/65 font-sans leading-relaxed">
              {withinRange
                ? 'Snap a photo of your canopy in MasterGrowbot AI for a plant health report, and save your light settings in the grow journal so you can repeat a good run.'
                : 'Snap a photo of your top leaves in MasterGrowbot AI to check for bleaching, stretch or curl, then log the light change in your grow journal.'}
            </p>
            <AppPlatformButtons campaign="grow-light-calculator" location="light-calculator-results" className="pt-4" />
            <p className="mt-3 text-xs text-white/40 font-sans">Free download. Eligible new Pro subscribers can try 3 days free.</p>
          </div>
        </div>

        {/* ── DLI CHART ─────────────────────────────────────────────────── */}
        <section id="dli-chart" className="mb-16 scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-2">DLI Chart: PPFD vs Hours of Light</h2>
          <p className="text-sm sm:text-base text-white/60 font-sans leading-relaxed mb-4 max-w-2xl">
            This DLI chart redraws for the growth stage you picked above. Green cells are inside the {stageNameLower} target of {stageConfig.dliMin} to {stageConfig.dliMax} DLI. The outlined cell is closest to your setup.
          </p>
          <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/55 font-sans">
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-sky-500/50" /> Too little light</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-landing-green/70" /> On target</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-red-500/55" /> Too much light</span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
            <table className="w-full min-w-[560px] border-separate border-spacing-[3px] p-2 text-center text-xs font-sans">
              <caption className="sr-only">Cannabis DLI chart by PPFD and hours of light per day for the {stageNameLower} stage</caption>
              <thead>
                <tr>
                  <th scope="col" className="px-2 py-2 text-left font-semibold text-white/45">Hours / PPFD</th>
                  {CHART_PPFD.map((p) => (
                    <th key={p} scope="col" className="px-1 py-2 font-semibold text-white/60">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHART_HOURS.map((h) => (
                  <tr key={h}>
                    <th scope="row" className="px-2 py-2 text-left font-semibold text-white/60">{h} h</th>
                    {CHART_PPFD.map((p) => {
                      const v = dli(p, h);
                      const tone = v >= stageConfig.dliMin && v <= stageConfig.dliMax
                        ? 'bg-landing-green/70 text-black font-semibold'
                        : v < stageConfig.dliMin
                        ? 'bg-sky-500/30 text-white/80'
                        : 'bg-red-500/40 text-white/85';
                      const isYou = p === nearest(CHART_PPFD, ppfd) && h === nearest(CHART_HOURS, hours);
                      return (
                        <td key={p} className={`rounded-md px-1 py-2 tabular-nums ${tone} ${isYou ? 'outline outline-2 outline-offset-1 outline-white' : ''}`}>{v.toFixed(1)}</td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── TARGETS TABLE ─────────────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">PPFD and DLI Targets for Cannabis by Growth Stage</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                  <th className="px-4 py-3 text-left text-white/45 font-semibold">Stage</th>
                  <th className="px-4 py-3 text-left text-white/45 font-semibold">PPFD</th>
                  <th className="px-4 py-3 text-left text-white/45 font-semibold">Light hours</th>
                  <th className="px-4 py-3 text-left text-white/45 font-semibold">DLI target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {STAGE_ORDER.map((s) => (
                  <tr key={s} className="text-white/65 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{STAGES[s].label}</td>
                    <td className="px-4 py-3">{STAGES[s].ppfd}</td>
                    <td className="px-4 py-3">{STAGES[s].hours} hours</td>
                    <td className="px-4 py-3 text-landing-green font-medium">{STAGES[s].dliMin} to {STAGES[s].dliMax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-white/40 font-sans leading-relaxed">
            These are starting ranges for rooms without added CO2. Cultivar, plant health and room conditions all move the ideal number, so change intensity in small steps.
          </p>
        </section>

        {/* ── EDUCATIONAL CONTENT ───────────────────────────────────────── */}
        <div className="space-y-14 mb-16">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">What PPFD and DLI Mean for Your Grow</h2>
            <div className="space-y-4 text-base text-white/65 leading-relaxed font-sans">
              <p>
                PPFD is how much usable light lands on your canopy each second. Think of it as how hard it is raining. DLI is the total light your plants collect over the whole day. Think of it as how much water ends up in the bucket. A gentle rain for 18 hours and a heavy rain for 12 hours can fill the same bucket, and that is why growers who only look at watts or percent on the dimmer often miss what the plant is really getting.
              </p>
              <p>
                Cannabis is a high light crop, but it can only use so much. Too little daily light gives you stretchy plants, thin stems and airy flowers. Too much gives you bleached tops, leaf edges that curl up like a taco, and nutrient problems that are really light stress in disguise. The goal is to land inside the range your plants can use at their current stage, then hold it there.
              </p>
              <p>
                Light does not work alone. A plant under strong light drinks and transpires more, so your temperature and humidity have to keep up. After you set your light here, check your room with the free{' '}
                <Link to="/vpd-calculator" className="text-landing-green hover:underline">VPD calculator</Link> so the two work together.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">How to Use This Grow Light Calculator</h2>
            <div className="space-y-4 text-base text-white/65 leading-relaxed font-sans">
              <p>
                <strong className="text-white">Step 1: Pick your growth stage.</strong> The calculator sets a typical light schedule for that stage, 18 hours for seedlings and veg and 12 hours for flower. Change the hours if you run something different, such as 20 hours for autoflowers.
              </p>
              <p>
                <strong className="text-white">Step 2: Enter your PPFD if you know it.</strong> The best source is a PAR meter held at canopy height. The next best is the PPFD map your light maker publishes for your hanging distance. Use the average across the canopy, not the hot spot in the center.
              </p>
              <p>
                <strong className="text-white">Step 3: No PPFD number? Estimate it.</strong> Choose your light type, enter the actual watts it draws from the wall, and pick your tent size. The result is an average estimate. It is good enough to tell you whether you are far off, and it is honest about being a rough guide.
              </p>
              <p>
                <strong className="text-white">Step 4: Read the result and make one change.</strong> If your DLI is low, raise intensity or lower the light a little. If it is high, dim the light or raise it. Change one thing, wait three or four days, and look at the newest growth before you change anything else.
              </p>
              <p>
                <strong className="text-white">Step 5: Let the plant confirm it.</strong> Numbers get you close. The leaves tell you if you are right. Take a canopy photo in MasterGrowbot AI for a plant health report, and keep your light settings in the grow journal. Download it free on{' '}
                <a href={APP_STORE_URL} data-cta-location="light-body-text:ios" className="text-landing-green hover:underline">iOS</a>{' '}
                or{' '}
                <a href={PLAY_STORE_URL} data-cta-location="light-body-text:android" className="text-landing-green hover:underline">Android</a>. Eligible new Pro subscribers can try 3 days free.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">Common Grow Light Mistakes</h2>
            <div className="space-y-4 text-base text-white/65 leading-relaxed font-sans">
              <p>
                <strong className="text-white">Trusting the watts on the box.</strong> Many lights are sold by an "equivalent" wattage that has nothing to do with what they draw or deliver. Use the actual wall watts from the spec sheet.
              </p>
              <p>
                <strong className="text-white">Running flower intensity on seedlings.</strong> Young plants need a fraction of the light a flowering canopy does. Blasting them is one of the most common reasons seedlings stall in week one.
              </p>
              <p>
                <strong className="text-white">Raising light without raising everything else.</strong> More light means more water, more feed and more heat to manage. If the top leaves pale or curl after you turn the light up, back off and read the{' '}
                <Link to="/grow-guides/cannabis-led-grow-lights" className="text-landing-green hover:underline">LED grow lights guide</Link> before pushing again.
              </p>
              <p>
                <strong className="text-white">Changing hours in flower.</strong> Photoperiod plants need 12 hours of unbroken darkness to keep flowering. Adjust intensity instead, and see the{' '}
                <Link to="/grow-guides/cannabis-light-schedules" className="text-landing-green hover:underline">cannabis light schedules guide</Link> for the details.
              </p>
              <p>
                For more on every stage of the grow, visit the{' '}
                <Link to="/grow-guides" className="text-landing-green hover:underline">cannabis grow guides hub</Link>.
              </p>
            </div>
          </section>

          <section id="faq">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">Grow Light Calculator FAQ</h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.name} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-2">
                  <h3 className="text-base font-semibold text-white font-sans">{item.name}</h3>
                  <p className="text-sm text-white/60 leading-relaxed font-sans">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── CLOSING CTA ───────────────────────────────────────────────── */}
        <div className="mb-12 rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-landing-green font-sans">Your AI master grower, in your pocket.</h2>
          <p className="text-white/60 font-sans text-sm sm:text-base max-w-lg mx-auto">
            Snap a photo. Save your plant. Download MasterGrowbot AI for plant health reports, a grow journal and daily tasks. Eligible new Pro subscribers can try 3 days free.
          </p>
          <AppPlatformButtons campaign="grow-light-calculator" location="light-closing" className="pt-2" />
          <div className="pt-3 flex items-center justify-center gap-5 text-sm text-white/30 font-sans">
            <Link to="/vpd-calculator" className="hover:text-landing-green transition-colors">VPD Calculator</Link>
            <Link to="/grow-guides" className="hover:text-landing-green transition-colors">All Grow Guides</Link>
            <Link to="/" className="hover:text-landing-green transition-colors">MasterGrowbot AI Home</Link>
          </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}
