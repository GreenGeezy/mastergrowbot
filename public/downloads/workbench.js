const $ = id => document.getElementById(id);
const desks = ['climate', 'stock', 'sop'];
let active = 'climate';
let readings = [];
let sampleCsv = '';
let stock = [];
const notes = new Map();
const sampleStock = [
  ['Exit bags · small', 48, 98, 5],
  ['Child-resistant jars', 120, 140, 4],
  ['Receipt rolls', 9, 7, 5],
  ['Tamper seals', 0, 0, 3],
];
const oldSop = 'Match the shipment to the purchase order.\nEnter the lot ID in the receiving log.\nFile the signed slip at the front desk.';
const newSop = 'Match the shipment to the purchase order.\nScan the lot ID into the receiving log.\nAsk the shift lead to initial any quantity discrepancy.\nFile the signed slip at the front desk.';
function element(tag, text, cls) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (cls) node.className = cls;
  return node;
}
function metrics(values) {
  const group = element('div', undefined, 'metrics');
  for (const [label, value] of values) {
    const box = element('div', undefined, 'metric');
    box.append(element('small',label), element('b',String(value)));
    group.append(box);
  }
  return group;
}
function table(headers, rows) {
  const wrap = element('div', undefined, 'tablewrap');
  wrap.tabIndex = 0;
  const grid = element('table');
  const head = grid.createTHead().insertRow();
  for (const label of headers) {
    const th = element('th',label); th.scope = 'col'; head.append(th);
  }
  const body = grid.createTBody();
  for (const cells of rows) {
    const row = body.insertRow();
    for (const value of cells) {
      const cell = row.insertCell();
      if (value instanceof Node) cell.append(value);
      else cell.textContent = value;
    }
  }
  wrap.append(grid);
  return wrap;
}
function setNote(desk, text, instruction) {
  notes.set(desk,{text,instruction});
  if (active === desk) updateOutput();
}
function updateOutput() {
  const ready = Boolean(notes.get(active));
  for (const id of ['copy','download','print']) $(id).disabled = !ready;
  $('feedback').textContent = '';
  const paid=$('paid');paid.href='/ai-strategy?utm_source=workbench&utm_medium=website&utm_campaign=weekly_workbench&utm_content='+active;
  $('outdesc').textContent = {climate:'A shift summary with the readings to check.',stock:'A purchasing note with projected shortages and assumptions.',sop:'A change list with source lines for a staff briefing.'}[active];
}
function activate() {
  const candidate = location.hash.slice(1);
  if (desks.includes(candidate)) active = candidate;
  for (const desk of desks) $(desk).hidden = desk !== active;
  document.querySelectorAll('[data-desk]').forEach(a=>a.setAttribute('aria-current', String(a.dataset.desk === active)));
  updateOutput();
}
window.addEventListener('hashchange', activate);
function parseLog(raw) {
  const lines = raw.trim().replace(/^\uFEFF/,'').split(/\r?\n/);
  if(lines.shift()?.trim().toLowerCase() !== 'timestamp,rh_pct') throw Error('Use the header timestamp,rh_pct and two comma-separated columns.');
  if(!lines.length || lines.length>1000) throw Error('Enter 1 to 1,000 timestamped readings.');
  let previous = '';
  return lines.map((line,i)=>{
    const cells = line.split(',').map(cell=>cell.trim());
    const [time,rh] = cells;
    const stamp = time?.replace('T',' ');
    const date = new Date(stamp?.replace(' ','T') + ':00Z');
    if(cells.length!==2 || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(stamp) || Number.isNaN(date.getTime()) || date.toISOString().slice(0,16).replace('T',' ')!==stamp || previous>=stamp) throw Error('Row '+(i+2)+': enter a unique YYYY-MM-DD HH:mm in ascending order.');
    const value = Number(rh);
    if(!rh || !Number.isFinite(value) || value<0 || value>100) throw Error('Row '+(i+2)+': relative humidity must be between 0 and 100.');
    previous=stamp;
    return {time:stamp,rh:value,ms:date.getTime()};
  });
}
function chart(rows, threshold) {
  const figure = element('div',undefined,'chart');
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 800 130'); svg.setAttribute('preserveAspectRatio','none');
  svg.setAttribute('role','img'); svg.setAttribute('aria-label','Relative humidity over time. Dashed line is your review threshold. Full readings are in the table.');
  const min = Math.max(0,Math.floor(Math.min(threshold,...rows.map(r=>r.rh))/5)*5-5);
  const max = Math.min(100,Math.ceil(Math.max(threshold,...rows.map(r=>r.rh))/5)*5+5);
  const y = v=>120-(v-min)/(max-min)*110;
  const x = r=>4+(r.ms-rows[0].ms)/Math.max(1,rows.at(-1).ms-rows[0].ms)*792;
  function shape(type,attrs){const s=document.createElementNS(ns,type);for(const [key,value] of Object.entries(attrs)) s.setAttribute(key,String(value));svg.append(s);return s}
  shape('line',{x1:0,x2:800,y1:y(threshold),y2:y(threshold),stroke:'#a9462f','stroke-dasharray':'5 4'});
  shape('polyline',{points:rows.map(r=>x(r)+','+y(r.rh)).join(' '),fill:'none',stroke:'#235941','stroke-width':3,pathLength:1,class:'graphline'});
  if(rows.length<=48) for(const r of rows) shape('circle',{cx:x(r),cy:y(r.rh),r:2.8,fill:r.rh>threshold?'#a9462f':'#235941'});
  figure.append(svg,element('div',rows[0].time+' → '+rows.at(-1).time+'  ·  dashed line '+threshold+'% RH  ·  scale '+min+'–'+max+'%', 'legend'));
  return figure;
}
function climate() {
  try {
    readings=parseLog($('clog').value);
    if(!$('limit').validity.valid) throw Error('Set a threshold from 0 to 100% RH.');
    const limit=Number($('limit').value), flagged=readings.filter(r=>r.rh>limit);
    const peak=readings.reduce((a,b)=>b.rh>a.rh?b:a);
    const show=$('only').checked?flagged:readings;
    const dataLabel=$('clog').value.trim()===sampleCsv.trim()?'Published greenhouse sample':'User-entered sensor data';
    const brief=dataLabel+'. '+readings.length+' observations from '+readings[0].time+' to '+readings.at(-1).time+'. '+flagged.length+' readings above '+limit+'% RH. Peak '+peak.rh+'% RH at '+peak.time+'.';
    $('cresult').replaceChildren(metrics([['Readings',readings.length],['Above limit',flagged.length],['Peak RH',peak.rh+'%']]),chart(readings,limit),element('p',brief,'hint'),table(['Timestamp','Relative humidity','Review'],show.map(r=>[r.time,r.rh+'%',r.rh>limit?element('span','Above limit','flag'):'Within limit'])));
    const evidence=flagged.map(r=>r.time+' | '+r.rh+'%').join('\n');
    setNote('climate',brief+'\n\nAbove-threshold rows\n'+(evidence||'None.'),'Draft a three-sentence handoff for the next shift. Cite the peak time and sample count. Suggest one equipment or log check. Do not infer a duration between observations or a cause from these readings.');
    $('cerr').textContent='';
  } catch(e) { $('cerr').textContent=e.message; $('cresult').replaceChildren(); notes.delete('climate');updateOutput(); }
}
function stockInput(item,k) {
  const field=element('input');
  const labels=['Item','On hand','Sold in 7 days','Lead days'];
  field.setAttribute('aria-label',labels[k]+' for '+item[0]);
  field.type=k?'number':'text';field.value=item[k];field.required=true;
  if(k){field.min='0';field.max='10000000';field.step='1'}else field.maxLength=90;
  field.addEventListener('input',()=>{notes.delete('stock');updateOutput();$('smetrics').textContent='Finish editing this cell to update the summary.';});
  field.addEventListener('change',()=>{
    const valid=field.checkValidity() && field.value.trim();
    item[k]=valid?(k?Number(field.value):field.value.trim()):'';
    renderStock();
    if (valid) event('workbench_use');
  });
  return field;
}
function renderStock() {
  const valid=stock.every(row=>row.every(v=>v!==''));
  const results=stock.map(row=>{
    const [name,qty,sold,lead]=row;
    const short=Math.max(0,Math.ceil(sold*lead/7)-qty);
    return {row,name,short,cover:sold?(qty*7/sold).toFixed(1):'—'};
  });
  const sorted=results.sort((a,b)=>$('stocksort').value==='name'?a.name.localeCompare(b.name):b.short-a.short || a.name.localeCompare(b.name));
  const summary=element('div');summary.id='smetrics';
  if(valid)summary.append(metrics([['Items',stock.length],['Project a shortfall',results.filter(r=>r.short>0).length],['No recent sales',stock.filter(r=>r[2]===0).length]]));
  else summary.append(element('p','Complete every field. Use nonnegative whole numbers for counts and lead days.','err'));
  $('sresult').replaceChildren(summary,table(['Item','On hand','Sold / 7 days','Lead days','Days of cover','Short by',''],sorted.map(r=>{
    const del=element('button','Remove');del.setAttribute('aria-label','Remove '+r.name);del.disabled=stock.length<=1;
    del.onclick=()=>{stock=stock.filter(row=>row!==r.row);renderStock()};
    return [...r.row.map((_,k)=>stockInput(r.row,k)),valid?r.cover:'—',valid?(r.short?element('b',r.short+' units','flag'):'0'):'—',del];
  })));
  if(!valid){notes.delete('stock');updateOutput();return}
  const report=results.map(r=>r.name+' | '+r.row[1]+' on hand | '+r.row[2]+' sold in 7 days | '+r.row[3]+' lead days | projected shortfall '+r.short+' units').join('\n');
  const isSample=JSON.stringify(stock)===JSON.stringify(sampleStock);
  setNote('stock',(isSample?'Illustrative shop example.':'Working inventory scenario.')+' Demand assumes last week’s pace. No open orders or safety stock included.\n'+report,'Prepare a purchasing handoff. Name the first item to check and quote its projected shortfall. Ask about pending deliveries before suggesting a quantity. Distinguish zero sales from zero stock.');
}
function compareSop() {
  const lines=id=>$(id).value.split(/\r?\n/).map((s,i)=>({line:i+1,text:s.trim()})).filter(r=>r.text);
  const a=lines('old'),b=lines('new');
  if(!a.length || !b.length || Math.max(a.length,b.length)>150){
    $('perr').textContent='Enter 1–150 nonblank lines in each version.';$('presult').replaceChildren();notes.delete('sop');updateOutput();return;
  }
  $('perr').textContent='';
  const lcs=Array.from({length:a.length+1},()=>new Uint16Array(b.length+1));
  for(let i=a.length-1;i>=0;i--) for(let j=b.length-1;j>=0;j--) lcs[i][j]=a[i].text===b[j].text?1+lcs[i+1][j+1]:Math.max(lcs[i+1][j],lcs[i][j+1]);
  const diff=[];let i=0,j=0;
  while(i<a.length || j<b.length){
    if(i<a.length && j<b.length && a[i].text===b[j].text){i++;j++;continue}
    if(j===b.length || (i<a.length && lcs[i+1][j]>=lcs[i][j+1])) diff.push(['Removed',a[i++]]);
    else diff.push(['Added',b[j++]]);
  }
  const list=element('ul',undefined,'changes');
  for(const [kind,r] of diff){const li=element('li');li.append(element('code',kind+' · line '+r.line),document.createTextNode(r.text));list.append(li)}
  if(!diff.length)list.append(element('li','The two versions have identical instruction lines.'));
  $('presult').replaceChildren(metrics([['Added',diff.filter(d=>d[0]==='Added').length],['Removed',diff.filter(d=>d[0]==='Removed').length],['Unchanged',lcs[0][0]]]),list);
  setNote('sop',diff.map(([kind,r])=>kind+' · line '+r.line+' | '+r.text).join('\n') || 'No line changes found.','Write a shift briefing from the exact changes below. Quote new responsibilities and cite the revised line numbers. End with one question for the document owner. Do not invent a policy, effective date or reason for the change.');
}

