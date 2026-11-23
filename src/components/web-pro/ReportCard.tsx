import { Printer } from 'lucide-react';
import type { WebReport } from '@/lib/webProApi';

// Kept inline so no extra stylesheet is added to the site's statically built pages.
const PRINT_CSS = `@media print {
  @page { margin: 16mm; }
  html, body.wp-printing { background: #fff !important; }
  body.wp-printing * { visibility: hidden !important; }
  body.wp-printing .wp-print-area, body.wp-printing .wp-print-area * { visibility: visible !important; color: #111 !important; }
  body.wp-printing .wp-print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; border: 0 !important; background: #fff !important; }
  body.wp-printing .wp-print-area img { max-height: 260px; max-width: 360px; width: auto; }
  body.wp-printing .wp-no-print { display: none !important; }
}`;

const tone = (score: number) =>
  score >= 80 ? 'border-landing-green/40 bg-landing-green/10 text-landing-green'
  : score >= 60 ? 'border-yellow-400/40 bg-yellow-400/10 text-yellow-300'
  : 'border-orange-400/40 bg-orange-400/10 text-orange-300';

export const prettyDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

/** One report, on screen and on paper. */
export default function ReportCard({ report, photo, createdAt, photoOnPaperOnly = false }: { report: WebReport; photo?: string | null; createdAt: string; photoOnPaperOnly?: boolean }) {
  const targets = [
    ['pH', report.targets?.ph], ['EC', report.targets?.ec], ['VPD', report.targets?.vpd],
    ['Temperature', report.targets?.temp], ['Humidity', report.targets?.rh],
  ].filter(([, value]) => value);

  const print = () => {
    document.body.classList.add('wp-printing');
    const done = () => { document.body.classList.remove('wp-printing'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  };

  return (
    <article className="wp-print-area rounded-3xl border border-landing-green/25 bg-gradient-to-b from-landing-green/[0.07] to-transparent p-5 font-sans sm:p-7" aria-label={`Plant report: ${report.diagnosis}`}>
      <style>{PRINT_CSS}</style>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-landing-green">Plant report, {prettyDate(createdAt)}</p>
          <h3 className="mt-2 font-sans text-xl font-bold leading-snug text-white sm:text-2xl">{report.diagnosis}</h3>
        </div>
        <div className={`flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-2xl border ${tone(report.healthScore)}`}>
          <span className="text-3xl font-bold leading-none">{report.healthScore}</span>
          <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/65">Health</span>
        </div>
      </div>

      {photo && <img src={photo} alt={`Cannabis plant photo used for this report: ${report.diagnosis}`} width={720} height={540} className={`mt-5 max-h-80 w-full rounded-2xl object-cover ${photoOnPaperOnly ? 'hidden print:block' : ''}`} />}

      <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
        {[['Stage', report.growthStage], ['Confidence', `${report.confidence}%`], ['Severity', report.severity[0].toUpperCase() + report.severity.slice(1)]].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-black/30 px-2 py-3">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/55">{label}</dt>
            <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 rounded-2xl border border-landing-green/25 bg-landing-green/[0.08] p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-landing-green">Do this first</p>
        <p className="mt-1.5 font-semibold leading-snug text-white">{report.topAction}</p>
      </div>

      <h4 className="mt-5 font-sans text-sm font-semibold text-white">Fix steps</h4>
      <ol className="mt-2.5 space-y-2.5">
        {report.fixSteps.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm leading-relaxed text-white/80">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white" aria-hidden="true">{index + 1}</span>{step}
          </li>
        ))}
      </ol>

      {targets.length > 0 && (
        <>
          <h4 className="mt-5 font-sans text-sm font-semibold text-white">Targets to check</h4>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {targets.map(([label, value]) => <li key={label} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-sm text-white/80"><strong className="text-white">{label}</strong> {value}</li>)}
          </ul>
        </>
      )}
      {report.environmentSummary && <p className="mt-5 text-sm leading-relaxed text-white/75"><strong className="text-white">Environment:</strong> {report.environmentSummary}</p>}
      {report.preventionTips.length > 0 && (
        <>
          <h4 className="mt-5 font-sans text-sm font-semibold text-white">Prevent it next time</h4>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-white/75">{report.preventionTips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
        </>
      )}
      {report.recheck && <p className="mt-5 text-sm leading-relaxed text-white/75"><strong className="text-white">Check again:</strong> {report.recheck}</p>}

      <p className="mt-5 text-xs leading-relaxed text-white/55">Guidance from one photo, not a lab test. Confirm with a measurement before you change feed or treat the plant. MasterGrowbot AI, www.mastergrowbot.com</p>
      <button type="button" onClick={print} className="wp-no-print mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition hover:border-landing-green/60">
        <Printer className="h-4 w-4" aria-hidden="true" /> Print or save as PDF
      </button>
    </article>
  );
}
