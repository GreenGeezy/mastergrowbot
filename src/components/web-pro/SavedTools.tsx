import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { buildPlan, emptyProfile, localToday, prettyDate as prettyDay, type Profile } from '@/pages/growWeek/growWeekData';
import {
  addChecklist, clearChecklist, deleteCalc, deleteReport, listCalcs, listChecklist, listReports, saveCalc, setChecklistDone,
  type CalcKind, type ChecklistItem, type SavedCalc, type SavedReport,
} from '@/lib/webProApi';
import ReportCard, { prettyDate } from './ReportCard';
import { dli, LEAF_OFFSETS, LIGHT_STAGES, leafVpd, rangeState, readNumber, VPD_STAGES, type LeafLight, type LightStage, type VpdStage } from './growMath';

const panelClass = 'rounded-3xl border border-white/10 bg-white/[0.03] p-5 font-sans sm:p-6';
const fieldClass = 'mt-1.5 h-12 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-base text-white outline-none transition focus:border-landing-green focus:ring-2 focus:ring-landing-green/30';
const saveClass = 'mt-5 h-12 w-full rounded-full bg-landing-green text-sm font-bold text-black transition hover:bg-landing-green/90 disabled:cursor-not-allowed disabled:opacity-50';
const STATE_TEXT = { low: 'Below target', ok: 'In range', high: 'Above target' } as const;
const message = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong. Please try again.');

export function Notice({ children, onRetry }: { children: ReactNode; onRetry?: () => void }) {
  return (
    <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 font-sans text-sm leading-relaxed text-red-200">
      {children} {onRetry && <button type="button" onClick={onRetry} className="font-semibold underline">Try again</button>}
    </p>
  );
}

const Empty = ({ children }: { children: ReactNode }) => <p className={`${panelClass} text-white/65`}>{children}</p>;

export function ReportsTab({ userId, refresh }: { userId: string; refresh: number }) {
  const [items, setItems] = useState<SavedReport[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    setError('');
    listReports(userId).then(setItems).catch((e) => setError(message(e)));
  }, [userId]);
  useEffect(load, [load, refresh]);

  const remove = async (id: string) => {
    setError('');
    try { await deleteReport(userId, id); setItems((cur) => cur?.filter((i) => i.id !== id) ?? null); if (open === id) setOpen(null); }
    catch (e) { setError(message(e)); }
  };

  if (error && !items) return <Notice onRetry={load}>{error}</Notice>;
  if (!items) return <Empty>Loading your reports.</Empty>;
  if (!items.length) return <Empty>Your reports will appear here. Choose a photo in the Plant report tab to make the first one.</Empty>;
  const current = items.find((i) => i.id === open) ?? items[0];
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div>
        {error && <div className="mb-3"><Notice>{error}</Notice></div>}
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className={`flex items-center gap-2 rounded-2xl border p-2 ${item.id === current.id ? 'border-landing-green/40 bg-landing-green/[0.07]' : 'border-white/10 bg-white/[0.02]'}`}>
              <button type="button" onClick={() => setOpen(item.id)} aria-pressed={item.id === current.id} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                {item.thumbnail ? <img src={item.thumbnail} alt="" width={56} height={56} className="h-14 w-14 flex-shrink-0 rounded-xl object-cover" /> : <span className="h-14 w-14 flex-shrink-0 rounded-xl bg-white/[0.06]" aria-hidden="true" />}
                <span className="min-w-0">
                  <span className="block truncate font-sans text-sm font-semibold text-white">{item.report.diagnosis}</span>
                  <span className="block font-sans text-xs text-white/60">{prettyDate(item.createdAt)}, health {item.report.healthScore}</span>
                </span>
              </button>
              <button type="button" onClick={() => remove(item.id)} aria-label={`Delete report: ${item.report.diagnosis}`} className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-white/45 hover:bg-white/10 hover:text-white"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
            </li>
          ))}
        </ul>
      </div>
      <ReportCard key={current.id} report={current.report} photo={current.thumbnail} createdAt={current.createdAt} />
    </div>
  );
}

