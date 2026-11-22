import { phases, prettyDate } from './growWeekData';
import type { Plan, Profile } from './growWeekData';

// A shareable 1080×1350 image with stages and dates only. Notes and readings are never drawn.
export async function drawPlanCard(p: Profile, plan: Plan, example: boolean): Promise<Blob> {
  try { await Promise.all([document.fonts.load('500 64px Fraunces'), document.fonts.load('600 26px "IBM Plex Sans"'), document.fonts.load('500 22px "IBM Plex Mono"')]); } catch { /* fall back */ }
  const W = 1080, H = 1350, M = 80;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); if (!x) throw new Error('No canvas');
  const serif = 'Fraunces, Georgia, serif', sans = '"IBM Plex Sans", system-ui, sans-serif', mono = '"IBM Plex Mono", ui-monospace, monospace';
  x.fillStyle = '#f4efe1'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#16352a'; x.fillRect(0, 0, W, 14);
  x.fillStyle = '#4c6155'; x.font = `500 22px ${mono}`; x.fillText(example ? 'GROW WEEK · FICTIONAL EXAMPLE' : 'GROW WEEK · MY PLAN', M, 96);
  x.fillStyle = '#16352a'; x.font = `500 92px ${serif}`;
  const phase = plan.phase;
  x.fillText(plan.beforeStart ? 'Not sprouted yet' : `Week ${plan.week}`, M, 210);
  x.font = `400 44px ${serif}`; x.fillStyle = '#2f6f5a';
  x.fillText(phase ? phase.label : 'Past the cure window', M, 272);
  x.font = `500 26px ${sans}`; x.fillStyle = '#4c6155';
  const kind = p.type === 'photo' ? 'Photoperiod' : 'Autoflower';
  x.fillText(`${kind} · as of ${prettyDate(plan.today, true)}${plan.flowerWeek && phase && ['stretch', 'bulk', 'ripen'].includes(phase.id) ? ` · flower week ${plan.flowerWeek}` : ''}`, M, 322);

  const total = plan.segments[plan.segments.length - 1].end; const barY = 380, barH = 64, barW = W - 2 * M;
  let cx = M;
  for (const s of plan.segments) {
    const w = ((s.end - s.start) / total) * barW;
    x.fillStyle = phases[s.phase].color; x.fillRect(cx, barY, w, barH);
    if (w > 90) { x.fillStyle = s.phase === 'seedling' ? '#16352a' : '#fbf6e6'; x.font = `600 20px ${sans}`; x.fillText(phases[s.phase].short, cx + 12, barY + 40); }
    cx += w;
  }
  if (!plan.beforeStart && plan.day < total) {
    const tx = M + (plan.day / total) * barW;
    x.fillStyle = '#c58b2c'; x.fillRect(tx - 3, barY - 22, 6, barH + 44);
    x.font = `600 20px ${mono}`; x.fillText('TODAY', Math.min(tx - 30, W - M - 70), barY - 32);
  }

  const rows: [string, string][] = [
    [plan.startEstimated ? 'Sprouted (estimated)' : 'Sprouted', prettyDate(plan.start, true)],
    ...(plan.flipDay !== null ? [[plan.flipPlanned ? 'Planned flip to 12/12' : 'Flipped to 12/12', prettyDate(plan.start + plan.flipDay, true)] as [string, string]] : []),
    ['Start trichome checks', prettyDate(plan.trichomeStart, true)],
    ['Harvest window (estimate)', `${prettyDate(plan.windowStart)} to ${prettyDate(plan.windowEnd, true)}`],
  ];
  let y = 540;
  for (const [k, v] of rows) {
    x.strokeStyle = '#c9c6b4'; x.lineWidth = 2; x.beginPath(); x.moveTo(M, y + 22); x.lineTo(W - M, y + 22); x.stroke();
    x.fillStyle = '#4c6155'; x.font = `500 26px ${sans}`; x.fillText(k, M, y);
    x.fillStyle = '#16352a'; x.font = `600 28px ${sans}`; const tw = x.measureText(v).width; x.fillText(v, W - M - tw, y);
    y += 70;
  }
  if (phase) {
    y += 30; x.fillStyle = '#16352a'; x.font = `500 40px ${serif}`; x.fillText('This week', M, y); y += 20;
    x.font = `400 27px ${sans}`;
    for (const f of phase.focus) { y = wrap(x, '• ' + f, M, y + 46, barW, 38); }
  }
  x.fillStyle = '#4c6155'; x.font = `500 20px ${mono}`;
  x.fillText('Dates are estimates from the dates entered. Trichomes decide harvest.', M, H - 96);
  x.fillStyle = '#16352a'; x.font = `600 24px ${sans}`; x.fillText('mastergrowbot.com/cannabis-grow-calendar', M, H - 56);
  return await new Promise<Blob>((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error('export'))), 'image/png'));
}

function wrap(x: CanvasRenderingContext2D, text: string, left: number, top: number, width: number, lh: number) {
  const words = text.split(' '); let line = ''; let y = top;
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (x.measureText(test).width > width && line) { x.fillText(line, left, y); line = '   ' + w; y += lh; } else line = test;
  }
  x.fillText(line, left, y); return y;
}
