import { ListChecks, NotebookPen, ScanLine, Sprout } from "lucide-react";
import { AppActions } from "./HeroSection";

const benefits = [
  { icon: ScanLine, title: "Spot trouble from one photo", text: "Yellowing, spots, curling or pests? Snap a photo and get an AI read on what to check first." },
  { icon: ListChecks, title: "Know your next move", text: "Practical checks for watering, feeding and environment, so you fix the cause instead of guessing." },
  { icon: NotebookPen, title: "Every grow on the record", text: "Photos, reports and notes in one journal. Look back, compare, and dial in your next run." },
  { icon: Sprout, title: "Built around your strain", text: "Strain insights and daily tasks shaped around the genetics you are running." },
];

export default function GrowerBenefits() {
  return <section className="premium-wrap mg-benefits" aria-labelledby="mg-benefits-title">
    <div className="mg-benefits-head">
      <p className="premium-eyebrow">WHY GROWERS KEEP IT IN THEIR POCKET</p>
      <h2 id="mg-benefits-title">Catch problems early.<br /><em>Harvest with confidence.</em></h2>
    </div>
    <div className="mg-benefits-grid">
      {benefits.map(({ icon: Icon, title, text }, i) => <article key={title}>
        <span className="mg-benefit-icon" aria-hidden="true"><Icon size={22} /></span>
        <span className="mg-benefit-num" aria-hidden="true">0{i + 1}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </article>)}
    </div>
    <div className="mg-benefits-cta"><AppActions location="homepage_benefits" trial /><p>Free download. 3-day Pro trial for eligible new subscribers.</p></div>
  </section>;
}
