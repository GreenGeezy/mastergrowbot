// Grow Week: a deterministic week-by-week plan for one home cannabis plant.
// Everything here runs in the reader's browser. No notes, readings or dates are sent anywhere.

export type PlantType = 'photo' | 'auto';
export type Medium = 'soil' | 'coco' | 'hydro' | 'unknown';
export type PhaseId = 'seedling' | 'veg' | 'stretch' | 'bulk' | 'ripen' | 'dry' | 'cure';

export type Profile = {
  type: PlantType;
  sprout: string;        // YYYY-MM-DD, the day the seedling broke the soil
  weeksAgo: string;      // fallback when the sprout date is unknown
  weeksAgoOn?: string;   // the day that estimate was entered, so the plant keeps aging between visits
  flip: string;          // photoperiod only: date the light went to 12/12
  flipWeek: number;      // photoperiod only: planned flip week when not flipped yet
  flowerWeeks: number;   // photoperiod: breeder flowering time
  autoWeeks: number;     // autoflower: breeder seed-to-harvest time
  space: string;
  light: string;
  medium: Medium;
};

export type LogEntry = { date: string; tempF: string; rh: string; ph: string; note: string; imported?: boolean };

export type Saved = { v: 1; profile: Profile; log: LogEntry[]; question: string; savedAt: string; requestedAt?: string };

export const storageKey = 'mgb.grow-week.v1';
export const legacyKey = 'mgb.home-grow-fieldnotes.v1';
export const toolPath = '/cannabis-grow-calendar';
export const toolUrl = 'https://www.mastergrowbot.com' + toolPath;

export const emptyProfile = (): Profile => ({
  type: 'photo', sprout: '', weeksAgo: '', flip: '', flipWeek: 7, flowerWeeks: 9, autoWeeks: 11, space: '', light: '', medium: 'unknown',
});

type Range = [number, number];
export type Phase = {
  id: PhaseId; label: string; short: string; color: string;
  tempF: Range; rh: Range; vpd: Range | null; light: string; ppfd: string;
  focus: string[]; normal: string[]; check: string[]; avoid: string;
  question: string; aiCheck: string;
};

