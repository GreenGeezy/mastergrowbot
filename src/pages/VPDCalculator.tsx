import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Copy, Check, Info } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';

// ─── Types ────────────────────────────────────────────────────────────────────

type GrowthStage = 'clones' | 'seedling' | 'vegetative' | 'earlyFlower' | 'lateFlower';
type LightingType = 'led' | 'hps' | 'custom';

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGE_ORDER: GrowthStage[] = ['clones', 'seedling', 'vegetative', 'earlyFlower', 'lateFlower'];

const STAGES: Record<GrowthStage, { label: string; min: number; max: number }> = {
  clones:      { label: 'Clones',       min: 0.3, max: 0.6 },
  seedling:    { label: 'Seedling',     min: 0.4, max: 0.8 },
  vegetative:  { label: 'Vegetative',   min: 0.8, max: 1.2 },
  earlyFlower: { label: 'Early Flower', min: 1.0, max: 1.3 },
  lateFlower:  { label: 'Late Flower',  min: 1.2, max: 1.6 },
};

const LEAF_OFFSETS_F: Record<'led' | 'hps', number> = {
  led: -4,
  hps:  5,
};

const APP_STORE_URL =
  'https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=vpd-calculator';
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.mastergrowbot.app&utm_source=website&utm_medium=organic&utm_campaign=vpd-calculator';

// ─── VPD Math ─────────────────────────────────────────────────────────────────

function fToC(f: number): number {
  return (f - 32) * 5 / 9;
}

/** Saturation vapor pressure in kPa via Tetens equation. T in Celsius. */
function svp(tempC: number): number {
  return 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}

function calcVPD(airTempF: number, rh: number, leafOffsetF: number) {
  const airTempC   = fToC(airTempF);
  const leafOffsetC = leafOffsetF * 5 / 9; // offset is a delta, not an absolute temp
  const leafTempC   = airTempC + leafOffsetC;
  return {
    airVPD:  Math.max(0, svp(airTempC)  * (1 - rh / 100)),
    leafVPD: Math.max(0, svp(leafTempC) -  svp(airTempC) * (rh / 100)),
  };
}

/** Given fixed airTemp, find the RH that produces a specific leaf VPD. */
function rhForTargetLeafVPD(airTempF: number, leafOffsetF: number, targetVPD: number): number {
  const airTempC   = fToC(airTempF);
  const leafTempC  = airTempC + leafOffsetF * 5 / 9;
  const rh = 100 * (svp(leafTempC) - targetVPD) / svp(airTempC);
  return Math.max(0, Math.min(100, rh));
}

