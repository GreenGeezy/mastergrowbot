import { useRef, useState } from "react";
import { Camera, FileText, NotebookPen, Play, ArrowLeft, ScanLine, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { HERO_DEMO_SECONDS, HERO_VERSION } from "@/lib/heroDemoMetadata";
import HeroExampleReport from "./HeroExampleReport";

const steps = [
  { label: "Photo", icon: Camera, title: "Start with your plant", detail: "Capture the symptoms you want to understand.", image: "/images/premium/ios-photo-entry-v3.png", alt: "MasterGrowbot app photo entry screen with Take Photo and Analyze Image actions", width: 1170, height: 2250 },
  { label: "Report", icon: FileText, title: "Know what to check next", detail: "Yellow lower leaves? Start with simple watering and feeding checks.", image: "", alt: "", width: 945, height: 2048 },
  { label: "Journal", icon: NotebookPen, title: "See what changes", detail: "Keep photos and notes together as your grow progresses.", image: "/images/premium/real-report-journal.webp", alt: "Supplied MasterGrowbot app report showing journal actions", width: 945, height: 2048 },
];

export default function HeroProductDemo() {
  const [active, setActive] = useState(1);
  const [videoOpen, setVideoOpen] = useState(false);
  const [failedScreen, setFailedScreen] = useState(false);
  const milestones = useRef(new Set<number>());
  const step = steps[active];
  function recordProgress(video: HTMLVideoElement) {
    if (!Number.isFinite(video.duration) || !video.duration) return;
    for (const milestone of [25, 50, 75, 100]) {
      if (video.currentTime / video.duration >= milestone / 100 && !milestones.current.has(milestone)) {
        milestones.current.add(milestone);
        trackEvent("hero_video_progress", { placement: "homepage_hero", creative: "hero_v7", hero_version: HERO_VERSION, milestone });
      }
    }
  }
  function select(index: number) {
    setActive(index);
    setFailedScreen(false);
    setVideoOpen(false);
    trackEvent("hero_demo_step", { step: steps[index].label, placement: "homepage_hero", hero_version: HERO_VERSION });
  }
  function toggleVideo() {
    if (!videoOpen) {
      milestones.current.clear();
      trackEvent("hero_video_open", { placement: "homepage_hero", creative: "hero_v7", hero_version: HERO_VERSION });
    }
    setVideoOpen(!videoOpen);
  }
  return <div className="hero-product-demo" aria-label="Interactive MasterGrowbot app preview">
    <div className="hero-demo-top">
      <span><i aria-hidden="true" /> YOUR GROW. AI IN FOCUS.</span>
      <button type="button" onClick={toggleVideo} aria-controls="hero-demo-panel" aria-expanded={videoOpen}>
        {videoOpen ? <ArrowLeft size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        {videoOpen ? "Back to preview" : `Watch demo · ${HERO_DEMO_SECONDS} sec`}
      </button>
    </div>
    <div id="hero-demo-panel" className={`hero-demo-panel${videoOpen ? " is-video" : ""}`}>
      {videoOpen ? <div className="hero-demo-video">
        <video controls playsInline autoPlay preload="none" poster="/images/premium/hero-video-poster-v7.jpg" aria-label="MasterGrowbot narrated app walkthrough with instrumental music" onTimeUpdate={event => recordProgress(event.currentTarget)} onEnded={event => recordProgress(event.currentTarget)} onPlay={() => trackEvent("app_report_video_play", { placement: "homepage_hero", creative: "hero_v7", hero_version: HERO_VERSION })}>
          <source src="/videos/mastergrowbot-hero-narrated-wide-v7.mp4" media="(min-width: 768px)" type="video/mp4" />
          <source src="/videos/mastergrowbot-hero-narrated-portrait-v7.mp4" type="video/mp4" />
          <track kind="captions" src="/videos/mastergrowbot-hero-narrated-v7.vtt" srcLang="en" label="English" default />
          Your browser does not support video. Explore the app preview below.
        </video>
      </div> : <div className="hero-demo-stage">
        <picture className="hero-lab-art" aria-hidden="true">
          <source media="(max-width: 599px)" srcSet="/images/premium/hero-grow-lab-mobile-v8.webp" />
          <img src="/images/premium/hero-grow-lab-v8.webp" alt="" width="1200" height="800" fetchPriority="high" onError={event => { event.currentTarget.style.visibility = "hidden"; }} />
        </picture>
        <div className="hero-lab-grid" aria-hidden="true" />
        <div className="hero-lab-orbit" aria-hidden="true" />
        <div className="hero-demo-phone">
          <div className="hero-demo-phone-bar"><span>MasterGrowbot AI</span><span>App preview</span></div>
          <div className="hero-demo-screen" key={step.label}>
            {active === 1 ? <HeroExampleReport /> : failedScreen ? <div className="hero-screen-fallback"><step.icon size={32} aria-hidden="true" /><strong>{step.title}</strong><p>{step.detail}</p><span>App preview unavailable</span></div> : <img src={step.image} alt={step.alt} width={step.width} height={step.height} onError={() => setFailedScreen(true)} />}
          </div>
          <div className="hero-phone-home" aria-hidden="true" />
        </div>
        <div className="hero-benefit-card hero-benefit-insight"><span className="hero-card-icon"><ScanLine size={19} aria-hidden="true" /></span><div><span>PHOTO → INSIGHT</span><strong>Understand symptoms</strong><p>A clearer starting point.</p></div></div>
        <div className="hero-benefit-card hero-benefit-record"><span className="hero-card-icon"><NotebookPen size={19} aria-hidden="true" /></span><div><span>YOUR GROW HISTORY</span><strong>Track your grow</strong><p>Every observation, together.</p></div></div>
        <img className="hero-botanical-accent" src="/images/premium/hero-leaf-accent-v8.webp" alt="" aria-hidden="true" width="480" height="480" onError={event => { event.currentTarget.style.visibility = "hidden"; }} />
      </div>}
    </div>
    <div className="hero-demo-note" aria-live="polite" aria-atomic="true"><span><Sparkles size={14} aria-hidden="true" /> 0{active + 1} / 03 · {step.label.toUpperCase()}</span><strong>{step.title}</strong><p>{step.detail}</p></div>
    <div className="hero-demo-steps" role="group" aria-label="Explore the app workflow">{steps.map(({ label, icon: Icon }, index) => <button key={label} type="button" aria-pressed={active === index && !videoOpen} aria-controls="hero-demo-panel" onClick={() => select(index)}><Icon size={17} aria-hidden="true" /><span>{label}</span></button>)}</div>
    <p className="hero-demo-disclosure">Illustrative report, not a diagnosis · Photo & Journal: supplied app screens · AI-generated botanical artwork.</p>
  </div>;
}