function Result({ value, state, target }: { value: string; state: 'low' | 'ok' | 'high' | null; target: string }) {
  return (
    <div className={`mt-5 rounded-2xl border p-4 ${state === 'ok' ? 'border-landing-green/35 bg-landing-green/[0.08]' : 'border-white/15 bg-black/30'}`} aria-live="polite">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-white/70">{state ? `${STATE_TEXT[state]}. ` : ''}{target}</p>
    </div>
  );
}

export function NumbersTab({ userId }: { userId: string }) {
  const [saved, setSaved] = useState<SavedCalc[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<CalcKind | null>(null);
  const [temp, setTemp] = useState('77');
  const [rh, setRh] = useState('60');
  const [leafLight, setLeafLight] = useState<LeafLight>('led');
  const [vpdStage, setVpdStage] = useState<VpdStage>('vegetative');
  const [ppfd, setPpfd] = useState('500');
  const [hours, setHours] = useState('18');
  const [lightStage, setLightStage] = useState<LightStage>('vegetative');
  const [profile, setProfile] = useState<Profile>(emptyProfile);

  const load = useCallback(() => {
    setError('');
    listCalcs(userId).then(setSaved).catch((e) => setError(message(e)));
  }, [userId]);
  useEffect(load, [load]);

  const t = readNumber(temp, 40, 110);
  const h = readNumber(rh, 1, 100);
  const vpd = t !== null && h !== null ? leafVpd(t, h, LEAF_OFFSETS[leafLight].offset) : null;
  const v = VPD_STAGES[vpdStage];
  const vpdState = vpd === null ? null : rangeState(vpd, v.min, v.max);

  const p = readNumber(ppfd, 1, 2500);
  const hr = readNumber(hours, 1, 24);
  const light = p !== null && hr !== null ? dli(p, hr) : null;
  const l = LIGHT_STAGES[lightStage];
  const lightState = light === null ? null : rangeState(light, l.min, l.max);

  const plan = buildPlan(profile, localToday());
  const planText = plan ? `${plan.beforeStart ? 'Not sprouted yet' : `Week ${plan.week}`}${plan.phase ? `, ${plan.phase.label}` : ''}` : '';
  const windowText = plan ? `Estimated harvest window: ${prettyDay(plan.windowStart)} to ${prettyDay(plan.windowEnd, true)}` : 'Enter the sprout date to see your week.';

  const save = async (kind: CalcKind, content: string, values: Record<string, unknown>) => {
    setBusy(kind);
    setError('');
    try { await saveCalc(userId, kind, content, values); setSaved(await listCalcs(userId)); }
    catch (e) { setError(message(e)); }
    setBusy(null);
  };
  const remove = async (id: string) => {
    setError('');
    try { await deleteCalc(userId, id); setSaved((cur) => cur?.filter((i) => i.id !== id) ?? null); }
    catch (e) { setError(message(e)); }
  };

  return (
    <div className="space-y-6">
      {error && <Notice onRetry={load}>{error}</Notice>}
      <div className="grid gap-5 lg:grid-cols-3">
        <section className={panelClass}>
          <h3 className="font-sans text-lg font-bold text-white">Leaf VPD</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-white/75">
            <label>Air temp (F)<input inputMode="decimal" value={temp} onChange={(e) => setTemp(e.target.value)} className={fieldClass} /></label>
            <label>Humidity (%)<input inputMode="decimal" value={rh} onChange={(e) => setRh(e.target.value)} className={fieldClass} /></label>
            <label>Light<select value={leafLight} onChange={(e) => setLeafLight(e.target.value as LeafLight)} className={fieldClass}>{Object.entries(LEAF_OFFSETS).map(([k, o]) => <option key={k} value={k}>{o.label}</option>)}</select></label>
            <label>Stage<select value={vpdStage} onChange={(e) => setVpdStage(e.target.value as VpdStage)} className={fieldClass}>{Object.entries(VPD_STAGES).map(([k, o]) => <option key={k} value={k}>{o.label}</option>)}</select></label>
          </div>
          <Result value={vpd === null ? 'Check your numbers' : `${vpd.toFixed(2)} kPa`} state={vpdState} target={`Target ${v.min.toFixed(1)} to ${v.max.toFixed(1)} kPa`} />
          <button type="button" disabled={vpd === null || busy !== null} onClick={() => save('vpd', `Leaf VPD ${vpd!.toFixed(2)} kPa at ${t}F and ${h}% humidity, ${v.label} (${STATE_TEXT[vpdState!]})`, { temp: t, rh: h, light: leafLight, stage: vpdStage, vpd })} className={saveClass}>{busy === 'vpd' ? 'Saving' : 'Save VPD reading'}</button>
        </section>

        <section className={panelClass}>
          <h3 className="font-sans text-lg font-bold text-white">Daily light</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-white/75">
            <label>PPFD<input inputMode="decimal" value={ppfd} onChange={(e) => setPpfd(e.target.value)} className={fieldClass} /></label>
            <label>Hours on<input inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} className={fieldClass} /></label>
            <label className="col-span-2">Stage<select value={lightStage} onChange={(e) => setLightStage(e.target.value as LightStage)} className={fieldClass}>{Object.entries(LIGHT_STAGES).map(([k, o]) => <option key={k} value={k}>{o.label}</option>)}</select></label>
          </div>
          <Result value={light === null ? 'Check your numbers' : `${light.toFixed(1)} DLI`} state={lightState} target={`Target ${l.min} to ${l.max} mol per day`} />
          <button type="button" disabled={light === null || busy !== null} onClick={() => save('light', `DLI ${light!.toFixed(1)} from ${p} PPFD for ${hr} hours, ${l.label} (${STATE_TEXT[lightState!]})`, { ppfd: p, hours: hr, stage: lightStage, dli: light })} className={saveClass}>{busy === 'light' ? 'Saving' : 'Save light reading'}</button>
        </section>

        <section className={panelClass}>
          <h3 className="font-sans text-lg font-bold text-white">Grow week</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-white/75">
            <label className="col-span-2">Sprout date<input type="date" value={profile.sprout} onChange={(e) => setProfile({ ...profile, sprout: e.target.value })} className={`${fieldClass} [color-scheme:dark]`} /></label>
            <label>Plant type<select value={profile.type} onChange={(e) => setProfile({ ...profile, type: e.target.value as Profile['type'] })} className={fieldClass}><option value="photo">Photoperiod</option><option value="auto">Autoflower</option></select></label>
            {profile.type === 'photo'
              ? <label>Flip date<input type="date" value={profile.flip} onChange={(e) => setProfile({ ...profile, flip: e.target.value })} className={`${fieldClass} [color-scheme:dark]`} /></label>
              : <label>Total weeks<input type="number" min={9} max={16} value={profile.autoWeeks} onChange={(e) => setProfile({ ...profile, autoWeeks: Number(e.target.value) || 11 })} className={fieldClass} /></label>}
          </div>
          <Result value={plan ? planText : 'Add a date'} state={null} target={windowText} />
          <button type="button" disabled={!plan || busy !== null} onClick={() => save('week', `${planText}. ${windowText}`, { ...profile })} className={saveClass}>{busy === 'week' ? 'Saving' : 'Save grow week'}</button>
        </section>
      </div>

      <section className={panelClass}>
        <h3 className="font-sans text-lg font-bold text-white">Saved numbers</h3>
        {!saved ? <p className="mt-3 text-sm text-white/60">{error ? 'Not loaded.' : 'Loading.'}</p> : saved.length === 0 ? <p className="mt-3 text-sm text-white/60">Readings you save will build up here, so you can compare one grow with the next.</p> : (
          <ul className="mt-3 divide-y divide-white/10">
            {saved.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-2">
                <span className="text-sm text-white/80">{item.content}<span className="block text-xs text-white/55">{prettyDate(item.createdAt)}</span></span>
                <button type="button" onClick={() => remove(item.id)} aria-label={`Delete: ${item.content}`} className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-white/45 hover:bg-white/10 hover:text-white"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const TEMPLATES: { label: string; items: string[] }[] = [
  { label: 'Weekly check', items: ['Look under several leaves for pests', 'Check runoff pH and EC', 'Record day and night temperature and humidity', 'Measure light distance to the canopy', 'Clear dead leaves and wipe surfaces'] },
  { label: 'Leaf problem', items: ['Photograph the leaf in white light', 'Note whether old or new leaves are affected', 'Test the pH of water going in and runoff coming out', 'Change one thing only, then wait 3 days', 'Take a follow-up photo of the same leaf'] },
  { label: 'Flower switch', items: ['Set the light to 12 hours on, 12 off', 'Check the tent for light leaks', 'Lower humidity toward 50 percent', 'Remove weak lower growth', 'Write down the switch date'] },
  { label: 'Harvest prep', items: ['Check trichomes on top, middle and lower buds', 'Set up drying space near 60F and 60 percent humidity', 'Clean scissors and gather jars', 'Photograph each plant before cutting', 'Write down the harvest date'] },
];

export function ChecklistTab({ userId }: { userId: string }) {
  const [items, setItems] = useState<ChecklistItem[] | null>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => {
    setError('');
    listChecklist(userId).then(setItems).catch((e) => setError(message(e)));
  }, [userId]);
  useEffect(load, [load]);

  const act = async (work: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try { await work(); setItems(await listChecklist(userId)); return true; }
    catch (e) { setError(message(e)); return false; }
    finally { setBusy(false); }
  };
  const add = async (titles: string[]) => act(() => addChecklist(userId, titles));
  const finished = items?.filter((i) => i.done).map((i) => i.id) ?? [];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <section className={panelClass}>
        <h3 className="font-sans text-lg font-bold text-white">Start from a checklist</h3>
        <div className="mt-4 grid gap-2">
          {TEMPLATES.map((template) => (
            <button key={template.label} type="button" disabled={busy} onClick={() => add(template.items)} className="flex min-h-12 items-center justify-between rounded-2xl border border-white/15 px-4 text-left text-sm font-semibold text-white transition hover:border-landing-green/50 disabled:opacity-50">
              {template.label}<span className="text-xs font-normal text-white/55">{template.items.length} steps</span>
            </button>
          ))}
        </div>
        <form className="mt-5" onSubmit={async (e) => { e.preventDefault(); const title = text.trim(); if (title && await add([title])) setText(''); }}>
          <label className="text-sm text-white/75">Add your own step<input value={text} maxLength={160} onChange={(e) => setText(e.target.value)} className={fieldClass} /></label>
          <button type="submit" disabled={busy || !text.trim()} className={saveClass}>Add step</button>
        </form>
      </section>
      <section className={panelClass}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-sans text-lg font-bold text-white">Your checklist</h3>
          {finished.length > 0 && <button type="button" disabled={busy} onClick={() => act(() => clearChecklist(userId, finished))} className="min-h-11 text-sm font-semibold text-landing-green hover:underline">Clear finished</button>}
        </div>
        {error && <div className="mt-3"><Notice onRetry={load}>{error}</Notice></div>}
        {!items ? <p className="mt-3 text-sm text-white/60">{error ? 'Not loaded.' : 'Loading.'}</p> : items.length === 0 ? <p className="mt-3 text-sm text-white/60">Pick a checklist to begin.</p> : (
          <ul className="mt-3 divide-y divide-white/10">
            {items.map((item) => (
              <li key={item.id}>
                <label className="flex min-h-12 cursor-pointer items-center gap-3 py-2 text-sm">
                  <input type="checkbox" checked={item.done} disabled={busy} onChange={(e) => act(() => setChecklistDone(userId, item.id, e.target.checked))} className="h-5 w-5 flex-shrink-0 accent-[#1DB954]" />
                  <span className={item.done ? 'text-white/50 line-through' : 'text-white/85'}>{item.title}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