function event(name) { window.gtag?.('event', name, {workbench_desk:active}); }
function clearNote(desk) {
  notes.delete(desk);updateOutput();
  const result={sop:'presult',climate:'cresult'}[desk];
  if(result) $(result).replaceChildren(element('p','Apply your edits to refresh the result.','hint'));
}
function reset(desk) {
  if(desk==='climate') { $('clog').value=sampleCsv;$('limit').value='80';$('only').checked=false;climate(); }
  if(desk==='stock') {stock=sampleStock.map(row=>[...row]);renderStock();}
  if(desk==='sop') { $('old').value=oldSop;$('new').value=newSop;compareSop(); }
}
for(const b of document.querySelectorAll('[data-reset]')) b.onclick=()=>reset(b.dataset.reset);
for(const b of document.querySelectorAll('[data-apply]')) b.onclick=()=>{b.dataset.apply==='sop'?compareSop():climate();if(notes.has(active))event('workbench_use')};
for(const b of document.querySelectorAll('[data-desk]')) b.onclick=()=>{active=b.dataset.desk;event('workbench_select');};
for(const id of ['old','new']) $(id).oninput=()=>clearNote('sop');
$('clog').oninput=()=>clearNote('climate');
$('only').onchange=climate;$('limit').oninput=climate;$('stocksort').onchange=renderStock;
$('additem').onclick=()=>{stock.push(['New item',0,0,1]);renderStock();const field=Array.from($('sresult').querySelectorAll('input[type=text]')).findLast(el=>el.value==='New item');field?.focus();field?.select()};
async function copyText(text,success){
  try{await navigator.clipboard.writeText(text);$('feedback').textContent=success;}
  catch{const box=element('textarea');box.readOnly=true;box.value=text;box.setAttribute('aria-label','Text to copy');$('feedback').replaceChildren(document.createTextNode('Select and copy this text.'),box);box.select();}
}
$('copy').onclick=()=>{const n=notes.get(active);if(n){copyText(n.instruction+'\n\nWorking evidence\n'+n.text,'AI prompt and evidence copied. Paste into the assistant you use.');event('workbench_copy')}};
$('download').onclick=()=>{const n=notes.get(active);if(!n)return;const blob=new Blob([n.text+'\n\nAI prompt\n'+n.instruction],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=element('a');a.download=active+'-shift-note.txt';a.href=url;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);event('workbench_export')};
$('print').onclick=()=>window.print();
$('share').onclick=()=>{const link=new URL(location.pathname,location.origin);link.search='utm_source=reader&utm_medium=referral&utm_campaign=workbench';link.hash=active;copyText(link.href,'Share link copied. It opens the public example.');$('feedback').scrollIntoView({block:'nearest'});event('workbench_share')};
$('join').onsubmit=async e=>{
  e.preventDefault();const button=e.target.querySelector('button');if(button.disabled)return;
  button.disabled=true;const q=new URLSearchParams(location.search);
  try{
    const payload={email:$('email').value.trim(),sourcePage:location.pathname,sourceForm:'newsletter_workbench_'+active,interestProduct:'Cannabis AI News & Tools',utm_source:q.get('utm_source')||'workbench',utm_medium:q.get('utm_medium')||'website',utm_campaign:q.get('utm_campaign')||'weekly_workbench',utm_content:q.get('utm_content')||active};
    const res=await fetch('/api/newsletter/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const receipt=await res.json();
    if(!res.ok || !receipt.ok)throw Error('Please try again.');
    $('receipt').textContent=receipt.confirmationSent?'Check your inbox. Confirm your email to receive next week’s edition.':'Your request was recorded. Confirmation email delivery is pending.';
    $('email').value='';event('workbench_signup_request');
  }catch{$('receipt').textContent='We could not complete this request. Please try again.'}finally{button.disabled=false}
};
activate();reset('stock');reset('sop');
try{const response=await fetch('/downloads/greenhouse-s1.csv');if(!response.ok)throw Error();sampleCsv=(await response.text()).replace(/\r\n/g,'\n');reset('climate');}
catch{$('cerr').textContent='The example could not load. Paste your own data or reload to try again.'}