// Climate bands match the site's VPD calculator stage targets. They are general ranges, not measurements.
export const phases: Record<PhaseId, Phase> = {
  seedling: {
    id: 'seedling', label: 'Seedling', short: 'Seedling', color: '#b7cf8e',
    tempF: [72, 79], rh: [65, 75], vpd: [0.4, 0.8], light: '18 hours on, 6 off', ppfd: '200 to 400 PPFD',
    focus: ['Water small amounts close to the stem. Let the top of the medium dry slightly between waterings.', 'Run the light at its seedling setting or dimmed. Follow the maker’s hanging height.', 'Keep conditions steady. Seedlings handle a stable room better than a perfect one.'],
    normal: ['Slow growth above the soil while roots establish.', 'The two round seed leaves yellowing and dropping once true leaves are growing.'],
    check: ['A long, thin, leaning stem usually means the light is too weak or too far.', 'A pinched, dark stem at the soil line can be damping off. Act fast.', 'Drooping with wet soil points to overwatering, not thirst.'],
    avoid: 'Skip strong nutrients if you planted in a pre-fertilized soil.',
    question: 'Is my seedling on track for its age, and is my watering about right?',
    aiCheck: 'It asks how often and how much you water before suggesting nutrients.',
  },
  veg: {
    id: 'veg', label: 'Vegetative growth', short: 'Veg', color: '#6fa86a',
    tempF: [72, 82], rh: [55, 70], vpd: [0.8, 1.2], light: '18 hours on, 6 off', ppfd: '400 to 600 PPFD',
    focus: ['Train now if you plan to. Topping and low-stress training work best in this window.', 'Find a watering rhythm by lifting the pot. Water when it feels clearly light.', 'Look under a few leaves once a week for pests.'],
    normal: ['A new node every few days and fast new growth.', 'New growth a shade lighter green than older leaves.'],
    check: ['Dark, clawed leaves that point down can mean too much nitrogen.', 'Lower leaves yellowing in veg can mean the plant needs feeding or the roots stay too wet.', 'Specks, webbing or tiny flies around the medium.'],
    avoid: 'Change one thing at a time so you can tell what worked.',
    question: 'Is my plant ready to train or transplant, and what should I watch this week?',
    aiCheck: 'It recommends one change at a time and tells you what you should see if it works.',
  },
  stretch: {
    id: 'stretch', label: 'Early flower: the stretch', short: 'Stretch', color: '#3f8f86',
    tempF: [72, 80], rh: [50, 60], vpd: [1.0, 1.3], light: '12 on, 12 off for photoperiods. Autos stay on their veg schedule.', ppfd: '600 to 900 PPFD',
    focus: ['Plan for height. Many plants grow 50 to 100% taller in the first three weeks of flower.', 'Finish training and any leaf thinning early in this window.', 'Move to your nutrient line’s bloom feed gradually, as its chart directs.'],
    normal: ['Fast vertical growth.', 'White hairs (pistils) appearing where branches meet the stem.'],
    check: ['Tops getting close to the light: bleached or crispy upper leaves.', 'Light leaks during the dark period in a photoperiod tent.', 'Humidity creeping up as the canopy fills in.'],
    avoid: 'Avoid heavy training late in the stretch. The plant needs that energy for flowers.',
    question: 'How much headroom do I need, and what should I adjust now that the stretch has started?',
    aiCheck: 'It asks your current light distance and plant height before giving a number.',
  },
  bulk: {
    id: 'bulk', label: 'Mid flower: buds bulk up', short: 'Bulk', color: '#2f6f5a',
    tempF: [70, 80], rh: [45, 55], vpd: [1.2, 1.6], light: 'Same schedule as the stretch', ppfd: '600 to 900 PPFD',
    focus: ['Keep air moving through the canopy, not just over it.', 'Watch humidity right after lights-off. That is when it spikes.', 'Inspect the densest buds weekly for gray or brown spots.'],
    normal: ['Buds filling out and a much stronger smell.', 'A few lower leaves yellowing as the plant moves nutrients into flowers.'],
    check: ['Brown, mushy spots inside a bud can be bud rot. Remove it carefully.', 'White powdery spots on leaves can be powdery mildew.', 'Foxtailing or bleaching near the light suggests heat or light stress.'],
    avoid: 'Don’t chase every yellow leaf with more nutrients in mid flower.',
    question: 'Are my humidity and airflow safe for dense buds this week?',
    aiCheck: 'It asks about humidity at lights-off, not just your daytime reading.',
  },
  ripen: {
    id: 'ripen', label: 'Late flower: ripening', short: 'Ripen', color: '#c58b2c',
    tempF: [65, 78], rh: [40, 50], vpd: [1.2, 1.6], light: 'Same schedule as the stretch', ppfd: '600 to 900 PPFD',
    focus: ['Start trichome checks on the buds themselves, not the small sugar leaves.', 'Get your drying space ready: dark, gentle airflow, about 60°F and 60% RH.', 'Follow your nutrient line’s late-flower guidance.'],
    normal: ['Fan leaves yellowing and fading. This is expected late in flower.', 'Pistils darkening and curling in.'],
    check: ['Trichomes moving from clear to cloudy, with some amber.', 'Dense buds holding moisture: look inside the biggest colas.', 'Harvest dates are estimates. The plant decides, not the calendar.'],
    avoid: 'Don’t harvest on pistil color or the calendar alone.',
    question: 'How do I judge harvest timing from trichomes, and what should I prepare now?',
    aiCheck: 'It talks about trichomes, not only pistils, and admits a photo may not settle it.',
  },
  dry: {
    id: 'dry', label: 'Harvest and dry', short: 'Dry', color: '#8a6a45',
    tempF: [58, 65], rh: [55, 62], vpd: null, light: 'Darkness', ppfd: 'No light',
    focus: ['Hang branches in the dark with gentle air that doesn’t blow directly on them.', 'Aim for about 60°F and 60% RH. A slow dry keeps more aroma.', 'Small stems snapping instead of bending usually means it is ready to trim and jar.'],
    normal: ['Drying usually takes 7 to 14 days.', 'A strong grassy smell in the first days.'],
    check: ['Buds crisp on the outside within 3 days means the room is too dry or warm.', 'Any musty smell or fuzzy growth.'],
    avoid: 'Don’t speed it up with heat or a fan pointed at the buds.',
    question: 'Is my drying room right, and how do I know when to jar?',
    aiCheck: 'It asks your room temperature and humidity before giving a timeline.',
  },
  cure: {
    id: 'cure', label: 'Cure', short: 'Cure', color: '#6e5a48',
    tempF: [60, 70], rh: [58, 62], vpd: null, light: 'Darkness', ppfd: 'No light',
    focus: ['Fill jars about three quarters full.', 'Open jars daily for a few minutes in the first week, then less often.', 'A small hygrometer in the jar should settle near 58 to 62% RH.'],
    normal: ['Smell and smoothness keep improving for several weeks.'],
    check: ['Jar humidity above 65% means the buds need more drying time.', 'Any ammonia or musty smell.'],
    avoid: 'Don’t seal wet buds. Mold can start in a jar.',
    question: 'How should I cure, and how will I know it is ready?',
    aiCheck: 'It treats jar humidity as the main signal, not days on a calendar.',
  },
};

