import { useState } from "react";
import { Camera, FileText, NotebookPen, Play, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const steps = [
  { label: "Photo", icon: Camera, title: "Start with what you see.", detail: "Take a photo or choose one from your phone.", image: "/images/premium/hero-photo-artwork-v5.jpg", alt: "Supplied MasterGrowbot app-store artwork showing a plant photo in a phone", className: "capture" },
  { label: "Report", icon: FileText, title: "Get a second perspective.", detail: "Review the AI finding alongside your own observations.", image: "/images/premium/real-report-overview.webp", alt: "Actual app report capture showing its finding and confidence", className: "report" },
  { label: "Journal", icon: NotebookPen, title: "Keep the photo and context.", detail: "Save the report to your journal or share it for another look.", image: "/images/premium/real-report-journal.webp", alt: "Actual app capture showing the plant photo, Save to Journal and Share Analysis", className: "journal" },
];
export default function HeroProductDemo() {
  const [active, setActive] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const step = steps[active];
  function select(index: number) { setActive(index); setVideoOpen(false); trackEvent("hero_demo_step", {step: steps[index].label, placement: "homepage_hero"}); }
  return <div className="hero-product-demo" aria-label="Interactive MasterGrowbot app preview">
    <div className="hero-demo-top"><span><i aria-hidden="true" /> INSIDE MASTERGROWBOT AI</span><button type="button" onClick={()=>{setVideoOpen(!videoOpen); if(!videoOpen) trackEvent("hero_video_open", {placement:"homepage_hero",creative:"hero_v5"});}}><Play size={14} aria-hidden="true" />{videoOpen?"Back to preview":"Watch 30 sec"}</button></div>
    {videoOpen ? <div className="hero-demo-video"><video controls playsInline autoPlay preload="none" poster="/images/premium/hero-video-poster-v5.jpg" aria-label="MasterGrowbot thirty-second app report walkthrough" onPlay={()=>trackEvent("app_report_video_play",{placement:"homepage_hero",creative:"hero_v5"})}><source src="/videos/mastergrowbot-hero-30s-v5.mp4" type="video/mp4"/><track kind="captions" src="/videos/mastergrowbot-hero-30s-v5.vtt" srcLang="en" label="English" default/></video></div> : <div className="hero-demo-stage">
      <div className="hero-demo-orbit" aria-hidden="true" />
      <div className={`hero-demo-phone ${step.className}`} key={step.className}><div className="hero-demo-phone-bar"><span>MasterGrowbot AI</span><span>App preview</span></div><div className="hero-demo-screen"><img src={step.image} alt={step.alt} width={945} height={2048} fetchPriority={active===0?"high":"auto"}/></div>{active===1 && <div className="hero-report-note"><FileText size={20}/><small>WEBSITE DEMO NOTE</small><strong>Review. Check. Keep.</strong><p>AI output is a starting point for your review.</p></div>}</div>
      <div className="hero-demo-note"><span>0{active+1} / 03</span><strong>{step.title}</strong><p>{step.detail}</p></div>
    </div>}
    <div className="hero-demo-steps" role="group" aria-label="Explore the app workflow">{steps.map(({label,icon:Icon},index)=><button key={label} type="button" aria-pressed={active===index && !videoOpen} onClick={()=>select(index)}><Icon size={16}/><span>{label}</span>{index<2&&<ArrowRight size={13} className="hero-step-arrow"/>}</button>)}</div>
    <p className="hero-demo-disclosure">App-store artwork + iPhone captures · Illustrative AI output. Review against your own observations.</p>
  </div>;
}



