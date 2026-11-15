import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, RotateCcw } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import RealReports from '@/components/landing/RealReports';
import { AppPlatformButtons } from '@/components/landing/cta';
import { appStoreUrl, playStoreUrl } from '@/components/landing/ctaLinks';

// This tool runs entirely in the visitor's browser. It makes no network or AI calls,
// so it costs nothing to run and cannot be abused to spend API credits.

type Location = 'lower' | 'upper' | 'all';
type Symptom =
  | 'interveinal' | 'yellowAll' | 'spots' | 'tips' | 'edges' | 'curlUp'
  | 'claw' | 'droop' | 'bleach' | 'purple' | 'powder' | 'specks';

const LOCATIONS: { key: Location; label: string; hint: string }[] = [
  { key: 'lower', label: 'Lower, older leaves', hint: 'Bottom and middle of the plant' },
  { key: 'upper', label: 'Top, new growth', hint: 'Newest leaves near the light' },
  { key: 'all', label: 'The whole plant', hint: 'Everywhere at once' },
];

const SYMPTOMS: { key: Symptom; label: string }[] = [
  { key: 'interveinal', label: 'Yellow between green veins' },
  { key: 'yellowAll', label: 'Whole leaf turning pale or yellow' },
  { key: 'spots', label: 'Brown or rust spots' },
  { key: 'tips', label: 'Burnt, brown leaf tips' },
  { key: 'edges', label: 'Brown, crispy leaf edges' },
  { key: 'curlUp', label: 'Leaf edges curling up' },
  { key: 'claw', label: 'Dark leaves clawing down' },
  { key: 'droop', label: 'Drooping or wilting' },
  { key: 'bleach', label: 'Pale or white tops near the light' },
  { key: 'purple', label: 'Purple stems, dull dark leaves' },
  { key: 'powder', label: 'White powdery patches' },
  { key: 'specks', label: 'Tiny pale specks or webbing' },
];

type Cause = {
  name: string;
  where: Partial<Record<Location, number>>;
  signs: Partial<Record<Symptom, number>>;
  why: string;
  check: string;
  fix: string;
};

