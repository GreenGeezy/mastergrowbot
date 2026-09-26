import { useState } from "react";
import { Check, FileText, NotebookPen, Eye } from "lucide-react";
export default function ExampleHealthReport() {
  const [saved, setSaved] = useState(false);
  return <div className="example-report" aria-label="Hypothetical plant observation report">
    <header><span className="report-mark"><FileText size={22}/></span><div><p>MASTERGROWBOT / WALKTHROUGH</p><h3>Plant observation report</h3></div></header>
    <p className="report-example-label">Hypothetical example · Website demo, not an app screen</p>
    <div className="report-summary"><span>PHOTO REVIEW</span><h4>A color change worth documenting.</h4><p>Some visible leaves appear purple alongside green foliage. A photograph alone cannot establish the cause or the plant’s overall health.</p></div>
    <section><h4><Eye size={18}/>What the image shows</h4><ul><li>Color variation across visible foliage.</li><li>Only one angle and one moment in time.</li><li>No comparison image supplied.</li></ul></section>
    <details open><summary>What remains unknown</summary><p>Image lighting can influence color. This example does not establish a diagnosis, severity score, recovery timeline, or expected yield.</p></details>
    <section className="report-record"><h4><NotebookPen size={18}/>Make the observation useful later</h4><dl><div><dt>Record</dt><dd>Original photo + date + plant name</dd></div><div><dt>Your note</dt><dd>“Noticed a color difference today.”</dd></div><div><dt>Compare</dt><dd>Keep the next observation beside this one.</dd></div></dl></section>
    <button type="button" className="report-save" onClick={()=>setSaved(!saved)}>{saved?<Check size={18}/>:<NotebookPen size={18}/>} {saved?'Example added to demo record':'Try saving this example'}</button><p className="report-save-note" role="status">{saved?'Demo only. Nothing is saved to your app or account.':'Interactive preview · No account or upload needed'}</p>
  </div>;
}
