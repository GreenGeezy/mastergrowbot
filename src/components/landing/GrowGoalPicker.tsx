import { useState } from "react";
import { Camera, Sprout, Layers3, Check, ArrowRight } from "lucide-react";
import { AppActions } from "./HeroSection";
import { trackEvent } from "@/lib/analytics";

const goals = [
  { label: "Something looks wrong", icon: Camera, tag: "PHOTO ANALYSIS · PRO", title: "Turn a plant concern into a clearer next step.", text: "Start with a photo of what you see. Review an AI plant health report, then keep the photo and your observations together as you follow up.", steps: ["Photograph the visible issue", "Review the report and suggested next steps", "Save a record to compare later"], image: 2 },
  { label: "I'm learning to grow", icon: Sprout, tag: "PERSONALIZED GUIDANCE · PRO", title: "Build a routine around your own garden.", text: "Get guidance matched to your experience and setup. Explore strain information, organize your plants, and keep daily tasks and grow notes in one place.", steps: ["Tell the app about your setup", "Add your plants and genetics", "Use tasks and journal notes to stay organized"], image: 4 },
  { label: "I'm dialing in my setup", icon: Layers3, tag: "DEEPER VISUAL CONTEXT · PREMIUM ON IOS", title: "Give your plant review a wider view.", text: "Premium adds short plant video analysis to Pro's photo and journal tools. Bring more visual context into your review and keep a shareable report of what you observed.", steps: ["Record or upload a short plant video", "Review the AI plant health report", "Compare observations with your grow records"], image: 5 },
];
export default function GrowGoalPicker() {
  const [active, setActive] = useState(0);
  const goal = goals[active];
  return <section className="premium-wrap conversion-lab" aria-labelledby="grow-goal-title">
    <div className="lab-heading"><div><p className="premium-eyebrow"><span className="status-dot" /> YOUR GROW, YOUR NEXT MOVE</p><h2 id="grow-goal-title">What brought you here?</h2></div><p>Choose your goal. See how the app fits.</p></div>
    <div className="goal-controls" role="group" aria-label="Choose your grow goal">{goals.map(({label, icon: Icon}, index) => <button key={label} type="button" aria-pressed={active === index} onClick={() => {setActive(index); trackEvent("app_goal_select", {goal:label});}}><Icon size={19} />{label}<ArrowRight size={16} /></button>)}</div>
    <div className="goal-result"><div className="goal-copy" aria-live="polite"><p className="premium-eyebrow">{goal.tag}</p><h3>{goal.title}</h3><p>{goal.text}</p><ul>{goal.steps.map(step => <li key={step}><Check size={16} />{step}</li>)}</ul><AppActions location={`goal-${active}`} /><p className="premium-fine">Start with your phone. No GrowTech purchase required. Pro trial eligibility and plan terms are shown in your store.</p></div><figure className="goal-preview"><div className="scan-frame"><img src={`/images/premium/app-${goal.image}.webp`} alt="MasterGrowbot app preview" width="700" height="1516" loading="lazy" /></div><figcaption>Explore the app · Preview screen</figcaption></figure></div>
  </section>;
}
