import { useState } from "react";
import { Pause, Play } from "lucide-react";
const recognition = ["Forbes", "Business Insider", "The Denver Post", "University of Colorado Boulder"];
export default function RecognitionSection() {
  const [paused, setPaused] = useState(false);
  return <section className={`premium-wrap recognition-section recognition-refined${paused ? " motion-paused" : ""}`} aria-labelledby="recognition-title">
    <p className="premium-eyebrow">RECOGNIZED EXPERIENCE. A GROWER-FIRST MISSION.</p>
    <h2 id="recognition-title">Built on experience.<br /><em>Focused on your grow.</em></h2>
    <p>Our founder and his ventures have earned national media coverage and university recognition. That drive to solve real problems is behind MasterGrowbot AI.</p>
    <div className="recognition-orbit"><div className="recognition-track">{[0,1].map(copy => <div className="recognition-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{recognition.map((name, index) => <div key={name} className="recognition-art" role="img" aria-label={name} style={{ backgroundPosition: `${index * 100 / 3}% center` }} />)}</div>)}</div></div>
    <button className="recognition-motion-toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}{paused ? "Play logo animation" : "Pause logo animation"}</button>
    <p className="premium-fine">Recognition of our founder and his ventures, including work before MasterGrowbot AI. Logos do not imply app endorsement.</p>
  </section>;
}