const CAUSES: Cause[] = [
  {
    name: 'Magnesium deficiency',
    where: { lower: 3, all: 1 },
    signs: { interveinal: 3, spots: 1 },
    why: 'Magnesium moves from old leaves to new ones, so the lower leaves yellow between the veins first while the veins stay green.',
    check: 'Check the pH of your water and runoff. Magnesium is often present but locked out by pH.',
    fix: 'Correct pH first, then add a Cal-Mag supplement at the label rate.',
  },
  {
    name: 'pH lockout at the roots',
    where: { all: 2, lower: 1, upper: 1 },
    signs: { interveinal: 2, spots: 2, tips: 1, yellowAll: 1, edges: 1 },
    why: 'When root-zone pH drifts out of range, the plant cannot take up several nutrients at once, so you see a mix of yellowing and spotting.',
    check: 'Measure the pH going in and the pH of the runoff. Soil likes 6.2 to 6.8. Coco and hydro like 5.8 to 6.2.',
    fix: 'Water with correctly adjusted pH until runoff is back in range, then resume normal feeding.',
  },
  {
    name: 'Calcium deficiency',
    where: { upper: 2, lower: 1, all: 1 },
    signs: { spots: 3, interveinal: 1, curlUp: 1 },
    why: 'Calcium does not move inside the plant, so brown or rust spots show on fast-growing leaves and new growth can twist.',
    check: 'Are you using filtered or reverse osmosis water, or growing in coco? Both commonly run short on calcium.',
    fix: 'Add a Cal-Mag supplement and keep pH in range so the calcium can be absorbed.',
  },
  {
    name: 'Nitrogen deficiency',
    where: { lower: 3, all: 1 },
    signs: { yellowAll: 3 },
    why: 'The plant pulls nitrogen out of its oldest leaves to feed new growth, so the lowest leaves fade evenly to yellow and drop.',
    check: 'What stage are you in? In late flower a slow fade from the bottom is normal. In veg it means the plant is hungry.',
    fix: 'In veg or early flower, raise your feed strength a little or top dress. In late flower, usually leave it alone.',
  },
  {
    name: 'Potassium deficiency',
    where: { lower: 2, all: 1 },
    signs: { edges: 3, tips: 2, spots: 1 },
    why: 'Low potassium shows as brown, crispy margins and tips with yellowing just inside the edge, usually from the middle of the plant down.',
    check: 'Rule out nutrient burn first: burn hits only the very tips on a dark green plant. Then check runoff pH.',
    fix: 'Correct pH, then use a bloom nutrient with enough potassium at the label rate.',
  },
  {
    name: 'Iron deficiency',
    where: { upper: 3 },
    signs: { interveinal: 3, yellowAll: 1 },
    why: 'Iron cannot move to new growth, so the newest leaves at the top come in bright yellow between the veins.',
    check: 'Check for high root-zone pH and cold or soggy roots. Iron is nearly always locked out, not missing.',
    fix: 'Bring pH down into range and let the pot dry back properly between waterings.',
  },
  {
    name: 'Nutrient burn (too much feed)',
    where: { all: 2, upper: 1 },
    signs: { tips: 3, claw: 1 },
    why: 'Excess nutrients build up and burn the very tips of the leaves first, often on an otherwise dark green plant.',
    check: 'Measure runoff EC. If it is much higher than what you feed, salts have built up in the pot.',
    fix: 'Feed plain pH-adjusted water for one or two waterings, then restart at a lower strength.',
  },
  {
    name: 'Too much nitrogen',
    where: { all: 2 },
    signs: { claw: 3 },
    why: 'Very dark, glossy leaves with tips that hook downward like a claw point to more nitrogen than the plant can use.',
    check: 'Are you still using a grow formula in flower, or feeding above the label rate?',
    fix: 'Cut back nitrogen, and switch to a bloom formula once the plant is flowering.',
  },
  {
    name: 'Watering problem (too much or too little)',
    where: { all: 3 },
    signs: { droop: 3, claw: 1, yellowAll: 1 },
    why: 'Overwatered plants droop with heavy, firm leaves. Underwatered plants droop with thin, limp leaves. Both look sad from across the room.',
    check: 'Lift the pot. Heavy and wet means too much water. Light and dry means too little.',
    fix: 'Water only when the pot feels light, and water until a little runs out the bottom.',
  },
  {
    name: 'Heat or light stress',
    where: { upper: 3 },
    signs: { curlUp: 3, bleach: 3, edges: 1, tips: 1 },
    why: 'Leaves nearest the light curl their edges up like a taco or turn pale when they get more heat or light than they can handle.',
    check: 'Check canopy temperature and how close the light is. Compare your numbers with the free VPD and grow light calculators.',
    fix: 'Raise or dim the light, improve airflow across the canopy, and bring the room back into range.',
  },
  {
    name: 'Phosphorus deficiency',
    where: { lower: 3 },
    signs: { purple: 3, spots: 1 },
    why: 'Low phosphorus shows as dull, dark leaves with purple or red stems and bronze patches on the lower leaves.',
    check: 'Check for cold roots and low pH. Cold nights are the most common trigger.',
    fix: 'Keep the root zone warm, correct pH, and use a bloom nutrient in flower.',
  },
  {
    name: 'Powdery mildew',
    where: { lower: 1, upper: 1, all: 1 },
    signs: { powder: 5 },
    why: 'White, flour-like patches that wipe off the leaf surface are a fungus that thrives in still, humid air.',
    check: 'Check humidity and airflow, and look at the leaves that are crowded or shaded.',
    fix: 'Remove affected leaves, lower humidity, increase airflow and treat early. It spreads quickly.',
  },
  {
    name: 'Spider mites or other pests',
    where: { lower: 1, upper: 1, all: 1 },
    signs: { specks: 5 },
    why: 'Tiny pale dots on top of the leaf, with moving specks or fine webbing underneath, mean something is feeding on the plant.',
    check: 'Look at the underside of the leaf with a magnifier or your phone camera.',
    fix: 'Isolate the plant if you can, and start an integrated pest management routine straight away.',
  },
];

const EXAMPLE: { location: Location; symptoms: Symptom[] } = { location: 'lower', symptoms: ['interveinal', 'spots'] };

const APP_STORE_URL = appStoreUrl('cannabis-symptom-checker');
const PLAY_STORE_URL = playStoreUrl('cannabis-symptom-checker');

