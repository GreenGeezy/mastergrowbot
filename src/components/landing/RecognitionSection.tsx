const recognition = ["Forbes", "Business Insider", "The Denver Post", "University of Colorado Boulder"];
export default function RecognitionSection() {
  return <section className="premium-wrap recognition-section recognition-refined" aria-labelledby="recognition-title">
    <p className="premium-eyebrow">RECOGNIZED EXPERIENCE. A GROWER-FIRST MISSION.</p>
    <h2 id="recognition-title">Built on experience.<br /><em>Focused on your grow.</em></h2>
    <p>Our founder and his ventures have earned national media coverage and university recognition. That drive to solve real problems is behind MasterGrowbot AI.</p>
    <div className="recognition-art-grid">{recognition.map((name, index) => <div key={name} className="recognition-art" role="img" aria-label={name} style={{ backgroundPosition: `${index * 100 / 3}% center` }} />)}</div>
    <p className="premium-fine">Recognition of our founder and his ventures, including work before MasterGrowbot AI. Logos do not imply app endorsement.</p>
  </section>;
}
