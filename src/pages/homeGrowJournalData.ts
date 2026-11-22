export type Visit = { date: string; note: string; photo: string; humidity: string };
export type Question = 'leaves' | 'growth' | 'change';
export type Journal = { question: Question; change: string; visits: [Visit, Visit] };

export const questions = {
  leaves: { label: 'Read a leaf', ask: 'Are the pale areas on the same leaves, or are more leaves affected?', shot: 'Frame the whole plant first. For a closer comparison, use the same lower leaf and keep a pot rim or branch fork in frame.', check: 'Photograph the same leaf and one upper leaf in the same light on your next visit.' },
  growth: { label: 'Track new growth', ask: 'Which new growth can I actually distinguish between visits?', shot: 'Use a fixed camera position. Include the pot rim and a ruler or other unchanged reference beside the plant.', check: 'Use the same reference next time. Record a measured height separately if you need a number.' },
  change: { label: 'Check a recent change', ask: 'What visibly changed after my last adjustment, and what else could explain it?', shot: 'Photograph the same side before and after the adjustment. Note what changed and roughly when.', check: 'Keep a record of the adjustment and the next observation so two changes do not get attributed to each other.' },
};

export const emptyJournal = (): Journal => ({
  question: 'leaves', change: '', visits: [0, 1].map(() => ({ date: '', note: '', photo: '', humidity: '' })) as [Visit, Visit],
});

export const example: Journal = {
  question: 'leaves', change: 'The pot and branch fork are visible in both frames. Watering and feeding histories were not recorded.',
  visits: [
    { date: '2026-11-14', note: 'One lower leaf has a pale tip. Upper leaves look green.', photo: '/downloads/home-grow-before.webp', humidity: '54' },
    { date: '2026-11-17', note: 'Pale areas are visible on two lower tips. I cannot tell whether the first area spread.', photo: '/downloads/home-grow-after.webp', humidity: '57' },
  ],
};
export function hasEvidence(v: Visit) { return Boolean(v.photo || v.note.trim() || v.humidity !== ''); }
export function dateInterval(visits: [Visit, Visit]) {
  if (!visits.every(v => v.date)) return null;
  return (Date.parse(visits[1].date) - Date.parse(visits[0].date)) / 86400000;
}
export function buildPrompt(journal: Journal, sample: boolean) {
  const question = questions[journal.question];
  const evidence = journal.visits.flatMap((visit, i) => hasEvidence(visit) ? [
    ['Visit '+(i+1), visit.date, visit.note.trim(), visit.humidity !== '' ? visit.humidity+'% RH (one reading)' : '', visit.photo ? 'Photo in the attached sheet.' : 'No photo for this visit.'].filter(Boolean).join(' · ')
  ] : []).join('\n');
  return [sample ? 'Practice with these illustrated cannabis observations.' : 'Help me read my home cannabis grow journal.', question.ask, evidence, journal.change.trim() && 'Context: '+journal.change.trim(), 'Separate my written observations from what you can see in any attached photo. If the angle or lighting changed, say what that prevents you from comparing. When there is only one visit, establish a baseline.', 'Give me three short bullets: what is supported, what remains uncertain, and one low-effort observation to make next. Ask for the missing detail that would most change your answer before suggesting an intervention.'].filter(Boolean).join('\n\n');
}
async function loadImage(src: string) {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
}
export async function preparePhoto(file: File) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 15 * 1024 * 1024) throw Error('Choose a JPG, PNG or WebP image under 15 MB. On iPhone, a screenshot also works.');
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, 1200 / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1,Math.round(img.width*scale)); canvas.height = Math.max(1,Math.round(img.height*scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw Error('This browser could not prepare the photo.');
    ctx.fillStyle = '#eeeae0'; ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
    return canvas.toDataURL('image/jpeg',0.82);
  } finally { URL.revokeObjectURL(url); }
}
export async function downloadSheet(journal: Journal, sample: boolean) {
  const canvas = document.createElement('canvas'); canvas.width = 1600; canvas.height = 1060;
  const ctx = canvas.getContext('2d'); if (!ctx) throw Error('Unable to create the photo sheet.');
  ctx.fillStyle = '#f7f3e8';ctx.fillRect(0,0,1600,1060);
  ctx.fillStyle = '#173e31';ctx.font = '52px Georgia';ctx.fillText('Home Grow Fieldnotes',42,75);
  ctx.font = '24px sans-serif';ctx.fillText(sample ? 'Illustrated practice journal' : questions[journal.question].ask,42,117);
  for (const [i,v] of journal.visits.entries()) {
    const x=42+i*768, y=154, w=746,h=760;
    ctx.fillStyle='#e1e3d4';ctx.fillRect(x,y,w,h);
    if(v.photo){
      const img=await loadImage(v.photo);
      const scale=Math.min(w/img.width,h/img.height);
      ctx.drawImage(img,x+(w-img.width*scale)/2,y+(h-img.height*scale)/2,img.width*scale,img.height*scale);
    }else{ctx.fillStyle='#546457';ctx.font='28px Georgia';ctx.fillText('No photo attached',x+24,y+h/2);}
    ctx.fillStyle='#163e30';ctx.font='32px Georgia';ctx.fillText('Visit '+(i+1)+(v.date?'  /  '+v.date:''),x,967);
    ctx.font='22px sans-serif';ctx.fillText(v.humidity!==''?'Relative humidity recorded: '+v.humidity+'%':'',x,1006);
  }
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/jpeg',0.9));
  if(!blob) throw Error('Unable to export. Try a smaller photo.');
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='home-grow-fieldnotes.jpg';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
}
export function isSavedJournal(raw: unknown): raw is Journal {
  if (!raw || typeof raw !== 'object') return false;
  const j=raw as Journal;
  return Object.prototype.hasOwnProperty.call(questions,j.question) && typeof j.change==='string' && Array.isArray(j.visits) && j.visits.length===2 && j.visits.every(v=>v && ['date','note','photo','humidity'].every(k=>typeof v[k as keyof Visit]==='string') && (!v.photo || v.photo.startsWith('data:image/jpeg;base64,')));
}