export const phPlan: Record<Medium, Range | null> = { soil: [6.0, 7.0], coco: [5.5, 6.5], hydro: [5.5, 6.5], unknown: null };

const DAY = 86400000;
export function parseDay(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const t = Date.parse(value + 'T00:00:00Z');
  return Number.isFinite(t) ? t / DAY : null;
}
export function dayString(day: number) { return new Date(day * DAY).toISOString().slice(0, 10); }
export function localToday(now = new Date()) {
  return parseDay(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`) as number;
}
export function prettyDate(day: number, withYear = false) {
  return new Date(day * DAY).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', ...(withYear ? { year: 'numeric' } : {}) });
}

export type Segment = { phase: PhaseId; start: number; end: number }; // plant days, end exclusive
export type Plan = {
  start: number; startEstimated: boolean; today: number; day: number; week: number;
  segments: Segment[]; current: Segment | null; phase: Phase | null;
  flipDay: number | null; flipPlanned: boolean; flowerStart: number; flowerWeek: number | null; flowerTotal: number;
  harvest: number; windowStart: number; windowEnd: number; trichomeStart: number;
  beforeStart: boolean; warnings: string[];
};

export function buildPlan(p: Profile, today: number): Plan | null {
  const warnings: string[] = [];
  let start = parseDay(p.sprout);
  let startEstimated = false;
  if (start === null) {
    const w = Number(p.weeksAgo);
    if (p.weeksAgo === '' || !Number.isFinite(w) || w < 0 || w > 40) return null;
    start = (parseDay(p.weeksAgoOn ?? '') ?? today) - Math.round(w * 7);
    startEstimated = true;
  }
  let flipDay: number | null = null; let flipPlanned = false;
  let flowerStart: number; let harvest: number; let flowerTotal: number;
  const segments: Segment[] = [{ phase: 'seedling', start: 0, end: 14 }];
  if (p.type === 'photo') {
    const flip = parseDay(p.flip);
    if (flip !== null) {
      flipDay = flip - start;
      if (flipDay < 14) { warnings.push('Your flip date is less than two weeks after sprouting. Check both dates.'); flipDay = Math.max(flipDay, 14); }
    } else { flipDay = (clamp(p.flipWeek, 3, 16) - 1) * 7; flipPlanned = true; }
    flowerTotal = clamp(p.flowerWeeks, 7, 14);
    flowerStart = flipDay; harvest = flipDay + flowerTotal * 7;
    if (flipDay > 14) segments.push({ phase: 'veg', start: 14, end: flipDay });
  } else {
    const total = clamp(p.autoWeeks, 9, 16);
    flowerStart = 28; harvest = total * 7; flowerTotal = total - 4;
    segments.push({ phase: 'veg', start: 14, end: 28 });
  }
  const s = flowerStart;
  segments.push({ phase: 'stretch', start: s, end: s + 21 });
  const ripenStart = Math.max(s + 21, harvest - 21);
  if (ripenStart > s + 21) segments.push({ phase: 'bulk', start: s + 21, end: ripenStart });
  const windowEnd = harvest + 7;
  segments.push({ phase: 'ripen', start: ripenStart, end: windowEnd });
  segments.push({ phase: 'dry', start: windowEnd, end: windowEnd + 14 });
  segments.push({ phase: 'cure', start: windowEnd + 14, end: windowEnd + 42 });

  const day = today - start;
  const current = segments.find(g => day >= g.start && day < g.end) ?? null;
  if (day > 400) warnings.push('That sprout date is more than a year ago. Check the year.');
  return {
    start, startEstimated, today, day, week: Math.floor(day / 7) + 1, segments, current,
    phase: current ? phases[current.phase] : null, flipDay, flipPlanned, flowerStart,
    flowerWeek: day >= flowerStart ? Math.floor((day - flowerStart) / 7) + 1 : null, flowerTotal,
    harvest: start + harvest, windowStart: start + harvest - 7, windowEnd: start + windowEnd, trichomeStart: start + ripenStart,
    beforeStart: day < 0, warnings,
  };
}
function clamp(n: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, Math.round(Number(n) || lo))); }

export function stageLine(plan: Plan, type: PlantType) {
  if (plan.beforeStart) return `Starts ${prettyDate(plan.start)}`;
  if (!plan.phase) return 'Past the cure window';
  const fw = plan.flowerWeek && ['stretch', 'bulk', 'ripen'].includes(plan.phase.id)
    ? ` · flower week ${plan.flowerWeek}${type === 'photo' ? ` of about ${plan.flowerTotal}` : ''}` : '';
  return `Week ${plan.week} · ${plan.phase.label}${fw}`;
}

export type Flag = { field: string; value: string; range: string; state: 'low' | 'high' | 'ok' };
export function readingFlags(entry: LogEntry, phase: Phase | null, medium: Medium): Flag[] {
  const flags: Flag[] = [];
  if (!phase) return flags;
  const cmp = (field: string, raw: string, range: Range, unit: string, digits = 0) => {
    if (raw.trim() === '') return;
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    flags.push({ field, value: raw + unit, range: `${range[0].toFixed(digits)} to ${range[1].toFixed(digits)}${unit}`, state: n < range[0] ? 'low' : n > range[1] ? 'high' : 'ok' });
  };
  cmp('Temperature', entry.tempF, phase.tempF, '°F');
  cmp('Humidity', entry.rh, phase.rh, '%');
  const ph = phPlan[medium];
  if (ph) cmp('pH', entry.ph, ph, '', 1);
  return flags;
}
export function validReading(e: LogEntry) {
  const t = e.tempF === '' || (Number(e.tempF) >= 30 && Number(e.tempF) <= 120);
  const r = e.rh === '' || (Number(e.rh) >= 0 && Number(e.rh) <= 100);
  const ph = e.ph === '' || (Number(e.ph) >= 3 && Number(e.ph) <= 10);
  return t && r && ph && Boolean(e.tempF || e.rh || e.ph || e.note.trim());
}
export const fToC = (f: number) => Math.round((f - 32) * 5 / 9);

const typeLabel = (t: PlantType) => (t === 'photo' ? 'photoperiod plant' : 'autoflower');
export function buildPrompt(p: Profile, plan: Plan, log: LogEntry[], question: string) {
  const phase = plan.phase;
  const setup = [p.space.trim() && `Space: ${p.space.trim()}`, p.light.trim() && `Light: ${p.light.trim()}`, p.medium !== 'unknown' && `Medium: ${p.medium}`].filter(Boolean).join(' · ');
  const recent = log.slice(-4).map(e => '- ' + [e.date, e.tempF && `${e.tempF}°F`, e.rh && `${e.rh}% RH`, e.ph && `pH ${e.ph}`, e.note.trim() && `note: ${e.note.trim()}`].filter(Boolean).join(', '));
  const flip = p.type === 'photo' ? (plan.flipPlanned ? `Planned flip to 12/12: about ${prettyDate(plan.start + (plan.flipDay ?? 0), true)}.` : `Flipped to 12/12 on ${prettyDate(plan.start + (plan.flipDay ?? 0), true)}.`) : '';
  return [
    'I’m growing cannabis at home. Use my grow context below. If a missing detail would change your answer, ask me for it before recommending any change.',
    ['GROW CONTEXT',
      `- One ${typeLabel(p.type)}, sprouted ${plan.startEstimated ? 'about' : 'on'} ${prettyDate(plan.start, true)}. Today is day ${plan.day}.`,
      `- Stage: ${stageLine(plan, p.type)}. ${flip}`.trim(),
      setup ? `- ${setup}` : '- Setup details not provided.'].join('\n'),
    recent.length ? 'MY MEASUREMENTS AND NOTES (most recent last)\n' + recent.join('\n') : 'I have no recorded readings yet.',
    phase ? `GENERAL RANGES FOR THIS STAGE (rules of thumb, not my measurements): ${phase.tempF[0]} to ${phase.tempF[1]}°F, ${phase.rh[0]} to ${phase.rh[1]}% RH${phase.vpd ? `, leaf VPD ${phase.vpd[0]} to ${phase.vpd[1]} kPa` : ''}.` : '',
    'MY QUESTION\n' + (question.trim() || phase?.question || 'What should I focus on this week?'),
    'ANSWER FORMAT\n1. What my readings and notes support.\n2. What is normal for this stage that I should leave alone.\n3. The single most useful thing to check next, and how.\n4. Only if needed: one change, why, and what I should see in 3 to 5 days if it works.\nKeep it under 200 words. Label anything that is general advice rather than something my data shows.',
  ].filter(Boolean).join('\n\n');
}

function icsEscape(s: string) { return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
function fold(line: string) {
  const out: string[] = []; let rest = line;
  while (new TextEncoder().encode(rest).length > 73) {
    let cut = 73; while (new TextEncoder().encode(rest.slice(0, cut)).length > 73) cut--;
    out.push(rest.slice(0, cut)); rest = ' ' + rest.slice(cut);
  }
  out.push(rest); return out.join('\r\n');
}
const icsDate = (day: number) => dayString(day).replace(/-/g, '');
export function buildCalendar(p: Profile, plan: Plan, now = new Date()) {
  const link = `${toolUrl}?utm_source=calendar&utm_medium=ics&utm_campaign=grow_week`;
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const events: string[] = [];
  const add = (day: number, summary: string, desc: string, key: string) => {
    events.push(['BEGIN:VEVENT', `UID:${key}-${icsDate(day)}-${plan.start}@grow-week.mastergrowbot.com`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${icsDate(day)}`, `DTEND;VALUE=DATE:${icsDate(day + 1)}`,
      `SUMMARY:${icsEscape(summary)}`, `DESCRIPTION:${icsEscape(desc + '\n\nOpen Grow Week: ' + link)}`, 'TRANSP:TRANSPARENT', 'END:VEVENT'].map(fold).join('\r\n'));
  };
  const firstWeek = Math.max(0, Math.floor(Math.max(plan.day, 0) / 7));
  const lastDay = plan.windowEnd - plan.start;
  for (let w = firstWeek; w * 7 < lastDay && events.length < 26; w++) {
    const d = w * 7; const seg = plan.segments.find(g => d >= g.start && d < g.end); if (!seg) continue;
    const ph = phases[seg.phase];
    const fw = d >= plan.flowerStart ? `, flower week ${Math.floor((d - plan.flowerStart) / 7) + 1}` : '';
    add(plan.start + d, `Grow Week ${w + 1}: ${ph.short}${fw}`, `This week:\n- ${ph.focus.join('\n- ')}\n\nLog a temperature and humidity reading while you are there.`, 'week' + (w + 1));
  }
  if (p.type === 'photo' && plan.flipPlanned && plan.flipDay !== null && plan.start + plan.flipDay >= plan.today) add(plan.start + plan.flipDay, 'Planned flip to 12/12', 'Your plan assumes the light schedule changes to 12 hours on, 12 off today. If you flip on a different day, update the date in Grow Week.', 'flip');
  add(plan.trichomeStart, 'Start trichome checks', 'Check trichomes on the buds every few days from now. Harvest timing is an estimate until the trichomes say so.', 'trichomes');
  add(plan.windowStart, 'Estimated harvest window opens', 'Estimated from your dates and the breeder time you entered. Confirm with trichomes.', 'window');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MasterGrowbot//Grow Week//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Grow Week', ...events, 'END:VCALENDAR'].join('\r\n') + '\r\n';
}