function rank(location: Location | null, symptoms: Symptom[]) {
  if (!symptoms.length) return [];
  return CAUSES.map((cause) => {
    const signScore = symptoms.reduce((sum, s) => sum + (cause.signs[s] ?? 0), 0);
    const matched = symptoms.filter((s) => cause.signs[s]).length;
    const score = signScore > 0 ? signScore + (location ? cause.where[location] ?? 0 : 0) + (matched > 1 ? 1 : 0) : 0;
    return { cause, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const faqItems = [
  {
    name: 'Why are my cannabis leaves turning yellow?',
    text: 'The most common causes are root-zone pH that is out of range, a nitrogen or magnesium deficiency, or watering problems. Where the yellowing starts matters most: lower leaves point to nutrients the plant can move, such as nitrogen and magnesium, while yellow new growth at the top points to iron or pH. Use the symptom checker on this page to narrow it down.',
  },
  {
    name: 'What causes brown spots on cannabis leaves?',
    text: 'Brown or rust spots are most often a calcium deficiency or a pH lockout that stops the plant taking up calcium and magnesium. Spots with brown, crispy edges can point to potassium. Check the pH of your water and runoff before adding any supplement.',
  },
  {
    name: 'Why are my cannabis leaves curling up?',
    text: 'Leaf edges that curl up like a taco usually mean heat or light stress at the top of the plant. Check canopy temperature, how close the light is, and your VPD. Leaves that claw downward and look very dark usually mean too much nitrogen or overwatering.',
  },
  {
    name: 'How accurate is this symptom checker?',
    text: 'It is a guide based on the most common patterns growers see, and several problems look alike. It cannot see your plant. For a closer answer, a photo-based plant health report in MasterGrowbot AI looks at your actual leaves and gives you a first action and fix steps.',
  },
  {
    name: 'Is the cannabis symptom checker free?',
    text: 'Yes. The symptom checker is free, needs no signup, and runs in your browser. MasterGrowbot AI is a separate app for photo-based plant health reports. Download MasterGrowbot AI free. Eligible new Pro subscribers can try 3 days free.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.name, acceptedAnswer: { '@type': 'Answer', text: item.text } })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.mastergrowbot.com/' },
    { '@type': 'ListItem', position: 2, name: 'Cannabis Symptom Checker', item: 'https://www.mastergrowbot.com/cannabis-symptom-checker' },
  ],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Cannabis Leaf Symptom Checker',
  description: 'Pick where the problem is and what the leaves look like to see the most likely causes of yellowing, spots, curling and drooping on cannabis plants.',
  url: 'https://www.mastergrowbot.com/cannabis-symptom-checker',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Organization', name: 'MasterGrowbot AI', url: 'https://www.mastergrowbot.com' },
};

// ─── Component ────────────────────────────────────────────────────────────────

const labelClass = 'text-xs font-semibold uppercase tracking-wider text-white/40 font-sans';

export default function SymptomChecker() {
  const [location, setLocation] = useState<Location | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);

  const results = rank(location, symptoms);
  const toggle = (s: Symptom) => setSymptoms((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  const loadExample = () => { setLocation(EXAMPLE.location); setSymptoms(EXAMPLE.symptoms); };
  const reset = () => { setLocation(null); setSymptoms([]); };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SEOHead
        title="Cannabis Leaf Symptom Checker: Free Tool | MasterGrowbot AI"
        description="Free cannabis leaf symptom checker. Pick what you see, from yellow leaves to brown spots, and get likely causes. Confirm with a photo in MasterGrowbot AI."
        canonicalUrl="https://www.mastergrowbot.com/cannabis-symptom-checker"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>

      <LandingNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/40 font-sans mb-8 flex-wrap">
          <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-white/60">Cannabis Symptom Checker</span>
        </nav>

        <header className="mb-8 space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-landing-green/30 bg-landing-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-landing-green font-sans">
            Free tool. No signup. Works on your phone.
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white font-sans">
            Cannabis Leaf Symptom Checker: Find What Is Wrong With Your Plant
          </h1>
          <p className="text-base sm:text-lg text-white/60 font-sans max-w-2xl leading-relaxed">
            Yellow leaves, brown spots, curling or drooping? Tap where the problem is and what you see. You get the most likely causes and the first thing to check, in under a minute.
          </p>
          <p className="text-sm text-white/40 font-sans">
            Want an answer from your actual plant? Snap a photo in{' '}
            <a href={APP_STORE_URL} data-cta-location="symptom-hero-text:ios" className="text-landing-green hover:underline">MasterGrowbot AI for iOS</a>{' '}
            or{' '}
            <a href={PLAY_STORE_URL} data-cta-location="symptom-hero-text:android" className="text-landing-green hover:underline">Android</a>. Eligible new Pro subscribers can try 3 days free.
          </p>
        </header>

        {/* ── CHECKER ───────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-landing-green/20 bg-gradient-to-b from-landing-green/[0.06] to-transparent p-5 sm:p-8 mb-6 shadow-[0_0_60px_-15px_rgba(74,222,128,0.15)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white font-sans">What does your plant look like?</h2>
            <div className="flex gap-2">
              <button type="button" onClick={loadExample} className="rounded-full border border-landing-green/40 px-3 py-1.5 text-xs font-semibold text-landing-green hover:bg-landing-green/10 transition font-sans">
                Try the example leaf
              </button>
              {(location || symptoms.length > 0) && (
                <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/60 hover:text-white transition font-sans">
                  <RotateCcw className="h-3 w-3" /> Start over
                </button>
              )}
            </div>
          </div>

          <div className="mb-7">
            <p className={`${labelClass} mb-3`}>Step 1. Where is the problem?</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {LOCATIONS.map((l) => (
                <button
                  key={l.key}
                  type="button"
                  aria-pressed={location === l.key}
                  onClick={() => setLocation(location === l.key ? null : l.key)}
                  className={`rounded-xl border px-4 py-3 text-left font-sans transition ${
                    location === l.key ? 'border-landing-green bg-landing-green/15' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="block text-sm font-semibold text-white">{l.label}</span>
                  <span className="block text-xs text-white/45">{l.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={`${labelClass} mb-3`}>Step 2. What do you see? Pick all that apply.</p>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={symptoms.includes(s.key)}
                  onClick={() => toggle(s.key)}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium font-sans transition ${
                    symptoms.includes(s.key) ? 'bg-landing-green text-black' : 'bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="mt-8 border-t border-white/[0.08] pt-6" aria-live="polite">
            {results.length === 0 ? (
              <p className="text-sm text-white/50 font-sans">Pick at least one thing you see, and the most likely causes will show here.</p>
            ) : (
              <>
                <p className={`${labelClass} mb-4`}>Most likely causes</p>
                <ol className="space-y-3">
                  {results.map(({ cause }, index) => (
                    <li key={cause.name} className={`rounded-2xl border p-5 ${index === 0 ? 'border-landing-green/35 bg-landing-green/[0.07]' : 'border-white/[0.08] bg-white/[0.03]'}`}>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider font-sans ${index === 0 ? 'bg-landing-green text-black' : 'bg-white/10 text-white/70'}`}>
                          {index === 0 ? 'Best match' : 'Also possible'}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white font-sans">{cause.name}</h3>
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-white/65 font-sans">{cause.why}</p>
                      <p className="mt-2.5 text-sm leading-relaxed text-white/80 font-sans"><strong className="text-white">Check first:</strong> {cause.check}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/80 font-sans"><strong className="text-white">Then:</strong> {cause.fix}</p>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 rounded-2xl border border-landing-green/25 bg-black/40 p-5 sm:p-6 text-center">
                  <h2 className="text-lg sm:text-xl font-bold text-white font-sans">Several problems look alike. A photo settles it.</h2>
                  <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-white/65 font-sans leading-relaxed">
                    Snap a photo of the leaf in MasterGrowbot AI. You get a plant health score, the most likely issue, what to do first and the steps to fix it.
                  </p>
                  <AppPlatformButtons campaign="cannabis-symptom-checker" location="symptom-checker-results" className="pt-4" />
                  <p className="mt-3 text-xs text-white/40 font-sans">Free download. Eligible new Pro subscribers can try 3 days free.</p>
                </div>
              </>
            )}
          </div>
        </div>
        <p className="mb-4 text-xs text-white/35 font-sans leading-relaxed">
          This checker is a guide to common patterns. It cannot see your plant, and it is not a diagnosis.
        </p>
      </div>

      {/* ── REAL REPORT FOR THE EXAMPLE LEAF ───────────────────────────── */}
      <RealReports
        campaign="cannabis-symptom-checker"
        location="symptom-checker"
        only="leaf"
        heading="See what the app said about this leaf"
        intro="We ran this exact photo through MasterGrowbot AI. This is the report it gave. Tap Try the example leaf above to compare it with the checker."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16">
        {/* ── REFERENCE TABLE ───────────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">Cannabis Leaf Symptoms Chart</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
            <table className="w-full min-w-[520px] text-sm font-sans">
              <thead>
                <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                  <th className="px-4 py-3 text-left text-white/45 font-semibold">What you see</th>
                  <th className="px-4 py-3 text-left text-white/45 font-semibold">Most likely cause</th>
                  <th className="px-4 py-3 text-left text-white/45 font-semibold">Check first</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {[
                  ['Lower leaves yellow all over', 'Nitrogen deficiency', 'Growth stage and feed strength'],
                  ['Lower leaves yellow between veins', 'Magnesium deficiency', 'Runoff pH'],
                  ['New growth yellow between veins', 'Iron lockout', 'High pH, wet roots'],
                  ['Brown or rust spots', 'Calcium deficiency or pH lockout', 'Water source and pH'],
                  ['Burnt tips only', 'Nutrient burn', 'Runoff EC'],
                  ['Brown, crispy edges', 'Potassium deficiency', 'pH, then bloom feed'],
                  ['Edges curling up at the top', 'Heat or light stress', 'Canopy temperature and light distance'],
                  ['Dark leaves clawing down', 'Too much nitrogen', 'Feed formula and rate'],
                  ['Drooping', 'Watering problem', 'Weight of the pot'],
                  ['White powder', 'Powdery mildew', 'Humidity and airflow'],
                  ['Tiny specks or webbing', 'Spider mites', 'Underside of the leaf'],
                ].map(([see, cause, check]) => (
                  <tr key={see} className="text-white/65 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{see}</td>
                    <td className="px-4 py-3 text-landing-green font-medium">{cause}</td>
                    <td className="px-4 py-3">{check}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-14 mb-16">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">How to Read Cannabis Leaf Problems</h2>
            <div className="space-y-4 text-base text-white/65 leading-relaxed font-sans">
              <p>
                Start with where, then what. Some nutrients can move inside the plant and some cannot. When a plant runs short of a nutrient it can move, such as nitrogen, magnesium or potassium, it takes it from the oldest leaves, so the trouble starts low. When it runs short of one it cannot move, such as calcium or iron, the newest growth at the top shows it first. That one clue removes half the possibilities.
              </p>
              <p>
                Next, look at the pattern on the leaf. Yellow between green veins, an even fade, spots, burnt tips and crispy edges each point somewhere different. Curling and drooping are usually about the room or the watering can, not the feed. That is why checking your environment with the free{' '}
                <Link to="/vpd-calculator" className="text-landing-green hover:underline">VPD calculator</Link> and{' '}
                <Link to="/grow-light-calculator" className="text-landing-green hover:underline">grow light calculator</Link> is worth a minute before you change your nutrients.
              </p>
              <p>
                Then check pH before you add anything. Most deficiencies in a fed plant are lockouts: the nutrient is in the pot but the roots cannot take it up. Adding more of it makes the problem worse. The{' '}
                <Link to="/grow-guides/cannabis-nutrient-deficiency-guide" className="text-landing-green hover:underline">cannabis nutrient deficiency guide</Link> walks through each one with what to do.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">When a Symptom Checker Is Not Enough</h2>
            <div className="space-y-4 text-base text-white/65 leading-relaxed font-sans">
              <p>
                A checklist can only work with what you tell it. Real plants often show two problems at once, and early signs are easy to misread. The example leaf on this page is a good case: the checker points to magnesium, pH lockout and calcium, and the app report for the same photo ties them together as a calcium and magnesium problem with a likely pH lockout behind it, then tells you what to do first.
              </p>
              <p>
                If you are losing leaves, if the problem is spreading, or if you are in flower and cannot afford to guess, use a photo. MasterGrowbot AI is built for exactly this moment. Download free with a 3-day trial for eligible new Pro subscribers on{' '}
                <a href={APP_STORE_URL} data-cta-location="symptom-body-text:ios" className="text-landing-green hover:underline">iOS</a>{' '}
                or{' '}
                <a href={PLAY_STORE_URL} data-cta-location="symptom-body-text:android" className="text-landing-green hover:underline">Android</a>.
              </p>
              <p>
                For more on every stage of the grow, visit the{' '}
                <Link to="/grow-guides" className="text-landing-green hover:underline">cannabis grow guides hub</Link>.
              </p>
            </div>
          </section>

          <section id="faq">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mb-5">Cannabis Symptom Checker FAQ</h2>
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

        <div className="mb-12 rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-landing-green font-sans">Your AI master grower, in your pocket.</h2>
          <p className="text-white/60 font-sans text-sm sm:text-base max-w-lg mx-auto">
            Snap a photo. Save your plant. Download MasterGrowbot AI for plant health reports, a grow journal and daily tasks. Eligible new Pro subscribers can try 3 days free.
          </p>
          <AppPlatformButtons campaign="cannabis-symptom-checker" location="symptom-closing" className="pt-2" />
          <div className="pt-3 flex flex-wrap items-center justify-center gap-5 text-sm text-white/30 font-sans">
            <Link to="/vpd-calculator" className="hover:text-landing-green transition-colors">VPD Calculator</Link>
            <Link to="/grow-light-calculator" className="hover:text-landing-green transition-colors">Grow Light Calculator</Link>
            <Link to="/grow-guides" className="hover:text-landing-green transition-colors">All Grow Guides</Link>
            <Link to="/" className="hover:text-landing-green transition-colors">MasterGrowbot AI Home</Link>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
