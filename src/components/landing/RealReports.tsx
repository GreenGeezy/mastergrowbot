import { useState } from 'react';
import { AppPlatformButtons } from '@/components/landing/cta';

/**
 * Actual MasterGrowbot AI plant health reports for the three photos below.
 * Each report is the app's own diagnosis output for that photo (generated November 2026),
 * with punctuation normalised. Do not edit the report text by hand: re-run the photo instead.
 */
type Report = {
  key: string;
  tab: string;
  image: string;
  alt: string;
  photoNote: string;
  diagnosis: string;
  healthScore: number;
  healthLabel: string;
  growthStage: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  topAction: string;
  steps: string[];
  extraLabel: string;
  extraValue: string;
};

export const realReports: Report[] = [
  {
    key: 'leaf',
    tab: 'Sick leaf',
    image: '/images/grow/cannabis-leaf-yellowing-brown-spots.webp',
    alt: 'Cannabis fan leaf with yellowing between the veins and brown spots, analyzed by MasterGrowbot AI',
    photoNote: 'Yellowing between the veins with brown spots on a fan leaf.',
    diagnosis: 'Calcium and Magnesium Deficiency (Likely Root-Zone pH Lockout)',
    healthScore: 55,
    healthLabel: 'Suboptimal',
    growthStage: 'Vegetative',
    confidence: 85,
    severity: 'medium',
    topAction: 'Check and adjust the pH of your water and root-zone runoff, then add a Cal-Mag supplement.',
    steps: [
      'Measure the pH of your nutrient water before feeding (aim for 6.2 to 6.8 in soil, or 5.8 to 6.2 in coco/hydro).',
      'Test the pH and EC of the runoff water draining out the bottom of the pot to rule out root-zone lockout.',
      'Add a standard Calcium-Magnesium (Cal-Mag) supplement at 2-5 mL per gallon during your next scheduled feeding.',
    ],
    extraLabel: 'Targets',
    extraValue: 'pH 6.3, EC 1.4',
  },
  {
    key: 'tent',
    tab: 'Flowering plant',
    image: '/images/grow/flowering-cannabis-plant-led-tent.webp',
    alt: 'Flowering cannabis plant under an LED light in a grow tent at 78.1F and 52 percent humidity, analyzed by MasterGrowbot AI',
    photoNote: 'A whole plant in flower under LED, with the room at 78.1F and 52% humidity.',
    diagnosis: 'Healthy',
    healthScore: 95,
    healthLabel: 'Thriving',
    growthStage: 'Late Flower',
    confidence: 92,
    severity: 'low',
    topAction: 'Maintain current climate and support heavy developing colas as buds fatten',
    steps: [
      'Keep air circulating well through the lower and middle canopy to avoid mold',
      'Maintain the light distance so top buds do not overheat as they swell',
      'Continue feeding phosphorus and potassium-rich bloom nutrients while easing back on nitrogen',
    ],
    extraLabel: 'Harvest window',
    extraValue: '3-5 Weeks',
  },
  {
    key: 'trichomes',
    tab: 'Trichomes',
    image: '/images/grow/cannabis-trichomes-macro.webp',
    alt: 'Macro photo of cannabis trichomes and orange pistils on a ripe bud, analyzed by MasterGrowbot AI',
    photoNote: 'A close-up of trichomes and pistils on a ripe bud.',
    diagnosis: 'Healthy (Peak Ripeness)',
    healthScore: 95,
    healthLabel: 'Thriving',
    growthStage: 'Harvest',
    confidence: 92,
    severity: 'low',
    topAction: 'Monitor trichomes with a magnifying loupe and prepare to harvest within the next few days.',
    steps: [
      'Verify trichome maturity across middle and lower buds, not just the top cola.',
      'Lower room humidity to around 40-45% to prevent mold on these dense flowers.',
      'Prepare your clean, dark, climate-controlled drying space (around 60F and 60% relative humidity).',
    ],
    extraLabel: 'Harvest window',
    extraValue: 'Harvest Now (0-7 days)',
  },
];