export function isSaved(raw: unknown): raw is Saved {
  if (!raw || typeof raw !== 'object') return false;
  const s = raw as Saved; const pr = s.profile as Profile | undefined;
  return s.v === 1 && !!pr && (pr.type === 'photo' || pr.type === 'auto') && ['sprout', 'weeksAgo', 'flip', 'space', 'light'].every(k => typeof pr[k as keyof Profile] === 'string')
    && Array.isArray(s.log) && s.log.every(e => e && ['date', 'tempF', 'rh', 'ph', 'note'].every(k => typeof e[k as keyof LogEntry] === 'string'));
}

// Home Grow Fieldnotes (Nov 2026) stored two visits. Keep the readers' written notes when they arrive here.
export type LegacyJournal = { visits: { date: string; note: string; photo: string; humidity: string }[]; change: string };
export function readLegacy(raw: unknown): { log: LogEntry[]; photos: string[] } | null {
  if (!raw || typeof raw !== 'object' || !Array.isArray((raw as LegacyJournal).visits)) return null;
  const visits = (raw as LegacyJournal).visits.filter(v => v && typeof v.note === 'string');
  const log = visits.filter(v => v.note.trim() || v.humidity).map(v => ({ date: /^\d{4}-\d{2}-\d{2}$/.test(v.date) ? v.date : '', tempF: '', rh: String(v.humidity ?? ''), ph: '', note: v.note.trim().slice(0, 280), imported: true }));
  const photos = visits.map(v => v.photo).filter(ph => typeof ph === 'string' && ph.startsWith('data:image/jpeg;base64,'));
  return log.length || photos.length ? { log, photos } : null;
}

// A fictional grower, used to demonstrate the tool. Fixed dates keep server and browser output identical.
export const exampleToday = parseDay('2026-11-26') as number;
export const exampleProfile: Profile = {
  type: 'photo', sprout: '2026-10-04', weeksAgo: '', flip: '2026-11-08', flipWeek: 6, flowerWeeks: 9, autoWeeks: 11, space: '2×2 ft tent', light: '100W LED, dimmable', medium: 'soil',
};
export const exampleLog: LogEntry[] = [
  { date: '2026-11-12', tempF: '77', rh: '58', ph: '6.5', note: 'Flipped four days ago. Tallest top about 20 in. below the light.' },
  { date: '2026-11-19', tempF: '78', rh: '61', ph: '6.4', note: 'Lots of new height. Pistils showing.' },
  { date: '2026-11-26', tempF: '79', rh: '64', ph: '6.6', note: 'Tallest top now about 9 in. from the light. Two lower fan leaves yellowing.' },
];
export const exampleQuestion = 'Two lower leaves are turning yellow. Should I feed more, and do I need to raise the light?';
