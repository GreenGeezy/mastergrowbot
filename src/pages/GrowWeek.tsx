import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CalendarPlus, Check, ClipboardCopy, Image as ImageIcon, Link2, Plus, Trash2 } from 'lucide-react';
import NewsletterSignup from '@/components/landing/NewsletterSignup';
import { appStoreUrl, playStoreUrl } from '@/components/landing/ctaLinks';
import { trackEvent } from '@/lib/analytics';
import { rememberReferral, withReferral } from '@/lib/referral';
import {
  buildCalendar, buildPlan, buildPrompt, emptyProfile, exampleLog, exampleProfile, exampleQuestion, exampleToday, fToC, isSaved,
  legacyKey, localToday, parseDay, phases, phPlan, prettyDate, readingFlags, readLegacy, storageKey, toolUrl, validReading,
} from './growWeek/growWeekData';
import type { LogEntry, Medium, Plan, Profile, Saved } from './growWeek/growWeekData';
import { drawPlanCard } from './growWeek/planCard';
import './growWeek/grow-week.css';

const title = 'Cannabis Grow Calendar, Week by Week | MasterGrowbot AI';
const description = 'Free cannabis grow calendar: enter your sprout and flip dates to see your week, stage ranges and reminders. Then try the MasterGrowbot AI app.';
const faqs = [
  { q: 'How do I know what week of flower I am in?', a: 'For a photoperiod plant, count from the day the light changed to 12 hours on and 12 off. Grow Week does this for you and also shows the week since sprouting. For an autoflower, flowering usually starts around week four or five from sprout, so the flower week is an estimate.' },
  { q: 'How accurate is the harvest date?', a: 'It is an estimate built from the breeder time you enter. Grow Week shows a two-week harvest window and reminds you to start trichome checks before it. Trichomes, not the calendar, decide when to harvest.' },
  { q: 'Where are my notes and readings stored?', a: 'Only in your browser, and only if you choose to save. Nothing you type is uploaded or sent to analytics. The AI check-in is text you copy and paste yourself.' },
  { q: 'Do I need an account?', a: 'No. Grow Week is free and needs no account. The calendar file works with Google Calendar, Apple Calendar and Outlook.' },
];

type Mode = 'example' | 'mine';
const blankEntry = (date: string): LogEntry => ({ date, tempF: '', rh: '', ph: '', note: '' });