const scoreTone = (score: number) =>
  score >= 80 ? { text: 'text-landing-green', ring: 'border-landing-green/40 bg-landing-green/10' }
  : score >= 60 ? { text: 'text-yellow-400', ring: 'border-yellow-400/40 bg-yellow-400/10' }
  : { text: 'text-orange-400', ring: 'border-orange-400/40 bg-orange-400/10' };

interface RealReportsProps {
  campaign: string;
  location: string;
  /** Show only one example (no tabs). */
  only?: Report['key'];
  heading?: string;
  intro?: string;
  headingLevel?: 'h2' | 'h3';
  className?: string;
}

export default function RealReports({
  campaign,
  location,
  only,
  heading = 'One photo in. A clear plan out.',
  intro = 'These are actual MasterGrowbot AI reports for the photos shown. Snap your own plant and get the same kind of answer in seconds.',
  headingLevel = 'h2',
  className = '',
}: RealReportsProps) {
  const list = only ? realReports.filter((r) => r.key === only) : realReports;
  const [active, setActive] = useState(list[0].key);
  const report = list.find((r) => r.key === active) ?? list[0];
  const tone = scoreTone(report.healthScore);
  const Heading = headingLevel;

  return (
    <section className={`px-4 sm:px-6 py-14 sm:py-20 ${className}`} aria-labelledby={`real-reports-${location}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-landing-green font-sans">Real app reports</p>
          <Heading id={`real-reports-${location}`} className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">{heading}</Heading>
          <p className="mt-3 text-base text-white/60 font-sans leading-relaxed">{intro}</p>
        </div>

        {list.length > 1 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Example plant photos">
            {list.map((r) => (
              <button
                key={r.key}
                type="button"
                role="tab"
                aria-selected={r.key === report.key}
                onClick={() => setActive(r.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold font-sans transition ${
                  r.key === report.key ? 'bg-landing-green text-black' : 'bg-white/[0.06] text-white/65 hover:bg-white/[0.12] hover:text-white'
                }`}
              >
                {r.tab}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <figure className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <img
              src={report.image}
              alt={report.alt}
              width={1448}
              height={1086}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full flex-1 object-cover lg:aspect-auto lg:min-h-0"
            />
            <figcaption className="flex items-center gap-2 px-5 py-3.5 text-sm text-white/60 font-sans">
              <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white/70">The photo</span>
              {report.photoNote}
            </figcaption>
          </figure>

          <div className="rounded-3xl border border-landing-green/25 bg-gradient-to-b from-landing-green/[0.07] to-transparent p-5 sm:p-7 shadow-[0_0_60px_-20px_rgba(74,222,128,0.25)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-landing-green font-sans">The MasterGrowbot AI report</p>
                <p className="mt-2 text-xl sm:text-2xl font-bold leading-snug text-white font-sans">{report.diagnosis}</p>
              </div>
              <div className={`flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-2xl border ${tone.ring}`}>
                <span className={`text-3xl font-bold leading-none font-sans ${tone.text}`}>{report.healthScore}</span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/55 font-sans">Health</span>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-2 text-center font-sans">
              {[
                ['Stage', report.growthStage],
                ['Confidence', `${report.confidence}%`],
                [report.extraLabel, report.extraValue],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/[0.08] bg-black/30 px-2 py-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 rounded-2xl border border-landing-green/25 bg-landing-green/[0.08] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-landing-green font-sans">Do this first</p>
              <p className="mt-1.5 text-sm sm:text-base font-semibold leading-snug text-white font-sans">{report.topAction}</p>
            </div>

            <ol className="mt-4 space-y-2.5">
              {report.steps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-white/70 font-sans">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>

            <p className="mt-5 text-xs leading-relaxed text-white/40 font-sans">
              Actual app report for this photo, generated November 2026. A report is guidance from a photo, not a lab test. Results vary with the photo.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-base font-semibold text-white font-sans">Snap a photo. Save your plant. Try MasterGrowbot AI free.</p>
          <AppPlatformButtons campaign={campaign} location={`${location}-real-reports`} className="pt-4" />
          <p className="mt-3 text-xs text-white/40 font-sans">Free download. Eligible new Pro subscribers can try 3 days free.</p>
        </div>
      </div>
    </section>
  );
}
