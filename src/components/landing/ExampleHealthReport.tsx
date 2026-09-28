import { useState } from "react";
import { ArrowDown, Check, ClipboardList, Image as ImageIcon, ScanLine } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const views = [
  {
    label: "Health report", icon: ScanLine,
    image: "/images/premium/real-report-overview.webp",
    alt: "MasterGrowbot AI health report showing a healthy late-stage maturation finding, low severity, 80% confidence, priority action, health score, timing, nutrients and environment cards",
    title: "See the finding and what matters first.",
    detail: "The report puts its finding, confidence and priority action above the supporting health, timing, nutrient and environment cards.",
  },
  {
    label: "Grow plan", icon: ClipboardList,
    image: "/images/premium/real-report-plan.webp",
    alt: "MasterGrowbot AI personalized grow and recovery tips shown as a checklist followed by a prevention and risks card",
    title: "Go deeper than a single score.",
    detail: "Scroll into the personalized checklist and prevention section to see the next steps the app presented for this plant.",
  },
  {
    label: "Photo & journal", icon: ImageIcon,
    image: "/images/premium/real-report-journal.webp",
    alt: "Plant photo within the MasterGrowbot AI health report above Save to Journal and Share Analysis actions",
    title: "Keep the photo with the report.",
    detail: "The report ends with the plant image and actions to save the analysis to your journal or share it for a second look.",
  },
];

export default function ExampleHealthReport() {
  const [active, setActive] = useState(0);
  const view = views[active];
  return (
    <div className="real-report" aria-label="MasterGrowbot AI plant health report walkthrough">
      <div className="real-report-header">
        <div className="real-report-header-title"><span className="real-report-pulse" aria-hidden="true" /><span>INSIDE THE APP <b>·</b> PLANT HEALTH REPORT</span></div>
        <p>One plant check. A finding, a plan and a record.</p>
      </div>
      <div className="real-report-tabs" role="group" aria-label="Explore report sections">
        {views.map(({ label, icon: Icon }, index) => (
          <button key={label} type="button" aria-pressed={active === index} aria-controls="real-report-view" onClick={() => { setActive(index); trackEvent("app_report_section_select", { section: label }); }}>
            <Icon size={16} aria-hidden="true" /><span>{label}</span>
          </button>
        ))}
      </div>
      <div id="real-report-view" className="real-report-view">
        <div className="real-report-phone" aria-label={view.alt}>
          <div className="real-report-screen" key={view.image} tabIndex={0} aria-label={`Scroll the ${view.label.toLowerCase()} screenshot`}>
            <img src={view.image} alt={view.alt} width={945} height={2048} loading="lazy" />
          </div>
        </div>
        <div className="real-report-caption" aria-live="polite">
          <div className="real-report-caption-index"><Check size={15} aria-hidden="true" /> 0{active + 1} / 03</div>
          <h3>{view.title}</h3>
          <p>{view.detail}</p>
          <span className="real-report-scroll"><ArrowDown size={15} aria-hidden="true" /> Scroll inside the report to explore</span>
        </div>
      </div>
    </div>
  );
}