export default function GrowWeek() {
  const [mode, setMode] = useState<Mode>('example');
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [question, setQuestion] = useState('');
  const [today, setToday] = useState<number>(exampleToday);
  const [saved, setSaved] = useState<string | null>(null);
  const [welcome, setWelcome] = useState('');
  const [legacyPhotos, setLegacyPhotos] = useState<string[]>([]);
  const [entry, setEntry] = useState<LogEntry>(blankEntry(''));
  const [entryError, setEntryError] = useState('');
  const [status, setStatus] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [requested, setRequested] = useState<string | null>(null);
  const [links, setLinks] = useState({ news: '/newsletter', workbench: '/downloads/cannabis-ai-at-work.html?utm_source=grow_week&utm_medium=website&utm_campaign=workbench' });
  const started = useRef(false);
  const planned = useRef(false);
  const promptRef = useRef<HTMLPreElement>(null);
  const resultRef = useRef<HTMLElement>(null);

  // Read saved work after mount so the server-rendered example and the first browser render match.
  useEffect(() => {
    rememberReferral();
    const now = localToday(); setToday(now); setEntry(blankEntry(isoOf(now)));
    setLinks({
      news: withReferral('/newsletter', { utm_source: 'grow_week', utm_medium: 'website', utm_campaign: 'weekly_edition' }),
      workbench: withReferral('/downloads/cannabis-ai-at-work.html', { utm_source: 'grow_week', utm_medium: 'website', utm_campaign: 'workbench' }),
    });
    try { setRequested(localStorage.getItem('mgb.newsletter.requested')); } catch { /* optional */ }
    let stored: unknown = null; let legacy: unknown = null;
    try { stored = JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { /* ignore */ }
    try { legacy = JSON.parse(localStorage.getItem(legacyKey) || 'null'); } catch { /* ignore */ }
    const old = readLegacy(legacy);
    if (old) setLegacyPhotos(old.photos);
    if (isSaved(stored)) {
      setProfile({ ...emptyProfile(), ...stored.profile }); setLog(stored.log); setQuestion(stored.question || ''); setSaved(stored.savedAt); setMode('mine');
      const before = buildPlan(stored.profile, parseDay(stored.savedAt.slice(0, 10)) ?? now);
      const after = buildPlan(stored.profile, now);
      const gap = now - (parseDay(stored.savedAt.slice(0, 10)) ?? now);
      const moved = before?.phase && after?.phase && before.phase.id !== after.phase.id ? ` Your plant has moved from ${before.phase.short.toLowerCase()} to ${after.phase.short.toLowerCase()} since then.` : '';
      setWelcome(gap > 0 ? `Welcome back. Your last visit was ${gap} day${gap === 1 ? '' : 's'} ago.${moved}` : 'Welcome back. Your plan is saved on this device.');
      trackEvent('grow_week_return', { days_since: gap > 13 ? '14+' : gap > 6 ? '7-13' : gap > 0 ? '1-6' : '0' });
    } else if (old && old.log.length) {
      setLog(old.log); setMode('mine');
      setWelcome(`We brought over ${old.log.length} note${old.log.length === 1 ? '' : 's'} from Home Grow Fieldnotes. Add your sprout date to place ${old.log.length === 1 ? 'it' : 'them'} on your calendar.`);
    }
  }, []);

  const active = mode === 'example';
  const p = active ? exampleProfile : profile;
  const entries = active ? exampleLog : log;
  const day = active ? exampleToday : today;
  const plan = useMemo(() => buildPlan(p, day), [p, day]);
  const phase = plan?.phase ?? null;
  const prompt = plan ? buildPrompt(p, plan, entries, active ? exampleQuestion : question) : '';

  useEffect(() => {
    if (mode === 'mine' && plan && !planned.current) { planned.current = true; trackEvent('grow_week_plan', { plant_type: p.type, phase: plan.phase?.id ?? 'after', estimated_start: plan.startEstimated }); }
  }, [mode, plan, p.type]);

  useEffect(() => {
    if (!saved || mode !== 'mine') return;
    const data: Saved = { v: 1, profile, log, question, savedAt: new Date().toISOString() };
    try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch { setStatus('This browser could not save. Download the calendar so you keep your plan.'); }
  }, [profile, log, question, saved, mode]);

  function edit(patch: Partial<Profile>) {
    if (!started.current) { started.current = true; trackEvent('grow_week_start', { from: mode }); }
    if (mode === 'example') { setMode('mine'); setProfile({ ...emptyProfile(), ...patch }); return; }
    setProfile(prev => ({ ...prev, ...patch })); setStatus('');
  }
  function startMine() {
    setMode('mine'); setStatus('');
    if (!started.current) { started.current = true; trackEvent('grow_week_start', { from: 'button' }); }
    requestAnimationFrame(() => document.getElementById('gw-type-photo')?.focus());
  }
  function showExample() { setMode('example'); trackEvent('grow_week_view_example', {}); resultRef.current?.scrollIntoView({ block: 'start' }); }
  function save() {
    const at = new Date().toISOString();
    try { localStorage.setItem(storageKey, JSON.stringify({ v: 1, profile, log, question, savedAt: at } satisfies Saved)); setSaved(at); setStatus('Saved on this device. Nothing was uploaded. Changes now save automatically.'); trackEvent('grow_week_save', {}); }
    catch { setStatus('This browser could not save. Download the calendar so you keep your plan.'); }
  }
  function clearAll() {
    if (!window.confirm('Remove your plan, readings and notes from this device?')) return;
    try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    setSaved(null); setProfile(emptyProfile()); setLog([]); setQuestion(''); setWelcome(''); setStatus('Your plan was removed from this device.'); planned.current = false;
  }
  function removeLegacy() {
    try { localStorage.removeItem(legacyKey); setLegacyPhotos([]); setStatus('Your old Fieldnotes photos were removed from this device.'); } catch { setStatus('This browser could not remove the old photos.'); }
  }
  function addReading() {
    if (!entry.date) { setEntryError('Add the date of this reading.'); return; }
    if (!validReading(entry)) { setEntryError('Add at least one reading or a note. Temperature is in °F, humidity 0 to 100, pH 3 to 10.'); return; }
    setLog(prev => [...prev.filter(e => !(e.date === entry.date && !e.imported)), entry].sort((a, b) => a.date.localeCompare(b.date)).slice(-60));
    setEntry(blankEntry(isoOf(today))); setEntryError(''); setStatus(saved ? 'Reading added.' : 'Reading added. Save your plan to keep it on this device.');
    trackEvent('grow_week_log', { phase: phase?.id ?? 'none', has_temp: entry.tempF !== '', has_rh: entry.rh !== '', has_ph: entry.ph !== '', has_note: entry.note.trim() !== '' });
  }
  async function copyPrompt() {
    try { await navigator.clipboard.writeText(prompt); setStatus('Copied. Paste it into the AI assistant you already use, then check the answer against the list below.'); }
    catch { setShowPrompt(true); requestAnimationFrame(() => { const el = promptRef.current; if (el) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s?.removeAllRanges(); s?.addRange(r); } }); setStatus('Your browser blocked copying. The text is selected below: copy it from there.'); }
    trackEvent('grow_week_copy_prompt', { mode, phase: phase?.id ?? 'none', has_question: (active ? exampleQuestion : question).trim() !== '', readings: entries.length });
  }
  function downloadCalendar() {
    if (!plan) return;
    const blob = new Blob([buildCalendar(p, plan)], { type: 'text/calendar;charset=utf-8' });
    download(blob, 'grow-week.ics'); setStatus('Calendar file downloaded. Open it to add weekly reminders. Each one links back here.'); trackEvent('grow_week_calendar', { mode, plant_type: p.type });
  }
  async function downloadCard() {
    if (!plan) return;
    try { const blob = await drawPlanCard(p, plan, active); download(blob, 'grow-week-plan.png'); setStatus('Plan image saved. It shows dates and stages only, never your notes.'); trackEvent('grow_week_card', { mode }); }
    catch { setStatus('The image could not be created in this browser. The calendar file still works.'); }
  }
  async function share() {
    const url = `${toolUrl}?utm_source=reader_share&utm_medium=referral&utm_campaign=grow_week`;
    try {
      if (navigator.share) await navigator.share({ title: 'Grow Week', text: 'A free week-by-week calendar for a home cannabis grow.', url });
      else { await navigator.clipboard.writeText(url); setStatus('Link copied. It opens a blank calendar: your plan and notes stay here.'); }
      trackEvent('grow_week_share', {});
    } catch { setStatus('Copy this link to share a blank calendar: ' + url); }
  }

  const latest = entries[entries.length - 1];
  const latestDay = latest ? parseDay(latest.date) : null;
  const latestPhase = plan && latestDay !== null ? phases[plan.segments.find(s => latestDay - plan.start >= s.start && latestDay - plan.start < s.end)?.phase ?? 'seedling'] : null;
  const flags = latest && latestDay !== null && plan && latestDay >= plan.start ? readingFlags(latest, latestPhase, p.medium) : [];
  const staleDays = latestDay !== null ? day - latestDay : 0;
  const needsDate = mode === 'mine' && !plan;

  return (
    <main className="gw">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={toolUrl} />
        <meta property="og:title" content="Grow Week: what does your cannabis plant need this week?" />
        <meta property="og:description" content="Enter your sprout and flip dates. Get your week, stage ranges, calendar reminders and an AI check-in. Free, no account." />
        <meta property="og:image" content="https://www.mastergrowbot.com/downloads/home-grow-cover.webp" />
        <meta property="og:url" content={toolUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MasterGrowbot AI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Grow Week: a cannabis grow calendar, week by week" />
        <meta name="twitter:description" content="Your week, stage ranges, reminders and an AI check-in. Free, no account." />
        <meta name="twitter:image" content="https://www.mastergrowbot.com/downloads/home-grow-cover.webp" />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Grow Week', url: toolUrl, applicationCategory: 'LifestyleApplication', operatingSystem: 'Any', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@type': 'Organization', name: 'MasterGrowbot AI', url: 'https://www.mastergrowbot.com' } })}</script>
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) })}</script>
      </Helmet>

      <header className="gw-mast"><div className="gw-wrap">
        <a href="/" className="gw-brand">MasterGrowbot <b>AI</b></a>
        <a href={links.news} className="gw-pub">Cannabis AI <i>News &amp; Tools</i></a>
      </div></header>

      <section className="gw-hero"><div className="gw-wrap">
        <p className="gw-eyebrow">Free tool · Grow Week</p>
        <h1>Cannabis grow calendar: <em>know what this week needs.</em></h1>
        <p className="gw-lede">Enter the day your seedling sprouted. Grow Week tells you what week you’re in, what’s normal right now, what deserves a closer look, and when to start checking for harvest. It runs in your browser. No account.</p>
        <div className="gw-hero-actions">
          <a href="#plan" className="gw-btn" onClick={startMine}>Plan my grow <ArrowRight size={17} aria-hidden="true" /></a>
          <a href="#result" className="gw-link" onClick={showExample}>See a worked example</a>
        </div>
      </div></section>

      <div className="gw-wrap gw-grid" id="plan">
        <section className="gw-setup" aria-labelledby="setup-title">
          <h2 id="setup-title" className="gw-h2">Your plant</h2>
          {welcome && <p className="gw-welcome" role="status">{welcome}</p>}
          <fieldset className="gw-field">
            <legend>What kind of seed?</legend>
            <div className="gw-seg">
              {(['photo', 'auto'] as const).map(t => (
                <label key={t}><input id={'gw-type-' + t} type="radio" name="gw-type" checked={p.type === t} onChange={() => edit({ type: t })} /><span>{t === 'photo' ? 'Photoperiod' : 'Autoflower'}</span></label>
              ))}
            </div>
            <p className="gw-help">Not sure? If the pack or listing says “auto”, choose autoflower. Otherwise it is almost always photoperiod.</p>
          </fieldset>
          <label className="gw-field">Day it sprouted
            <input type="date" value={p.sprout} max={isoOf(day + 30)} onChange={e => edit({ sprout: e.target.value })} />
          </label>
          {!p.sprout && <label className="gw-field gw-sub">Don’t know the date? About how many weeks ago?
            <input type="number" inputMode="decimal" min={0} max={40} step={0.5} placeholder="e.g. 6" value={p.weeksAgo} onChange={e => edit({ weeksAgo: e.target.value, weeksAgoOn: isoOf(today) })} />
          </label>}
          {p.type === 'photo' ? <>
            <label className="gw-field">Day you switched the light to 12/12 <small>(leave empty if you haven’t)</small>
              <input type="date" value={p.flip} onChange={e => edit({ flip: e.target.value })} />
            </label>
            {!p.flip && <label className="gw-field gw-sub">Planned flip: week
              <select value={p.flipWeek} onChange={e => edit({ flipWeek: Number(e.target.value) })}>{range(4, 12).map(w => <option key={w} value={w}>{w} from sprout</option>)}</select>
            </label>}
            <label className="gw-field">Breeder’s flowering time
              <select value={p.flowerWeeks} onChange={e => edit({ flowerWeeks: Number(e.target.value) })}>{range(7, 14).map(w => <option key={w} value={w}>{w} weeks{w === 9 ? ' (typical, use if unknown)' : ''}</option>)}</select>
            </label>
          </> : (
            <label className="gw-field">Breeder’s seed-to-harvest time
              <select value={p.autoWeeks} onChange={e => edit({ autoWeeks: Number(e.target.value) })}>{range(9, 16).map(w => <option key={w} value={w}>{w} weeks{w === 11 ? ' (typical, use if unknown)' : ''}</option>)}</select>
            </label>
          )}
          <details className="gw-more" open={Boolean(p.space || p.light || p.medium !== 'unknown') || undefined}>
            <summary>Add your setup <small>for a sharper AI check-in</small></summary>
            <label className="gw-field">Grow space<input type="text" maxLength={60} placeholder="e.g. 2×2 ft tent" value={p.space} onChange={e => edit({ space: e.target.value })} /></label>
            <label className="gw-field">Light<input type="text" maxLength={60} placeholder="e.g. 100W LED" value={p.light} onChange={e => edit({ light: e.target.value })} /></label>
            <label className="gw-field">Growing medium
              <select value={p.medium} onChange={e => edit({ medium: e.target.value as Medium })}>
                <option value="unknown">Not sure</option><option value="soil">Soil</option><option value="coco">Coco</option><option value="hydro">Hydro</option>
              </select>
            </label>
          </details>
          {mode === 'mine' && <div className="gw-save">
            <button type="button" className="gw-btn gw-btn-quiet" onClick={save} disabled={!plan && log.length === 0}>{saved ? <><Check size={16} aria-hidden="true" /> Saved on this device</> : 'Save on this device'}</button>
            {(saved || log.length > 0) && <button type="button" className="gw-text-btn" onClick={clearAll}><Trash2 size={15} aria-hidden="true" /> Clear</button>}
          </div>}
          {legacyPhotos.length > 0 && <div className="gw-legacy">
            <p>Your earlier Home Grow Fieldnotes photos are still stored in this browser.</p>
            <div>{legacyPhotos.map((src, i) => <img key={i} src={src} width={72} height={72} alt={`Your Fieldnotes photo, visit ${i + 1}`} />)}</div>
            <button type="button" className="gw-text-btn" onClick={removeLegacy}>Remove old photos</button>
          </div>}
        </section>

        <section className="gw-result" id="result" ref={resultRef} aria-labelledby="result-title" aria-live="polite">
          {active && <p className="gw-tag gw-tag-example"><b>Fictional example.</b> The dates, readings and notes are invented to show how Grow Week works. <button type="button" className="gw-text-btn" onClick={startMine}>Start my plan</button></p>}
          {needsDate ? (
            <div className="gw-empty">
              <h2 id="result-title" className="gw-h2">Add a sprout date to see your week.</h2>
              <p>An approximate number of weeks works too. Everything else has a sensible default you can change later.</p>
              {log.length > 0 && <ReadingTable entries={log} />}
            </div>
          ) : plan && <>
            <div className="gw-now">
              <p className="gw-kicker">{prettyWeekday(day)} · Day {Math.max(plan.day, 0)}{plan.startEstimated && <span className="gw-est"> · estimated start</span>}</p>
              <h2 id="result-title" className="gw-now-title">{plan.beforeStart ? 'Not sprouted yet' : phase ? <>Week {plan.week}<span>{phase.label}</span></> : 'Past the cure window'}</h2>
              {phase && plan.flowerWeek && ['stretch', 'bulk', 'ripen'].includes(phase.id) && <p className="gw-fw">Flower week {plan.flowerWeek}{p.type === 'photo' ? ` of about ${plan.flowerTotal}` : ''}{p.type === 'auto' ? ' (estimated for autoflowers)' : ''}</p>}
              {plan.warnings.map(w => <p key={w} className="gw-warn">{w}</p>)}
            </div>

            <Timeline plan={plan} />

            {phase && <div className="gw-week">
              <h3>This week</h3>
              <ol className="gw-focus">{phase.focus.map(f => <li key={f}>{f}</li>)}</ol>
              <div className="gw-two">
                <div><h4>Normal right now</h4><ul>{phase.normal.map(n => <li key={n}>{n}</li>)}</ul></div>
                <div><h4>Worth a closer look</h4><ul>{phase.check.map(n => <li key={n}>{n}</li>)}</ul></div>
              </div>
              <p className="gw-avoid"><b>Avoid:</b> {phase.avoid}</p>
              {phase.id === 'ripen' && <p className="gw-offer">A phone macro lens makes trichomes much easier to read. <a href="/grow-tech/apexel-macro-lens-kit?utm_source=grow_week&utm_medium=website&utm_campaign=grow_week&utm_content=ripen">See the GrowTech lens kit</a></p>}
            </div>}

            {phase && <div className="gw-ranges">
              <h3>General ranges for {phase.short.toLowerCase()} <span className="gw-tag">Rules of thumb, not your measurements</span></h3>
              <dl>
                <div><dt>Temperature</dt><dd>{phase.tempF[0]} to {phase.tempF[1]}°F <small>{fToC(phase.tempF[0])} to {fToC(phase.tempF[1])}°C</small></dd></div>
                <div><dt>Humidity</dt><dd>{phase.rh[0]} to {phase.rh[1]}%</dd></div>
                {phase.vpd && <div><dt>Leaf VPD</dt><dd>{phase.vpd[0]} to {phase.vpd[1]} kPa <small><a href="/vpd-calculator">Check yours</a></small></dd></div>}
                <div><dt>Light</dt><dd>{phase.light}<small>{phase.ppfd}</small></dd></div>
                {phPlan[p.medium] && <div><dt>Water pH ({p.medium})</dt><dd>{phPlan[p.medium]![0]} to {phPlan[p.medium]![1]}</dd></div>}
              </dl>
            </div>}

            <div className="gw-log">
              <h3>Your readings <span className="gw-tag gw-tag-yours">Your measurements</span></h3>
              {latest && flags.length > 0 && <ul className="gw-flags">{flags.map(f => <li key={f.field} data-state={f.state}><b>{f.field} {f.value}</b> {f.state === 'ok' ? 'is inside' : f.state === 'high' ? 'is above' : 'is below'} the general {f.range} range for {latestPhase?.short.toLowerCase()} ({prettyDate(latestDay ?? day)}).</li>)}</ul>}
              {!active && staleDays > 6 && <p className="gw-muted">Your last reading is {staleDays} days old. Add today’s to compare it with this week’s ranges.</p>}
              {entries.length > 0 ? <ReadingTable entries={entries} /> : <p className="gw-muted">No readings yet. One temperature and humidity reading a week is enough to see a trend.</p>}
              {!active && <form className="gw-add" onSubmit={e => { e.preventDefault(); addReading(); }}>
                <label>Date<input type="date" value={entry.date} onChange={e => setEntry({ ...entry, date: e.target.value })} /></label>
                <label>Temp °F<input type="number" inputMode="decimal" step="any" value={entry.tempF} onChange={e => setEntry({ ...entry, tempF: e.target.value })} /></label>
                <label>RH %<input type="number" inputMode="decimal" step="any" value={entry.rh} onChange={e => setEntry({ ...entry, rh: e.target.value })} /></label>
                <label>pH<input type="number" inputMode="decimal" step="0.1" value={entry.ph} onChange={e => setEntry({ ...entry, ph: e.target.value })} /></label>
                <label className="gw-add-note">Note <small>(stays on this device)</small><input type="text" maxLength={280} placeholder="What did you notice?" value={entry.note} onChange={e => setEntry({ ...entry, note: e.target.value })} /></label>
                <button type="submit" className="gw-btn gw-btn-quiet"><Plus size={16} aria-hidden="true" /> Add reading</button>
                {entryError && <p className="gw-error" role="alert">{entryError}</p>}
              </form>}
            </div>

            <div className="gw-ai">
              <h3>AI check-in for this week</h3>
              <p>A blank AI chat doesn’t know your plant’s age, stage, setup or last readings, so it guesses. This check-in hands it all of that, plus the general ranges, and asks for an answer you can test.</p>
              <label className="gw-field">What’s on your mind? <small>(optional)</small>
                <textarea rows={2} maxLength={400} value={active ? exampleQuestion : question} readOnly={active} placeholder={phase?.question} onChange={e => setQuestion(e.target.value)} />
              </label>
              <div className="gw-actions">
                <button type="button" className="gw-btn" onClick={copyPrompt}><ClipboardCopy size={16} aria-hidden="true" /> Copy the check-in</button>
                <button type="button" className="gw-text-btn" aria-expanded={showPrompt} onClick={() => setShowPrompt(v => !v)}>{showPrompt ? 'Hide' : 'Read'} the full text</button>
              </div>
              {showPrompt && <pre ref={promptRef} className="gw-prompt" tabIndex={0}>{prompt}</pre>}
              <div className="gw-checklist">
                <h4>Before you act on the answer, check that</h4>
                <ul>
                  {phase && <li>{phase.aiCheck}</li>}
                  <li>Its numbers roughly match the ranges above. If they don’t, ask it why.</li>
                  <li>It suggests one change, not five, and says what you should see if it works.</li>
                  <li>It separates what your readings show from general advice.</li>
                </ul>
              </div>
            </div>

            <div className="gw-take">
              <h3>Take it with you</h3>
              <div className="gw-take-grid">
                <button type="button" onClick={downloadCalendar}><CalendarPlus size={20} aria-hidden="true" /><b>Weekly reminders</b><span>A calendar file with this week’s focus every week, plus trichome and harvest dates.</span></button>
                <button type="button" onClick={downloadCard}><ImageIcon size={20} aria-hidden="true" /><b>Plan as an image</b><span>Your stages and key dates. Never your notes.</span></button>
                <button type="button" onClick={share}><Link2 size={20} aria-hidden="true" /><b>Share Grow Week</b><span>Sends a blank calendar. Your plan stays here.</span></button>
              </div>
            </div>
          </>}
          <p className="gw-status" role="status">{status}</p>
        </section>
      </div>

      <section className="gw-news" id="weekly" aria-labelledby="weekly-title"><div className="gw-wrap gw-news-grid">
        <div>
          <p className="gw-eyebrow">Cannabis AI News &amp; Tools</p>
          <h2 id="weekly-title" className="gw-h2">Your plant has a calendar now. The email covers what’s changing around it.</h2>
          <p>Once a week, from the team behind MasterGrowbot AI:</p>
          <ul className="gw-promise">
            <li><b>One reported story</b> where cannabis and technology meet, with a point of view and dated sources.</li>
            <li><b>The AI news worth your time</b>, and what it means for a grow room or a cannabis business.</li>
            <li><b>AI Advantage:</b> one thing to try this week, the result to expect, and how to check it.</li>
          </ul>
          <p className="gw-muted">We don’t invent tests, quotes or reader stories. Five minutes to read.</p>
        </div>
        <div className="gw-news-form">
          {requested && <p className="gw-muted">You asked for the weekly email on {prettyDate(parseDay(requested) ?? today, true)}. Didn’t confirm? Ask for a new link below.</p>}
          <NewsletterSignup placement="newsletter_grow_week" campaign="grow_week" button="Send me the weekly email" />
          <p className="gw-muted gw-business">Run a grow, a store or a lab? <a href={links.workbench}>The Cannabis AI Workbench</a> reviews sensor logs, stock shortfalls and procedure changes.</p>
        </div>
      </div></section>

      <section className="gw-wrap gw-honest" aria-labelledby="honest-title">
        <h2 id="honest-title" className="gw-h2">What Grow Week knows, and what it doesn’t</h2>
        <div className="gw-honest-grid">
          <div><h3>Estimates</h3><p>Weeks, flower weeks and harvest dates come from the dates and breeder times you enter. Genetics, light and stress move them.</p></div>
          <div><h3>General ranges</h3><p>Temperature, humidity and VPD bands are common rules of thumb for each stage, the same ones our <a href="/vpd-calculator">VPD calculator</a> uses. They are not measurements of your room.</p></div>
          <div><h3>Your measurements</h3><p>Only what you log. Grow Week compares them with the ranges and never fills in a missing number.</p></div>
          <div><h3>Private by default</h3><p>Your notes and readings stay in this browser. Nothing you type is uploaded or added to analytics. You decide what to paste into an AI chat.</p></div>
        </div>
        <h2 className="gw-h2 gw-faq-title">Questions</h2>
        {faqs.map(f => <details key={f.q} className="gw-faq"><summary>{f.q}</summary><p>{f.a}</p></details>)}
      </section>

      <section className="gw-app"><div className="gw-wrap">
        <h2 className="gw-h2">When a leaf worries you, get a second look.</h2>
        <p>MasterGrowbot AI reads a photo of your plant and tells you what to check next. Free download with a 3-day trial on iPhone and Android.</p>
        <div className="gw-actions">
          <a className="gw-btn" href={appStoreUrl('cannabis-grow-calendar')} data-cta-location="grow-week:ios">Download on the App Store</a>
          <a className="gw-btn gw-btn-quiet" href={playStoreUrl('cannabis-grow-calendar')} data-cta-location="grow-week:android">Get it on Google Play</a>
        </div>
      </div></section>

      <footer className="gw-foot"><div className="gw-wrap">
        <a href="/">MasterGrowbot AI home</a><a href="/grow-guides">Grow guides</a><a href="/vpd-calculator">VPD calculator</a><a href={links.news}>Cannabis AI News &amp; Tools</a><a href="/privacy-policy">Privacy</a>
      </div></footer>
    </main>
  );
}

