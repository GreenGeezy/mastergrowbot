import { Activity, Droplets, FlaskConical, NotebookPen, TriangleAlert, Waves, Zap } from "lucide-react";

/** Editorial example for soil-grown plants, not a generated app diagnosis. */
export default function HeroExampleReport({ plan = false }: { plan?: boolean }) {
  if (plan) return <div className="hero-example-report hero-recovery-plan">
    <p className="hero-report-label"><Activity size={14} aria-hidden="true" /> RECOVERY PLAN <span>EXAMPLE</span></p>
    <p className="hero-report-attention"><TriangleAlert size={11} aria-hidden="true" /> YELLOW LOWER LEAVES</p>
    <h3>Your next checks</h3>
    <p className="hero-report-context">SOIL GROW · PRACTICAL NEXT STEPS</p>
    <div className="hero-report-first-check"><span><Zap size={12} aria-hidden="true" /> START HERE</span><strong>Check before changing.</strong><p>Use these checks to guide your next move.</p></div>
    <ol className="hero-recovery-checks"><li><b>1</b><div><strong>Check the soil.</strong><p>If still wet, pause watering and empty the saucer.</p></div></li><li><b>2</b><div><strong>Review your feed label.</strong><p>Check directions before adding more nutrients.</p></div></li><li><b>3</b><div><strong>Record and follow up.</strong><p>Log a photo. Check for new yellowing.</p></div></li></ol>
  </div>;
  return <div className="hero-example-report">
    <p className="hero-report-label"><Activity size={14} aria-hidden="true" /> HEALTH REPORT <span>EXAMPLE</span></p>
    <p className="hero-report-attention"><TriangleAlert size={11} aria-hidden="true" /> SYMPTOM TO CHECK</p>
    <h3>Yellow lower leaves</h3>
    <p className="hero-report-context">SOIL GROW · START WITH WATERING</p>
    <div className="hero-report-first-check">
      <span><Zap size={12} aria-hidden="true" /> YOUR FIRST CHECK</span>
      <strong>Is the soil still wet?</strong>
      <p>If yes, pause watering. Empty standing water from the saucer.</p>
    </div>
    <dl className="hero-report-tiles">
      <div><Droplets size={13} aria-hidden="true" /><dt>WATERING</dt><dd>Pause if wet</dd></div>
      <div><Waves size={13} aria-hidden="true" /><dt>DRAINAGE</dt><dd>Let water drain</dd></div>
      <div><FlaskConical size={13} aria-hidden="true" /><dt>FEEDING</dt><dd>Check label</dd></div>
      <div><NotebookPen size={13} aria-hidden="true" /><dt>JOURNAL</dt><dd>Log changes</dd></div>
    </dl>
  </div>;
}
