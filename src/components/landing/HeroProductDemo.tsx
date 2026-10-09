import { useState } from "react";
import { Camera, FileText, NotebookPen, Play, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { HERO_DEMO_SECONDS } from "@/lib/heroDemoMetadata";

const steps = [
  { label: "Photo", icon: Camera, title: "Lower leaves turning yellow?", detail: "Start with a clear photo of what looks different.", image: "/images/premium/yellowing-photo-v6.png", alt: "Illustrative preview with an AI-generated plant photo showing yellow lower leaves", className: "example" },
  { label: "Report", icon: FileText, title: "Look at the pattern.", detail: "Yellow below, greener above. A photo alone cannot confirm the cause.", image: "/images/premium/yellowing-report-v6.png", alt: "Sample observations describing yellow lower leaves and greener upper leaves; not a live app analysis", className: "example" },
  { label: "Journal", icon: NotebookPen, title: "Keep the photo and context.", detail: "Compare your observations with the next photo.", image: "/images/premium/yellowing-journal-v6.png", alt: "Illustrative journal preview of the yellowing-leaf example", className: "example" },
];
export default function HeroProductDemo() {
  const [active, setActive] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const step = steps[active];
  function select(index: number) { setActive(index); setVideoOpen(false); trackEvent("hero_demo_step", {step: steps[index].label, placement: "homepage_hero"}); }
  return <div className="hero-product-demo" aria-label="Interactive MasterGrowbot app preview">
    <div className="hero-demo-top"><span><i aria-hidden="true" /> INSIDE MASTERGROWBOT AI</span><button type="button" onClick={()=>{setVideoOpen(!videoOpen); if(!videoOpen) trackEvent("hero_video_open", {placement:"homepage_hero",creative:"hero_v6"});}}><Play size={14} aria-hidden="true" />{videoOpen?"Back to preview":`Watch demo · ${HERO_DEMO_SECONDS} sec`}</button></div>
    {videoOpen ? <div className="hero-demo-video"><video controls playsInline autoPlay preload="none" poster="/images/premium/hero-video-poster-v6.jpg" aria-label="MasterGrowbot narrated app walkthrough with instrumental music" onPlay={()=>trackEvent("app_report_video_play",{placement:"homepage_hero",creative:"hero_v6"})}><source src="/videos/mastergrowbot-hero-narrated-wide-v6.mp4" media="(min-width: 768px)" type="video/mp4"/><source src="/videos/mastergrowbot-hero-narrated-portrait-v6.mp4" type="video/mp4"/><track kind="captions" src="/videos/mastergrowbot-hero-narrated-v6.vtt" srcLang="en" label="English" default/></video></div> : <div className="hero-demo-stage">
      <div className="hero-demo-orbit" aria-hidden="true" />
      <div className={`hero-demo-phone ${step.className}`} key={step.label}><div className="hero-demo-phone-bar"><span>MasterGrowbot AI</span><span>App preview</span></div><div className="hero-demo-screen"><img src={step.image} alt={step.alt} width={470} height={720} fetchPriority={active===0?"high":"auto"}/></div></div>
      <div className="hero-demo-note"><span>0{active+1} / 03</span><strong>{step.title}</strong><p>{step.detail}</p></div>
    </div>}
    <div className="hero-demo-steps" role="group" aria-label="Explore the app workflow">{steps.map(({label,icon:Icon},index)=><button key={label} type="button" aria-pressed={active===index && !videoOpen} onClick={()=>select(index)}><Icon size={16}/><span>{label}</span>{index<2&&<ArrowRight size={13} className="hero-step-arrow"/>}</button>)}</div>
    <p className="hero-demo-disclosure">AI-generated photo + sample observations · Illustrative demo, not a live app analysis.</p>
  </div>;
}