function Timeline({ plan }: { plan: Plan }) {
  const total = plan.segments[plan.segments.length - 1].end;
  const pos = Math.min(100, Math.max(0, (plan.day / total) * 100));
  const keyDates = [
    { label: 'Sprouted', day: plan.start, est: plan.startEstimated },
    ...(plan.flipDay !== null ? [{ label: plan.flipPlanned ? 'Planned flip' : 'Flipped to 12/12', day: plan.start + plan.flipDay, est: plan.flipPlanned }] : []),
    { label: 'Start trichome checks', day: plan.trichomeStart, est: true },
    { label: 'Harvest window', day: plan.windowStart, end: plan.windowEnd, est: true },
  ];
  return (
    <div className="gw-timeline">
      <div className="gw-bar" role="img" aria-label={`Grow timeline. Today is day ${Math.max(plan.day, 0)}${plan.phase ? ', in ' + plan.phase.label : ''}.`}>
        {plan.segments.map(s => <span key={s.phase} style={{ flexGrow: s.end - s.start, background: phases[s.phase].color }} data-current={plan.current?.phase === s.phase || undefined}><i>{phases[s.phase].short}</i></span>)}
        {!plan.beforeStart && plan.day < total && <b className="gw-today" style={{ left: pos + '%' }}><em>Today</em></b>}
      </div>
      <ul className="gw-dates">{keyDates.map(k => <li key={k.label}><span>{k.label}</span><b>{prettyDate(k.day)}{'end' in k && k.end ? ' to ' + prettyDate(k.end) : ''}</b>{k.est && <small>estimate</small>}</li>)}</ul>
    </div>
  );
}

function ReadingTable({ entries }: { entries: LogEntry[] }) {
  return (
    <div className="gw-table" tabIndex={0} role="region" aria-label="Your readings">
      <table><thead><tr><th>Date</th><th>°F</th><th>RH</th><th>pH</th><th>Note</th></tr></thead>
        <tbody>{[...entries].reverse().slice(0, 8).map((e, i) => <tr key={e.date + i}><td>{e.date ? prettyDate(parseDay(e.date) ?? 0) : 'Undated'}</td><td>{e.tempF || '·'}</td><td>{e.rh ? e.rh + '%' : '·'}</td><td>{e.ph || '·'}</td><td>{e.note || '·'}{e.imported && <small> from Fieldnotes</small>}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

function range(a: number, b: number) { return Array.from({ length: b - a + 1 }, (_, i) => a + i); }
function isoOf(day: number) { return new Date(day * 86400000).toISOString().slice(0, 10); }
function prettyWeekday(day: number) { return new Date(day * 86400000).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', month: 'short', day: 'numeric' }); }
function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000);
}
