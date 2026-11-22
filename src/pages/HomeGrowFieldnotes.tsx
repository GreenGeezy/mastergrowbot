import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowDown, ArrowUpRight, Camera, Check, Copy, Download, Leaf, Save } from 'lucide-react';
import NewsletterSignup from '@/components/landing/NewsletterSignup';
import { trackEvent } from '@/lib/analytics';
import { buildPrompt, dateInterval, downloadSheet, emptyJournal, example, hasEvidence, isSavedJournal, preparePhoto, questions } from './homeGrowJournalData';
import type { Journal, Question, Visit } from './homeGrowJournalData';
import './home-grow-fieldnotes.css';

const storageKey = 'mgb.home-grow-fieldnotes.v1';
export default function HomeGrowFieldnotes() {
  const [sample,setSample]=useState(true);
  const [mine,setMine]=useState<Journal>(emptyJournal);
  const [overlay,setOverlay]=useState(false);
  const [split,setSplit]=useState(50);
  const [status,setStatus]=useState('');
  const [saved,setSaved]=useState(false);
  const [loading,setLoading]=useState([false,false]);
  const versions=useRef([0,0]);
  const [assistant,setAssistant]=useState<'ChatGPT'|'Claude'>('ChatGPT');
  const [manualCopy,setManualCopy]=useState(false);
  useEffect(()=>{
    try{
      const stored=JSON.parse(localStorage.getItem(storageKey) || 'null');
      if(isSavedJournal(stored)){setMine(stored);setSaved(true);setSample(false);}
    }catch{/* Storage is optional. */}
  },[]);
  const journal=sample?example:mine;
  const question=questions[journal.question];
  const days=dateInterval(journal.visits);
  const invalid=days!==null && days<0 || journal.visits.some(v=>v.humidity!=='' && (!Number.isFinite(Number(v.humidity)) || Number(v.humidity)<0 || Number(v.humidity)>100));
  const usable=journal.visits.some(hasEvidence) && !invalid && !loading.some(Boolean);
  const both=journal.visits.every(v=>v.photo);
  const prompt=buildPrompt(journal,sample);
  const log=(action:string)=>trackEvent('home_journal_'+action,{journal_mode:sample?'example':'personal'});
  const changeMode=(next:boolean)=>{setSample(next);setOverlay(false);setStatus('');setManualCopy(false);if(!next)trackEvent('home_journal_start',{});};
  function updateVisit(index:number,patch:Partial<Visit>){
    setMine(prev=>{const visits=[...prev.visits] as [Visit,Visit];visits[index]={...visits[index],...patch};return {...prev,visits};});
    setStatus('');setManualCopy(false);setSaved(false);
  }
  async function choosePhoto(index:number,file?:File){
    if(!file)return;
    const version=++versions.current[index];
    setLoading(prev=>prev.map((v,i)=>i===index?true:v));
    try{const photo=await preparePhoto(file);if(version===versions.current[index])updateVisit(index,{photo});}
    catch(e){if(version===versions.current[index])setStatus(e instanceof Error?e.message:'This photo could not be read.');}
    finally{if(version===versions.current[index])setLoading(prev=>prev.map((v,i)=>i===index?false:v));}
  }
  async function copy(){
    try{await navigator.clipboard.writeText(prompt);setStatus(journal.visits.some(v=>v.photo) ? 'Prompt copied. Attach your photo sheet in '+assistant+' and paste the prompt.' : 'Prompt copied. Paste your observations into '+assistant+'.');}
    catch{setManualCopy(true);setStatus('Select the prompt text below and copy it.');}
    log('copy');
  }
  function save(){
    try{localStorage.setItem(storageKey,JSON.stringify(mine));setSaved(true);setStatus('Saved in this browser. Your photos and notes will be here when you return.');}
    catch{setStatus('Browser storage is full or unavailable. Download the sheet and copy your notes before closing.');}
  }
  function clearSaved(){
    if(!window.confirm('Clear both visits and the saved journal from this device?'))return;
    try{localStorage.removeItem(storageKey);}catch{setStatus('This browser could not remove the saved journal.');return;}
    versions.current=versions.current.map(v=>v+1);setLoading([false,false]);setMine(emptyJournal());setOverlay(false);setSaved(false);setStatus('Your journal was cleared.');
  }
  return <main className="hgf">
    <Helmet><title>Home Grow Fieldnotes | Cannabis AI News &amp; Tools</title>
      <meta name="description" content="Compare two photos of your home grow, keep a private journal and build an evidence-based prompt for ChatGPT or Claude."/>
      <link rel="canonical" href="https://www.mastergrowbot.com/home-grow-journal"/>
      <meta property="og:title" content="What changed in your home grow?"/><meta property="og:image" content="https://www.mastergrowbot.com/downloads/home-grow-cover.webp"/>
    </Helmet>
    <header className="hf-mast"><div className="hf-wrap"><a href="/newsletter"><Leaf size={20}/><span>Cannabis AI <i>News &amp; Tools</i></span></a><a href="#weekly">Weekly email <ArrowUpRight size={15}/></a></div></header>
    <section className="hf-hero"><img src="/downloads/home-grow-cover.webp" alt="A home grower’s notebook beside a potted cannabis plant" fetchPriority="high"/>
      <div className="hf-wrap"><p className="hf-eyebrow">A field journal for home growers</p><h1>Home Grow<br/><em>Fieldnotes.</em></h1><p>Is that pale tip spreading? Put two visits side by side. Take the photos, dates and a better question to ChatGPT or Claude.</p><a className="hf-gold" href="#journal">Try the journal <ArrowDown size={16}/></a></div>
    </section>
    <div id="journal" className="hf-wrap hf-body">
      <div className="hf-heading"><div><p className="hf-eyebrow">The observation table</p><h2>What changed?</h2></div><div className="hf-switch" aria-label="Journal mode">
        <button aria-pressed={sample} onClick={()=>changeMode(true)}>See the example</button><button aria-pressed={!sample} onClick={()=>changeMode(false)}>Use my plant</button></div></div>
      {sample?<p className="hf-intro">Explore an illustrated three-day comparison. Switch to <b>Use my plant</b> for your own private journal.</p>:<p className="hf-intro">Start with one photo or a written observation. Add another visit when you have one. Your photos stay in this browser until you choose to share them.</p>}
      <div className="hf-layout"><section className="hf-cards" aria-label="Compare plant observations">
        {!sample && <label className="hf-control">What would you like to check?<select value={mine.question} onChange={e=>{setMine({...mine,question:e.target.value as Question});setSaved(false);setStatus('');}}>{Object.entries(questions).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></label>}
        <div className="hf-photos">{journal.visits.map((v,i)=><article key={i}><div className="hf-photo">
          {v.photo?<img src={v.photo} alt={sample?'Illustrated plant at visit '+(i+1):'Your plant at visit '+(i+1)}/>:<div className="hf-empty"><Camera size={32}/><span>{i===0?'Your first observation':'Your follow-up'}</span></div>}
          <span className="hf-stamp">Visit {i+1}</span>
          {!sample && <label className="hf-upload"><Camera size={15}/>{loading[i]?'Reading…':v.photo?'Replace':'Add photo'}<input type="file" accept="image/jpeg,image/png,image/webp" aria-label={'Photo for visit '+(i+1)} onChange={e=>{choosePhoto(i,e.target.files?.[0]);e.target.value='';}}/></label>}
        </div>
        {sample?<div className="hf-caption"><small>{v.date} · {v.humidity}% RH</small><p>{v.note}</p></div>:<div className="hf-inputs"><label>Visit date<input type="date" value={v.date} onChange={e=>updateVisit(i,{date:e.target.value})}/></label><label>Humidity, % <small>(optional)</small><input type="number" min="0" max="100" step="any" value={v.humidity} onChange={e=>updateVisit(i,{humidity:e.target.value})}/></label><label>What did you notice?<textarea rows={3} maxLength={500} value={v.note} placeholder={i?'What looks different this time?':'Which leaves? Where on the plant?'} onChange={e=>updateVisit(i,{note:e.target.value})}/></label></div>}
        </article>)}</div>
        {both && <details open={overlay} onToggle={e=>setOverlay(e.currentTarget.open)} className="hf-overlay"><summary>Overlay the two photos</summary><p>Line up the pot rim or a branch in both images. Drag to inspect changes in framing and color.</p><div className="hf-wipe"><img src={journal.visits[1].photo} alt="Visit 2 behind the divider"/><img src={journal.visits[0].photo} style={{clipPath:'inset(0 '+(100-split)+'% 0 0)'}} alt="Visit 1 to the left of the divider"/><span style={{left:split+'%'}}/></div><label>Visit 1 / Visit 2<input type="range" min="0" max="100" value={split} onChange={e=>setSplit(Number(e.target.value))}/></label></details>}
        {!sample && <label className="hf-control">Anything else change between visits?<textarea maxLength={600} rows={2} value={mine.change} placeholder="For example, a different light, camera angle or watering day." onChange={e=>{setMine({...mine,change:e.target.value});setSaved(false);setStatus('');}}/></label>}
        {!sample && <div className="hf-actions"><button disabled={!usable} onClick={save}>{saved?<Check size={16}/>:<Save size={16}/>} {saved?'Saved on this device':'Save on this device'}</button><button onClick={clearSaved}>Clear journal</button></div>}
      </section>
      <aside className="hf-note"><p className="hf-eyebrow">{sample?'Reading the example':'Your field note'}</p><h3>{sample?'A yellow tip is a clue.':'What you can check.'}</h3>
        {sample?<><p>The lower tips look paler in the second illustration. That observation alone can’t tell you whether the plant needs anything.</p><p>Humidity is 54% in the first entry and 57% in the second. Two spot readings leave the hours between them unknown.</p></>:<><p>{question.shot}</p><p>{invalid?'Check the order of your dates and use a humidity value from 0 to 100.':days===null?'Add dates to measure the time between visits.':days===0?'Both visits are dated the same day.':days+' days between the two visits.'}</p></>}
        <div><small>On your next visit</small><p>{question.check}</p></div></aside></div>
      <section className="hf-assist"><div><p className="hf-eyebrow">Take it to your AI assistant</p><h2>Ask with evidence.</h2><p>Download the labeled photo sheet, attach it in your chat and paste the prompt. You decide what leaves your device.</p>
      <div className="hf-switch">{(['ChatGPT','Claude'] as const).map(name=><button key={name} aria-pressed={assistant===name} onClick={()=>setAssistant(name)}>{name}</button>)}</div>
      <p><a href={assistant==='ChatGPT'?'https://chatgpt.com/':'https://claude.ai/new'} target="_blank" rel="noreferrer">Open {assistant} <ArrowUpRight size={14}/></a></p></div>
      <div><p className="hf-prompt">{question.ask}</p><div className="hf-actions"><button disabled={!usable || !journal.visits.some(v=>v.photo)} onClick={async()=>{try{await downloadSheet(journal,sample);setStatus('Photo sheet downloaded. Attach it to your chat.');log('export');}catch{setStatus('The sheet could not be downloaded. Try again or attach your original photos.');}}}><Download size={16}/>Photo sheet</button><button disabled={!usable} onClick={copy}><Copy size={16}/>Copy full prompt</button></div>
      <details open={manualCopy || undefined}><summary>Read the full prompt</summary><pre>{prompt}</pre></details></div></section>
      <p role="status" className="hf-status">{status}</p>
      <section id="weekly" className="hf-weekly"><NewsletterSignup homeJournal/></section>
      <footer><a href="https://www.mastergrowbot.com/home-grow-journal?utm_source=reader&amp;utm_medium=referral&amp;utm_campaign=home_fieldnotes" onClick={async e=>{e.preventDefault();const url=e.currentTarget.href;try{await navigator.clipboard.writeText(url);setStatus('Copied a link to the public journal. Your private notes and photos stay here.');log('share');}catch{setStatus('Copy this public link to share: '+url);}}}>Copy the public journal link ↗</a><a href="/downloads/cannabis-ai-at-work.html?utm_source=home_journal&utm_medium=website">Tools for cannabis teams ↗</a><a href="/?utm_source=home_journal&utm_medium=website&utm_campaign=fieldnotes#download" onClick={()=>log('app_click')}>Keep a grow journal in MasterGrowbot AI ↗</a></footer>
    </div></main>;
}
