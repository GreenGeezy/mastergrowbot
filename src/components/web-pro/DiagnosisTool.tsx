import { type DragEvent, useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { diagnose, type Access, type WebReport } from '@/lib/webProApi';
import { trackEvent } from '@/lib/analytics';
import ReportCard from './ReportCard';
import { preparePhoto } from './image';

const STAGES = ['Seedling', 'Vegetative', 'Early Flower', 'Late Flower', 'Harvest'];
const METHODS = ['Indoor', 'Outdoor', 'Greenhouse'];
const fieldClass = 'mt-1.5 h-12 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-base text-white outline-none transition focus:border-landing-green focus:ring-2 focus:ring-landing-green/30';

type Props = { usage: Access['usage']; onUsage: (usage: Access['usage']) => void; onSaved: () => void };

export default function DiagnosisTool({ usage, onUsage, onSaved }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const result = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState<{ image: string; thumbnail: string | null } | null>(null);
  const [stage, setStage] = useState('');
  const [method, setMethod] = useState('Indoor');
  const [strain, setStrain] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState<'photo' | 'report' | null>(null);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ report: WebReport; photo: string; createdAt: string; saved: boolean } | null>(null);
  const left = Math.max(0, usage.limit - usage.used);

  useEffect(() => { if (done) result.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [done]);

  const choose = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setDone(null);
    setBusy('photo');
    try { setPhoto(await preparePhoto(file)); }
    catch (e) { setPhoto(null); setError(e instanceof Error ? e.message : 'That photo could not be opened.'); }
    setBusy(null);
  };
  const drop = (event: DragEvent) => { event.preventDefault(); if (!busy) void choose(event.dataTransfer.files[0]); };

  const run = async () => {
    if (!photo || busy) return;
    setBusy('report');
    setError('');
    setDone(null);
    trackEvent('web_pro_report_start');
    try {
      const answer = await diagnose({ ...photo, stage, method, strain, notes });
      onUsage(answer.usage);
      setDone({ report: answer.report, photo: photo.image, createdAt: new Date().toISOString(), saved: answer.saved });
      if (answer.saved) onSaved();
      trackEvent('web_pro_report_complete');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The report could not be created. Please try again.');
    }
    setBusy(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div>
        <div onDragOver={(e) => e.preventDefault()} onDrop={drop}>
          <button type="button" onClick={() => input.current?.click()} disabled={busy !== null} className="relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-white/20 bg-white/[0.03] px-6 text-center transition hover:border-landing-green/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-green disabled:cursor-wait">
            {photo ? <img src={photo.image} alt="Your cannabis plant, ready for a report" width={720} height={540} className="absolute inset-0 h-full w-full object-cover" /> : (
              <>
                <ImagePlus className="h-9 w-9 text-landing-green" aria-hidden="true" />
                <span className="mt-3 font-semibold text-white">{busy === 'photo' ? 'Preparing your photo' : 'Choose or drop a plant photo'}</span>
                <span className="mt-1.5 text-sm text-white/60">Sharp, close, and in white light works best</span>
              </>
            )}
          </button>
        </div>
        <input ref={input} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-label="Plant photo" onChange={(e) => { void choose(e.target.files?.[0]); e.target.value = ''; }} />
        {photo && <button type="button" onClick={() => input.current?.click()} disabled={busy !== null} className="mt-3 text-sm font-semibold text-landing-green hover:underline">Choose a different photo</button>}

        <div className="mt-5 grid grid-cols-2 gap-3 font-sans text-sm text-white/75">
          <label>Stage
            <select value={stage} onChange={(e) => setStage(e.target.value)} className={fieldClass}><option value="">Not sure</option>{STAGES.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label>Grow setting
            <select value={method} onChange={(e) => setMethod(e.target.value)} className={fieldClass}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
          </label>
          <label className="col-span-2">Strain (optional)
            <input value={strain} maxLength={80} onChange={(e) => setStrain(e.target.value)} className={fieldClass} />
          </label>
          <label className="col-span-2">What changed lately? (optional)
            <textarea value={notes} maxLength={400} rows={2} onChange={(e) => setNotes(e.target.value)} placeholder="Last watering, feed, pH, temperature, humidity" className={`${fieldClass} h-auto py-3 placeholder:text-white/40`} />
          </label>
        </div>

        <button type="button" onClick={run} disabled={!photo || busy !== null || left === 0} className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-landing-green text-base font-bold text-black transition hover:bg-landing-green/90 disabled:cursor-not-allowed disabled:opacity-50">
          {busy === 'report' && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}{busy === 'report' ? 'Reading your plant' : 'Get my plant report'}
        </button>
        <p className="mt-3 text-center text-sm text-white/60" aria-live="polite">
          {busy === 'report' ? 'This usually takes under a minute. Keep this page open.' : `${left} of ${usage.limit} photo reports left this week`}
        </p>
        <p role="alert" className={error ? 'mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-200' : 'sr-only'}>{error}</p>
      </div>

      <div ref={result} className="scroll-mt-28" aria-live="polite">
        {done ? (
          <>
            <ReportCard report={done.report} photo={done.photo} createdAt={done.createdAt} photoOnPaperOnly />
            <p className="mt-3 text-sm text-white/60">{done.saved ? 'Saved to your reports.' : 'This report was not saved. Print it or save it as a PDF to keep it.'}</p>
          </>
        ) : (
          <div className="flex h-full min-h-64 flex-col justify-center rounded-3xl border border-white/10 bg-white/[0.02] p-7 font-sans">
            <h3 className="font-sans text-lg font-bold text-white">Get a better report</h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-white/70 marker:text-landing-green">
              <li>Turn off purple or blue grow lights and use white light.</li>
              <li>Fill the frame with the leaf or bud that worries you.</li>
              <li>Add your last pH, temperature and humidity if you know them.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