/** Given fixed RH, find the airTempF that produces a specific leaf VPD (binary search). */
function tempFForTargetLeafVPD(rh: number, leafOffsetF: number, targetVPD: number): number {
  let lo = 50, hi = 110;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const { leafVPD } = calcVPD(mid, rh, leafOffsetF);
    if (leafVPD < targetVPD) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ─── Schema Markup ────────────────────────────────────────────────────────────

const faqItems = [
  {
    name: 'What is the best VPD for cannabis?',
    text: 'The best VPD for cannabis depends on the growth stage. During vegetative growth, target 0.8 to 1.2 kPa. During flower, target 1.0 to 1.5 kPa. Use the calculator above to check your exact conditions based on your temperature, humidity, and lighting type.',
  },
  {
    name: 'Does VPD matter at night?',
    text: 'Stomata close when lights are off, so VPD-driven transpiration largely stops during the dark period. However, humidity management still matters at night because high humidity in a stagnant environment is the primary driver of mold and botrytis during the flowering stage.',
  },
  {
    name: 'What VPD is too high for cannabis?',
    text: 'A VPD above 1.6 kPa begins to stress cannabis plants, causing stomata to close and slowing transpiration. Above 2.0 kPa, plants experience severe stress with crispy leaf tips and nutrient uptake problems. If your VPD is consistently above 1.5 kPa, lower your temperature or raise your humidity.',
  },
  {
    name: 'Do I need to measure leaf temperature for VPD?',
    text: 'For maximum accuracy, yes. Leaf temperature is where transpiration actually happens, and it differs from air temperature depending on your lighting type. Most growers get excellent results by using the lighting type offset in this calculator instead, which automatically accounts for the typical leaf temperature difference.',
  },
  {
    name: 'Why do different VPD charts show different numbers?',
    text: 'Different calculators use either air VPD or leaf VPD. Air VPD uses only air temperature and humidity. Leaf VPD accounts for the fact that leaf surface temperature differs from air temperature, which changes the vapor pressure calculation. Leaf VPD is more accurate because transpiration happens at the leaf surface, not in the open air. This calculator shows both values.',
  },
  {
    name: 'Can MasterGrowbot AI help with VPD?',
    text: 'Yes. MasterGrowbot AI includes VPD tracking in the grow journal and uses AI photo analysis to detect stress symptoms caused by VPD problems before they become serious. Download MasterGrowbot AI free for a 3-day trial on iOS or Android.',
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
    { '@type': 'ListItem', position: 1, name: 'Home',          item: 'https://www.mastergrowbot.com/' },
    { '@type': 'ListItem', position: 2, name: 'VPD Calculator', item: 'https://www.mastergrowbot.com/vpd-calculator' },
  ],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Free VPD Calculator for Cannabis',
  description: 'Calculate vapor pressure deficit for cannabis growing with actionable recommendations by growth stage.',
  url: 'https://www.mastergrowbot.com/vpd-calculator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Organization', name: 'MasterGrowbot AI', url: 'https://www.mastergrowbot.com' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function VPDCalculator() {
  const [stage,         setStage]         = useState<GrowthStage>('vegetative');
  const [lighting,      setLighting]      = useState<LightingType>('led');
  const [airTempF,      setAirTempF]      = useState(78);
  const [rh,            setRH]            = useState(55);
  const [customOffsetF, setCustomOffsetF] = useState(0);
  const [unit,          setUnit]          = useState<'F' | 'C'>('F');
  const [copied,        setCopied]        = useState(false);

  const leafOffsetF    = lighting === 'custom' ? customOffsetF : LEAF_OFFSETS_F[lighting as 'led' | 'hps'];
  const { airVPD, leafVPD } = calcVPD(airTempF, rh, leafOffsetF);
  const stageConfig    = STAGES[stage];

  // ── Status ────────────────────────────────────────────────────────────────
  const withinRange = leafVPD >= stageConfig.min && leafVPD <= stageConfig.max;
  const slightlyOff = !withinRange && (
    (leafVPD >= stageConfig.min - 0.2 && leafVPD < stageConfig.min) ||
    (leafVPD > stageConfig.max          && leafVPD <= stageConfig.max + 0.2)
  );
  const tooLow      = leafVPD < stageConfig.min;

  const statusKey   = withinRange ? 'green' : slightlyOff ? 'yellow' : 'red';
  const statusLabel = withinRange ? 'Perfect' : slightlyOff ? 'Slightly Off' : 'Fix Now';

  const colorMap = {
    green:  { text: 'text-landing-green',  badge: 'bg-landing-green/10 border-landing-green/30 text-landing-green', card: 'border-landing-green/20 bg-landing-green/5' },
    yellow: { text: 'text-yellow-400',      badge: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400',           card: 'border-yellow-400/20 bg-yellow-400/5' },
    red:    { text: 'text-red-400',          badge: 'bg-red-400/10 border-red-400/30 text-red-400',                   card: 'border-red-400/20 bg-red-400/5' },
  } as const;
  const colors = colorMap[statusKey];

  // ── Verdict ───────────────────────────────────────────────────────────────
  const stageNameLower = stageConfig.label.toLowerCase();
  const verdict = withinRange
    ? `Your environment is dialed in perfectly for ${stageNameLower}. Keep it steady.`
    : tooLow
    ? `Your VPD is too low for ${stageNameLower}. The air is too humid for optimal transpiration.`
    : `Your VPD is too high for ${stageNameLower}. Your plants are losing water faster than ideal.`;

  // ── Fix recommendations ───────────────────────────────────────────────────
  let fixTempLabel = '';
  let fixRHLabel   = '';
  let primaryFix   = '';
  let altFix       = '';

  if (!withinRange) {
    const targetVPD   = tooLow ? stageConfig.min : stageConfig.max;
    const targetTempF = tempFForTargetLeafVPD(rh, leafOffsetF, targetVPD);
    const targetRH    = rhForTargetLeafVPD(airTempF, leafOffsetF, targetVPD);

    const tempDelta = Math.abs(targetTempF - airTempF);
    const rhDelta   = Math.abs(targetRH - rh);

    const tempDir = tooLow ? 'Raise' : 'Lower';
    const rhDir   = tooLow ? 'Lower' : 'Raise';

    if (unit === 'F') {
      fixTempLabel = `${tempDir} temperature by ${tempDelta.toFixed(1)}F to ${targetTempF.toFixed(0)}F`;
    } else {
      const deltaC    = tempDelta * 5 / 9;
      const targetC   = fToC(targetTempF);
      fixTempLabel    = `${tempDir} temperature by ${deltaC.toFixed(1)}C to ${targetC.toFixed(0)}C`;
    }
    fixRHLabel = `${rhDir} humidity by ${rhDelta.toFixed(0)}% to ${targetRH.toFixed(0)}% RH`;

    if (tempDelta <= rhDelta) {
      primaryFix = fixTempLabel;
      altFix     = fixRHLabel;
    } else {
      primaryFix = fixRHLabel;
      altFix     = fixTempLabel;
    }
  }

  // ── Mold risk ─────────────────────────────────────────────────────────────
  const isFlower = stage === 'earlyFlower' || stage === 'lateFlower';
  const moldRisk = isFlower ? (rh > 70 ? 'high' : rh > 60 ? 'elevated' : null) : null;

  // ── Copy results ──────────────────────────────────────────────────────────
  const handleCopy = () => {
    const text = `My VPD: ${leafVPD.toFixed(2)} kPa (${statusLabel}) | ${stageConfig.label} stage | ${airTempF}F / ${rh}% RH | Calculated with MasterGrowbot AI - mastergrowbot.com/vpd-calculator`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Temperature display helpers ───────────────────────────────────────────
  const displayTempVal = unit === 'F' ? airTempF : Math.round(fToC(airTempF) * 10) / 10;

  const handleTempInput = (raw: number) => {
    const asFahrenheit = unit === 'F' ? raw : Math.round((raw * 9 / 5 + 32) * 10) / 10;
    setAirTempF(Math.max(60, Math.min(100, asFahrenheit)));
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SEOHead
        title="Free VPD Calculator for Cannabis Growers 2026 | MasterGrowbot AI"
        description="Free VPD calculator with actionable recommendations for every cannabis growth stage. Enter temp and humidity, get instant diagnosis and fix. No signup required."
        canonicalUrl="https://www.mastergrowbot.com/vpd-calculator"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>

      <LandingNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/40 font-sans mb-8 flex-wrap">
          <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-white/60">VPD Calculator</span>
        </nav>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <header className="mb-10 space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white font-sans">
            Free VPD Calculator for Cannabis
          </h1>
          <p className="text-base sm:text-lg text-white/60 font-sans max-w-2xl leading-relaxed">
            Enter your temperature and humidity. Get instant VPD diagnosis with actionable recommendations for your growth stage.
          </p>
          <p className="text-sm text-white/40 font-sans">
            Track VPD over time in your grow journal with{' '}
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-landing-green hover:underline">
              MasterGrowbot AI
            </a>{' '}
            - free 3-day trial, no signup required.
          </p>
        </header>

        {/* ── CALCULATOR CARD ───────────────────────────────────────────── */}
        <div className="rounded-2xl border border-landing-green/20 bg-gradient-to-b from-landing-green/[0.06] to-transparent p-5 sm:p-8 mb-14 shadow-[0_0_60px_-15px_rgba(74,222,128,0.15)]">

          {/* Growth Stage Pills */}
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 font-sans mb-3">
              Growth Stage
            </p>
            <div className="flex flex-wrap gap-2">
              {STAGE_ORDER.map((s) => (
                <button
                  key={s}
                  onClick={() => setStage(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium font-sans transition-all ${
                    stage === s
                      ? 'bg-landing-green text-black'
                      : 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1] hover:text-white'
                  }`}
                >
                  {STAGES[s].label}
                  <span className={`ml-1.5 text-xs ${stage === s ? 'opacity-60' : 'opacity-50'}`}>
                    {STAGES[s].min}&ndash;{STAGES[s].max}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

            {/* ── LEFT: Inputs ────────────────────────────────────────── */}
            <div className="space-y-6">

              {/* Lighting Type */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40 font-sans">
                    Lighting Type
                  </p>
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-white/25 cursor-help" />
                    <div className="absolute bottom-6 left-0 w-60 bg-zinc-900 border border-white/10 rounded-xl p-3 text-xs text-white/65 font-sans hidden group-hover:block z-20 leading-relaxed shadow-xl">
                      LEDs make leaves cooler, HPS makes them warmer. This affects your true VPD.
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['led', 'hps', 'custom'] as LightingType[]).map((lt) => (
                    <button
                      key={lt}
                      onClick={() => setLighting(lt)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium font-sans transition-all ${
                        lighting === lt
                          ? 'bg-white/[0.12] text-white border border-white/25'
                          : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/80 border border-transparent'
                      }`}
                    >
                      {lt === 'led' ? 'LED' : lt === 'hps' ? 'HPS' : 'Custom'}
                      {lt !== 'custom' && (
                        <span className="ml-1 text-xs opacity-60">
                          {lt === 'led' ? '(-4F)' : '(+5F)'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {lighting === 'custom' && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-white/40 font-sans">
                      <span>Leaf temp offset</span>
                      <span className="text-white font-medium">
                        {customOffsetF > 0 ? '+' : ''}{customOffsetF}F
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-10}
                      max={10}
                      step={0.5}
                      value={customOffsetF}
                      onChange={(e) => setCustomOffsetF(Number(e.target.value))}
                      className="w-full accent-landing-green"
                    />
                    <div className="flex justify-between text-xs text-white/25 font-sans">
                      <span>-10F (much cooler)</span>
                      <span>+10F (much warmer)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Air Temperature */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40 font-sans">
                    Air Temperature
                  </p>
                  <button
                    onClick={() => setUnit(unit === 'F' ? 'C' : 'F')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.1] transition-colors font-sans"
                  >
                    Switch to &deg;{unit === 'F' ? 'C' : 'F'}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={60}
                    max={100}
                    step={1}
                    value={airTempF}
                    onChange={(e) => setAirTempF(Number(e.target.value))}
                    className="flex-1 accent-landing-green"
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={displayTempVal}
                      onChange={(e) => handleTempInput(Number(e.target.value))}
                      className="w-16 bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center font-sans focus:outline-none focus:border-landing-green/50"
                    />
                    <span className="text-sm text-white/40 font-sans">&deg;{unit}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-white/25 font-sans mt-1.5">
                  <span>{unit === 'F' ? '60F' : '16C'}</span>
                  <span>{unit === 'F' ? '100F' : '38C'}</span>
                </div>
              </div>

              {/* Relative Humidity */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40 font-sans">
                    Relative Humidity
                  </p>
                  <span className="text-sm font-semibold text-white font-sans">{rh}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={20}
                    max={90}
                    step={1}
                    value={rh}
                    onChange={(e) => setRH(Number(e.target.value))}
                    className="flex-1 accent-landing-green"
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={20}
                      max={90}
                      value={rh}
                      onChange={(e) => setRH(Math.max(20, Math.min(90, Number(e.target.value))))}
                      className="w-16 bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center font-sans focus:outline-none focus:border-landing-green/50"
                    />
                    <span className="text-sm text-white/40 font-sans">%</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-white/25 font-sans mt-1.5">
                  <span>20%</span>
                  <span>90%</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Results ─────────────────────────────────────── */}
            <div className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${colors.card}`}>

              {/* Primary VPD */}
              <div className="text-center pb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40 font-sans mb-2">
                  Leaf VPD
                </p>
                <p className={`text-7xl font-bold font-sans tracking-tight leading-none ${colors.text}`}>
                  {leafVPD.toFixed(2)}
                </p>
                <p className="text-base text-white/40 font-sans mt-1">kPa</p>
                <p className="text-xs text-white/25 font-sans mt-2">
                  Air VPD: {airVPD.toFixed(2)} kPa &mdash; leaf VPD accounts for your lighting type
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold font-sans border ${colors.badge}`}>
                  {statusLabel}
                </span>
              </div>

              {/* Target range */}
              <p className="text-xs text-white/35 font-sans text-center">
                Target for {stageConfig.label}: {stageConfig.min} to {stageConfig.max} kPa
              </p>

              {/* Verdict */}
              <p className="text-sm text-white/70 font-sans text-center leading-relaxed border-t border-white/[0.07] pt-4">
                {verdict}
              </p>

              {/* Fix Recommendations */}
              {!withinRange && (
                <div className="space-y-2.5 border-t border-white/[0.07] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40 font-sans">
                    Easiest Fix
                  </p>
                  <p className="text-sm font-semibold text-white font-sans leading-snug">{primaryFix}</p>
                  <p className="text-xs text-white/35 font-sans">Alt: {altFix}</p>
                </div>
              )}

              {/* Mold Risk */}
              {moldRisk && (
                <div className={`rounded-xl p-3 border text-xs font-sans leading-relaxed ${
                  moldRisk === 'high'
                    ? 'bg-red-500/10 border-red-500/25 text-red-300'
                    : 'bg-yellow-500/10 border-yellow-500/25 text-yellow-300'
                }`}>
                  {moldRisk === 'high'
                    ? 'High mold risk. Consider lowering humidity even if VPD looks acceptable.'
                    : 'Elevated mold risk at this humidity during flower. Monitor buds closely.'}
                </div>
              )}

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/50 hover:text-white text-sm font-sans transition-all border border-white/[0.07]"
              >
                {copied
                  ? <><Check className="w-4 h-4 text-landing-green" /> Copied!</>
                  : <><Copy className="w-4 h-4" /> Copy Results</>
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── VPD REFERENCE TABLE ───────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">
            VPD Reference Chart for Cannabis
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                  <th className="px-4 py-3 text-left text-white/45 font-semibold">Stage</th>
                  <th className="px-4 py-3 text-left text-white/45 font-semibold">VPD Range</th>
                  <th className="px-4 py-3 text-left text-white/45 font-semibold">Typical Temp</th>
                  <th className="px-4 py-3 text-left text-white/45 font-semibold">Typical Humidity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {[
                  { stage: 'Clones',       vpd: '0.3 to 0.6 kPa', temp: '75F',       humidity: '75 to 85%' },
                  { stage: 'Seedlings',    vpd: '0.4 to 0.8 kPa', temp: '75 to 78F', humidity: '65 to 75%' },
                  { stage: 'Vegetative',   vpd: '0.8 to 1.2 kPa', temp: '78 to 82F', humidity: '55 to 65%' },
                  { stage: 'Early Flower', vpd: '1.0 to 1.3 kPa', temp: '80 to 82F', humidity: '50 to 60%' },
                  { stage: 'Late Flower',  vpd: '1.2 to 1.6 kPa', temp: '75 to 80F', humidity: '40 to 50%' },
                ].map((row) => (
                  <tr key={row.stage} className="text-white/65 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{row.stage}</td>
                    <td className="px-4 py-3 text-landing-green font-medium">{row.vpd}</td>
                    <td className="px-4 py-3">{row.temp}</td>
                    <td className="px-4 py-3">{row.humidity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── EDUCATIONAL CONTENT ───────────────────────────────────────── */}
        <div className="space-y-14 mb-16">

          {/* Section 1 */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">
              What Is VPD and Why Cannabis Growers Need to Understand It
            </h2>
            <div className="space-y-4 text-base text-white/65 leading-relaxed font-sans">
              <p>
                VPD stands for Vapor Pressure Deficit. If that sounds like a chemistry term, do not let it put you off. The concept is simpler than the name suggests: VPD measures how "thirsty" the air around your plant is at any given moment.
              </p>
              <p>
                Cannabis plants survive by moving water constantly. Roots pull water and dissolved nutrients from the growing medium. That water travels up through the stem and into the leaves, and it exits the leaf surface as vapor through tiny pores called stomata. This process, called transpiration, is what powers nutrient transport throughout the entire plant. Without active transpiration, growth slows and nutrient delivery becomes unreliable even when your feed is perfectly mixed and your pH is dialed in.
              </p>
              <p>
                VPD tells you how hard the air is pulling that vapor out of your leaves. When the air has a high deficit (high VPD), it is actively drawing moisture away from the leaf surface at a fast rate. When the air is already close to saturation (low VPD), it is barely pulling any moisture at all, and transpiration slows to a crawl.
              </p>
              <p>
                Both extremes cause problems. Too humid (low VPD) and the plant becomes lazy. Water sits in the growing medium because the plant does not need to pull it up. Growth slows, roots can become oxygen-deprived, and the stagnant wet conditions that favor mold and root disease begin to develop. Too dry (high VPD) and the plant is stressed. It closes its stomata to prevent dehydration, nutrient uptake collapses, and you start seeing crispy leaf tips and browning edges that look like nutrient burn but are actually a stress response.
              </p>
              <p>
                The sweet spot is a VPD range that keeps transpiration active and efficient without pushing the plant into survival mode. That sweet spot changes as the plant grows because different stages have different water demands and different tolerances for moisture loss. Rooting clones with no established root system cannot afford rapid moisture loss. Flowering plants with dense buds to fill need active transpiration and lower humidity to prevent the mold that destroys harvests. A single VPD target for an entire grow cycle does not work.
              </p>
              <p>
                Use the calculator above to check your current conditions. Enter your canopy temperature, relative humidity, and lighting type, and you will see your leaf VPD instantly alongside a specific recommendation for the stage you are in.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">
              How VPD Is Calculated: The Simple Version
            </h2>
            <div className="space-y-4 text-base text-white/65 leading-relaxed font-sans">
              <p>
                The math behind VPD is based on a concept called saturation vapor pressure (SVP). At any given temperature, air can hold a specific maximum amount of water vapor. The warmer the air, the more it can hold. Saturation vapor pressure is that maximum capacity, expressed in kilopascals.
              </p>
              <p>
                Relative humidity tells you what percentage of that maximum is currently filled. If your air is at 60% relative humidity, it is holding 60% of the water vapor it could hold at that temperature. VPD is the gap between what the air could hold and what it does hold. That gap, measured in kilopascals, is the pressure deficit that drives water vapor out of your plant.
              </p>
              <p>
                Here is where it gets important for cannabis growers: air VPD and leaf VPD are not the same thing, and most of the confusion around VPD charts comes from not knowing which one a particular calculator or chart is using.
              </p>
              <p>
                Air VPD uses only the air temperature and humidity. It tells you about the vapor deficit in the open space of your grow room. Leaf VPD uses the actual surface temperature of the leaf, which is different from the air temperature depending on how your lighting heats or cools the canopy. Because transpiration happens at the leaf surface and not in the open air, leaf VPD is the more accurate measurement for predicting how your plant behaves.
              </p>
              <p>
                LED lights emit very little radiant heat compared to HPS. The canopy under an LED typically runs 3 to 5 degrees cooler than the surrounding air. That lower leaf temperature reduces the saturation vapor pressure at the leaf surface, which lowers the actual VPD below what the air temperature alone would suggest. If you are running LEDs and using an air VPD chart, you will overestimate your actual leaf VPD and may run your humidity lower than necessary.
              </p>
              <p>
                HPS lights work in the opposite direction. The intense radiant heat warms the canopy above air temperature, raising the leaf VPD above what an air-only calculation shows. Growers on HPS who use air VPD charts often underestimate their actual leaf VPD and run conditions that are drier than they realize.
              </p>
              <p>
                This calculator accounts for both. Select LED or HPS and the correct leaf temperature offset is applied automatically. If you have measured your actual leaf temperature with an infrared thermometer, select Custom and dial in the exact offset for maximum accuracy.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">
              VPD Ranges for Every Cannabis Growth Stage
            </h2>
            <div className="space-y-4 text-base text-white/65 leading-relaxed font-sans">
              <p>
                Every stage of cannabis development requires a different VPD target because the plant's water demand and tolerance for moisture loss change dramatically from clone to harvest.
              </p>
              <p>
                <strong className="text-white">Clones and cuttings (0.3 to 0.6 kPa):</strong> A cutting has no root system. It cannot replace water faster than it loses it, so it needs to lose as little as possible. The very low VPD target for clones, near-saturated air at 75 to 85% humidity, keeps transpiration almost completely shut down. The clone draws the moisture it needs directly through its leaf surface until roots develop. Raise VPD too quickly after taking cuttings and the clone wilts before it can anchor itself.
              </p>
              <p>
                <strong className="text-white">Seedlings (0.4 to 0.8 kPa):</strong> Seedlings have roots but they are small and not yet efficient. The VPD target moves slightly higher than clones to encourage gentle transpiration and nutrient movement, but the plant cannot handle high demand yet. Keeping humidity in the 65 to 75% range at around 75 to 78 degrees gives the seedling time to develop root mass without stressing it. Pushing VPD too high at this stage stunts development in ways that often do not recover fully.
              </p>
              <p>
                <strong className="text-white">Vegetative growth (0.8 to 1.2 kPa):</strong> This is where you start pushing the plant to work. The root system is established and the plant can move significant volumes of water. Higher VPD in this range keeps transpiration active, drives rapid growth, and helps the plant process nutrients efficiently. Temperatures of 78 to 82 degrees with humidity at 55 to 65% hit the target range for most setups. Getting VPD right during veg pays the biggest dividends in growth rate and canopy development.
              </p>
              <p>
                <strong className="text-white">Early flower (1.0 to 1.3 kPa):</strong> As the plant transitions into flower, VPD increases slightly. Bud sites are forming and the plant needs strong transpiration to fuel rapid development. You are also beginning to reduce humidity in preparation for the density the buds will achieve. The challenge here is that lower humidity reduces mold risk while higher VPD pushes the plant harder. Most growers target the lower end of this range early in the flip and move toward the higher end as the canopy fills in and bud development accelerates.
              </p>
              <p>
                <strong className="text-white">Late flower (1.2 to 1.6 kPa):</strong> This is the most demanding stage for humidity control. Buds are dense, airflow through the canopy is restricted, and any pocket of high humidity can become a botrytis incubation zone overnight. VPD targets in the 1.2 to 1.6 range pair with humidity at 40 to 50%, which keeps transpiration strong while removing the mold conditions that can destroy an entire crop in days. If you cannot reach this range because of high ambient humidity, a quality dehumidifier is the most important piece of equipment you can add to your setup.
              </p>
              <p>
                Note that all VPD targets above refer to leaf VPD calculated with the appropriate lighting offset. If you are comparing these to a published air VPD chart and the numbers look different, that is the reason.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">
              Common VPD Mistakes and How to Fix Them
            </h2>
            <div className="space-y-4 text-base text-white/65 leading-relaxed font-sans">
              <p>
                <strong className="text-white">Mistake 1: Chasing temperature and humidity as separate targets.</strong> The most common approach among newer growers is to pick a target temperature and a target humidity, then try to hold both independently. The problem is that these two variables interact. A temperature of 80F at 55% humidity produces a completely different transpiration environment than 80F at 45%, or 75F at 55%. When you optimize them separately, you end up chasing numbers without understanding how they combine to affect your plant. VPD combines temperature and humidity into a single meaningful measurement, which is why understanding it is worth the small amount of time it takes to learn.
              </p>
              <p>
                <strong className="text-white">Mistake 2: Ignoring the leaf temperature offset from your lighting.</strong> Most published VPD charts are built around air temperature, and most grow room thermometers measure air temperature. If you are running LEDs and using an air VPD chart, your actual leaf VPD is lower than the chart shows, because your leaves are cooler than the air. This commonly leads growers to run their humidity too low while thinking they are targeting 1.0 kPa when their actual leaf VPD is closer to 0.75. Over an entire grow cycle, this accumulates into measurable stress. Use this calculator with the correct lighting type selected and you see the real number.
              </p>
              <p>
                <strong className="text-white">Mistake 3: Keeping flower humidity high because VPD looks acceptable.</strong> This is the most costly mistake in the list. VPD calculations can show that a flower-stage plant technically functions at 60% humidity if the temperature is in the right range. But cannabis in late flower with 60% relative humidity and any restriction in airflow is prime botrytis territory. VPD management and mold risk management are two separate constraints, and you need to satisfy both. This calculator shows a mold risk indicator during flower stages so you can see when your humidity is within the VPD target but still poses a risk to your crop.
              </p>
              <p>
                <strong className="text-white">Mistake 4: Fine-tuning VPD when the fundamentals are off.</strong> VPD is a precision tool, not a foundation. If your pH is outside the correct range, if you are overwatering, or if your plants have a pest or deficiency problem, correcting your VPD will not fix the underlying issue. Get the basics right first. The <Link to="/grow-guides/cannabis-nutrient-deficiency-guide" className="text-landing-green hover:underline">cannabis nutrient deficiency guide</Link> covers the foundational problems that need to be solved before environmental fine-tuning makes a meaningful difference.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">
              How to Use This VPD Calculator in Your Grow
            </h2>
            <div className="space-y-4 text-base text-white/65 leading-relaxed font-sans">
              <p>
                <strong className="text-white">Step 1: Get a hygrometer and thermometer.</strong> A $15 digital hygrometer with a built-in temperature sensor from any hardware store gives you everything you need. You do not need an integrated environmental controller or a data logger to start using VPD data effectively.
              </p>
              <p>
                <strong className="text-white">Step 2: Measure at canopy level.</strong> Temperature and humidity at the wall or ceiling of your grow room are not representative of what your plants actually experience. Place the sensor at the top of the canopy, in the zone where the leaves are actively transpiring. This is the number that goes into the calculator.
              </p>
              <p>
                <strong className="text-white">Step 3: Select your growth stage and lighting type above.</strong> The stage determines your target VPD range. The lighting type applies the correct leaf temperature offset so the calculated value reflects what is actually happening at the leaf surface rather than in the open air.
              </p>
              <p>
                <strong className="text-white">Step 4: Check in the morning and adjust.</strong> VPD shifts throughout the day as your lights warm the space and your plants transpire water into the air. A reading when lights first come on and one when the room reaches peak temperature gives you a useful daily range. Adjust your humidifier, dehumidifier, or intake fan speed based on what you see.
              </p>
              <p>
                <strong className="text-white">Step 5: Track VPD trends over time.</strong> A single VPD reading is useful. A log of readings across a full grow cycle is how you understand your environment well enough to repeat your best results in the next run. MasterGrowbot AI tracks VPD alongside your full grow journal, nutrient logs, and AI photo diagnosis. Download free with a 3-day trial on{' '}
                <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-landing-green hover:underline">iOS</a>{' '}
                or{' '}
                <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-landing-green hover:underline">Android</a>.
              </p>
              <p>
                For more on growing fundamentals, visit the{' '}
                <Link to="/grow-guides" className="text-landing-green hover:underline">cannabis grow guides hub</Link>,
                which covers everything from nutrient management to pest control and harvest timing.
              </p>
            </div>
          </section>

          {/* Section 6: FAQ */}
          <section id="faq">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">
              Frequently Asked Questions About VPD
            </h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-2"
                >
                  <h3 className="text-base font-semibold text-white font-sans">{item.name}</h3>
                  <p className="text-sm text-white/60 leading-relaxed font-sans">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── CLOSING CTA ───────────────────────────────────────────────── */}
        <div className="mb-12 rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-landing-green font-sans">
            Stop Guessing. Start Optimizing.
          </h2>
          <p className="text-white/60 font-sans text-sm sm:text-base max-w-lg mx-auto">
            Download MasterGrowbot AI for VPD tracking, AI plant diagnosis, and a complete digital grow journal. Free 3-day trial on iOS and Android.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'app_store_click', { link_url: 'https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060' });
                }
              }}
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download MasterGrowbot AI on the App Store"
                width={156}
                height={52}
                className="h-[52px]"
              />
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'play_store_click', { link_url: 'https://play.google.com/store/apps/details?id=com.mastergrowbot.app' });
                }
              }}
            >
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get MasterGrowbot AI on Google Play"
                width={180}
                height={52}
                className="h-[52px]"
              />
            </a>
          </div>
          <div className="pt-3 flex items-center justify-center gap-5 text-sm text-white/30 font-sans">
            <Link to="/grow-guides" className="hover:text-landing-green transition-colors">
              All Grow Guides
            </Link>
            <Link to="/" className="hover:text-landing-green transition-colors">
              MasterGrowbot AI Home
            </Link>
          </div>
        </div>

      </div>

      <LandingFooter />
    </div>
  );
}
