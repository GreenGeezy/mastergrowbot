import { useEffect, useRef, useState } from "react";
import { Camera, FileText, NotebookPen, Play, Pause, RotateCcw, ArrowLeft, ScanLine, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { HERO_DEMO_SECONDS, HERO_VERSION } from "@/lib/heroDemoMetadata";
import HeroExampleReport from "./HeroExampleReport";

const steps = [
  { label: "Photo", icon: Camera, title: "Start with your plant", detail: "Try an example photo. See how a plant concern becomes a practical next step.", image: "/images/premium/walkthrough-capture.webp", alt: "Illustrative home grower photographing a cannabis plant inside a grow tent", width: 1536, height: 1024 },
  { label: "Report", icon: FileText, title: "Know what to check next", detail: "Yellow lower leaves? Start with simple watering and feeding checks.", image: "", alt: "", width: 945, height: 2048 },
  { label: "Journal", icon: NotebookPen, title: "See what changes", detail: "Keep photos and notes together as your grow progresses.", image: "/images/premium/real-report-journal.webp", alt: "Supplied MasterGrowbot app report showing journal actions", width: 945, height: 2048 },
];

export default function HeroProductDemo() {
  const [active, setActive] = useState(1);
  const [videoOpen, setVideoOpen] = useState(false);
  const [failedScreen, setFailedScreen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState(0);
  const [showPlan, setShowPlan] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const reportButton = useRef<HTMLButtonElement>(null);
  const milestones = useRef(new Set<number>());
  const step = steps[active];
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { if (preference.matches) { setPlaying(false); setAnalyzing(false); setPhase(0); setShowPlan(false); setActive(1); } };
    update();
    preference.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 });
    if (container.current) observer.observe(container.current);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    if (!preference.matches) { setActive(0); setPlaying(true); }
    return () => { observer.disconnect(); preference.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (!playing || !visible || !pageVisible || videoOpen) return;
    const timer = window.setTimeout(() => {
      const next = phase + 1;
      setPhase(next);
      setAnalyzing(next === 1);
      setShowPlan(next === 3);
      setFailedScreen(false);
      setActive(next < 2 ? 0 : next === 4 ? 2 : 1);
      if (next === 5) {
        setPlaying(false);
        trackEvent("hero_story_complete", { placement: "homepage_hero", hero_version: HERO_VERSION });
      }
    }, [3200, 2400, 5200, 5200, 4500][phase] ?? 4500);
    return () => window.clearTimeout(timer);
  }, [playing, visible, pageVisible, videoOpen, phase]);
  function replayStory() {
    setPhase(0); setActive(0); setAnalyzing(false); setShowPlan(false); setFailedScreen(false); setVideoOpen(false); setPlaying(true);
    trackEvent("hero_story_replay", { placement: "homepage_hero", hero_version: HERO_VERSION });
  }
  useEffect(() => {
    if (!analyzing || playing || phase === 1) return;
    const timer = window.setTimeout(() => {
      setAnalyzing(false);
      setActive(1);
      reportButton.current?.focus({ preventScroll: true });
      trackEvent("hero_photo_demo_complete", { placement: "homepage_hero", hero_version: HERO_VERSION });
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [analyzing, playing, phase]);
  function captureExample() {
    setPlaying(false); setPhase(0);
    setAnalyzing(true);
    trackEvent("hero_photo_demo_capture", { placement: "homepage_hero", hero_version: HERO_VERSION });
  }
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
    setPlaying(false); setPhase(0); setShowPlan(false);
    setAnalyzing(false);
    setActive(index);
    setFailedScreen(false);
    setVideoOpen(false);
    trackEvent("hero_demo_step", { step: steps[index].label, placement: "homepage_hero", hero_version: HERO_VERSION });
  }
  function toggleVideo() {
    setPlaying(false); setPhase(0); setShowPlan(false);
    setAnalyzing(false);
    if (!videoOpen) {
      milestones.current.clear();
      trackEvent("hero_video_open", { placement: "homepage_hero", creative: "hero_v7", hero_version: HERO_VERSION });
    }
    setVideoOpen(!videoOpen);
  }
  return <div ref={container} className="hero-product-demo" aria-label="Interactive MasterGrowbot app preview">
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
      </div> : active === 0 ? <div className={`hero-photo-experience${analyzing ? " is-analyzing" : ""}`}>
        {failedScreen ? <div className="hero-screen-fallback"><Camera size={32} aria-hidden="true" /><strong>Start with your plant</strong><p>Photograph the symptoms you want to understand.</p></div> : <img src={step.image} alt={step.alt} width={step.width} height={step.height} onError={() => setFailedScreen(true)} />}
        <div className="hero-camera-frame" aria-hidden="true"><span /><span /><span /><span /></div>
        <span className="hero-camera-label"><Camera size={14} aria-hidden="true" /> {analyzing ? "EXAMPLE PHOTO CAPTURED" : "YOUR PLANT → YOUR INSIGHTS"}</span>
        <div className="hero-camera-action">
          {analyzing ? <div className="hero-analysis-status" role="status"><ScanLine size={23} aria-hidden="true" /><strong>From photo to next steps</strong><p>Previewing AI insights and practical grow tips…</p><div className="hero-analysis-progress" aria-hidden="true"><span style={{ animationPlayState: phase === 1 && !playing ? "paused" : "running" }} /></div><small>Illustrative sequence · No live analysis</small></div> : <><strong>A clearer grow starts with a photo.</strong><p>Photograph what looks different. MasterGrowbot helps you understand what to check next.</p><button type="button" onClick={captureExample}><Camera size={18} aria-hidden="true" /> Take example photo <ArrowLeft className="hero-camera-arrow" size={16} aria-hidden="true" /></button><small>Interactive example · No camera access needed</small></>}
        </div>
      </div> : <div key={step.label + (showPlan ? "-plan" : "")} className="hero-demo-stage">
        <picture className="hero-lab-art" aria-hidden="true">
          <source media="(max-width: 599px)" srcSet="/images/premium/hero-grow-lab-mobile-v8.webp" />
          <img src="/images/premium/hero-grow-lab-v8.webp" alt="" width="1200" height="800" fetchPriority="high" onError={event => { event.currentTarget.style.visibility = "hidden"; }} />
        </picture>
        <div className="hero-lab-grid" aria-hidden="true" />
        <div className="hero-lab-orbit" aria-hidden="true" />
        <div className="hero-demo-phone">
          <div className="hero-demo-phone-bar"><span>MasterGrowbot AI</span><span>App preview</span></div>
          <div className="hero-demo-screen" key={step.label}>
            {active === 1 ? <HeroExampleReport plan={showPlan} /> : failedScreen ? <div className="hero-screen-fallback"><step.icon size={32} aria-hidden="true" /><strong>{step.title}</strong><p>{step.detail}</p><span>App preview unavailable</span></div> : <img src={step.image} alt={step.alt} width={step.width} height={step.height} onError={() => setFailedScreen(true)} />}
          </div>
          <div className="hero-phone-home" aria-hidden="true" />
        </div>
        <div className="hero-benefit-card hero-benefit-insight"><span className="hero-card-icon"><ScanLine size={19} aria-hidden="true" /></span><div><span>CUSTOM GROW TIPS</span><strong>{showPlan ? "Your next steps" : "Understand symptoms"}</strong><p>{showPlan ? "Check. Record. Follow up." : "Insights for your plant."}</p></div></div>
        <div className="hero-benefit-card hero-benefit-record"><span className="hero-card-icon"><NotebookPen size={19} aria-hidden="true" /></span><div><span>YOUR GROW HISTORY</span><strong>Track your grow</strong><p>Every observation, together.</p></div></div>
        <img className="hero-botanical-accent" src="/images/premium/hero-leaf-accent-v8.webp" alt="" aria-hidden="true" width="480" height="480" onError={event => { event.currentTarget.style.visibility = "hidden"; }} />
      </div>}
    </div>
    {!videoOpen && <div className="hero-story-controls"><span>{playing ? "PHOTO → AI TIPS → JOURNAL" : "YOUR PLANT. YOUR NEXT STEPS."}</span><button type="button" onClick={() => playing ? setPlaying(false) : replayStory()} aria-controls="hero-demo-panel">{playing ? <Pause size={14} aria-hidden="true" /> : <RotateCcw size={14} aria-hidden="true" />}{playing ? "Pause preview" : "Replay preview"}</button></div>}
    <div className="hero-demo-note" aria-live={playing ? "off" : "polite"} aria-atomic="true"><span><Sparkles size={14} aria-hidden="true" /> 0{active + 1} / 03 · {showPlan ? "RECOVERY PLAN" : step.label.toUpperCase()}</span><strong>{showPlan ? "A clear plan for your next check" : step.title}</strong><p>{showPlan ? "Review practical grow tips, record your checks, and follow up on what changes." : step.detail}</p></div>
    <div className="hero-demo-steps" role="group" aria-label="Explore the app workflow">{steps.map(({ label, icon: Icon }, index) => <button ref={index === 1 ? reportButton : undefined} key={label} type="button" aria-pressed={active === index && !videoOpen} aria-controls="hero-demo-panel" onClick={() => select(index)}><Icon size={17} aria-hidden="true" /><span>{label}</span></button>)}</div>
    <div className="hero-plan-controls">{active === 1 && !videoOpen && <button className="hero-plan-toggle" type="button" aria-pressed={showPlan} onClick={() => { setPlaying(false); setPhase(0); setShowPlan(!showPlan); }}>{showPlan ? "View health report" : "Explore recovery steps"}</button>}</div>
    <p className="hero-demo-disclosure">Photo sequence & report are illustrative, not live analysis or a diagnosis · Journal: supplied app screen · AI-generated grower and botanical artwork.</p>
  </div>;
}
