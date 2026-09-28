import ExampleHealthReport from "./ExampleHealthReport";
import { useState } from "react";
import { ArrowRight, Camera, FileText, NotebookPen, Sparkles } from "lucide-react";
import { AppActions } from "./HeroSection";
import { trackEvent } from "@/lib/analytics";

const steps = [
  { label: "Take a photo", icon: Camera, eyebrow: "01 / NOTICE SOMETHING DIFFERENT", title: "Your plant has your attention. Now what?", text: "A leaf looks different during your daily check. Open MasterGrowbot and capture what you see, so you have a starting point for a closer review.", value: "Start with your own plant, right where you are.", image: "walkthrough-capture", alt: "Illustrative home grower photographing a plant inside a grow tent", caption: "AI-generated grower scenario", next: "See the report" },
  { label: "Review the report", icon: FileText, eyebrow: "02 / INSIDE A REAL APP REPORT", title: "See the analysis. Understand your next step.", text: "Explore an actual MasterGrowbot AI health report, from its finding and priority action to personalized tips, prevention notes, the plant photo and journal actions. Tap the report tabs to see the full flow.", value: "A report you can read, revisit and save.", image: "app-2", alt: "MasterGrowbot plant health report preview", caption: "MasterGrowbot AI app report", next: "Keep a grow record" },
  { label: "Keep a record", icon: NotebookPen, eyebrow: "03 / BUILD YOUR GROW HISTORY", title: "Remember what you saw. Compare what changes.", text: "Save photos and observations in your grow journal. Return to your records at your next check instead of relying on memory or scattered camera-roll photos.", value: "Make every observation useful beyond today.", image: "walkthrough-record", alt: "Illustrative grower reviewing plant photos and keeping observations beside a grow tent", caption: "AI-generated record-keeping scenario · Not an app screen", next: "Replay the walkthrough" },
];
export default function GrowWalkthrough() {
  const [active, setActive] = useState(0);
  const step = steps[active];
  function select(index: number) { setActive(index); trackEvent("app_walkthrough_step", {step: steps[index].label}); }
  return <section id="grow-walkthrough" className="premium-wrap premium-section grow-walkthrough" aria-labelledby="walkthrough-title">
    <div className="premium-section-heading"><div><p className="premium-eyebrow">A MOMENT IN YOUR GROW</p><h2 id="walkthrough-title">From “what’s this?”<br/><em>to a clearer next step.</em></h2></div><p>See how the app turns a plant photo into a health report you can save and revisit. Explore the walkthrough.</p></div>
    <div className="walkthrough-nav" role="group" aria-label="Explore the photo to grow record walkthrough">{steps.map(({label,icon:Icon},i)=><button key={label} type="button" aria-pressed={active===i} aria-controls="walkthrough-panel" onClick={()=>select(i)}><span>0{i+1}</span><Icon size={19}/>{label}</button>)}</div>
    <div id="walkthrough-panel" className={`walkthrough-panel ${active===1?'is-report':''}`}>
      {active===1 ? <ExampleHealthReport/> : <figure className="walkthrough-visual"><img src={`/images/premium/${step.image}.webp`} alt={step.alt} width={1536} height={1024} loading="lazy"/><figcaption>{step.caption}</figcaption></figure>}
      <div className="walkthrough-copy"><div aria-live="polite"><p className="premium-eyebrow">{step.eyebrow}</p><h3>{step.title}</h3><p>{step.text}</p><div className="walkthrough-value"><Sparkles size={20}/><strong>{step.value}</strong></div></div><button type="button" className="premium-button secondary" onClick={()=>select((active+1)%3)}>{step.next}<ArrowRight size={18}/></button><p className="premium-fine">{active === 1 ? "Shown from the MasterGrowbot AI app. Each plant health report reflects the input provided; AI insights support grower judgment." : "The grower photo is illustrative. Your app report reflects your own plant and inputs."}</p></div>
    </div>
    <div className="walkthrough-download"><div><h3>Bring a second set of eyes to your next plant check.</h3><p>Photo analysis, strain intelligence, and grow records with Pro.</p></div><div><AppActions location="walkthrough"/><p className="premium-fine">Pro trial eligibility and subscription terms appear in your store.</p></div></div>

  </section>;
}
