import { ArrowRight, Video } from "lucide-react";
import { appStoreUrl } from "./ctaLinks";

export default function VideoAnalysisSection() {
  return (
    <section id="video-analysis" className="premium-wrap premium-section video-analysis" aria-labelledby="video-analysis-title">
      <figure className="video-analysis-visual">
        <img src="/images/premium/video-analysis-grow.webp" width="1440" height="810" loading="lazy" alt="Illustrative grower recording a plant with a smartphone inside a grow tent" />
        <div className="video-analysis-label"><Video size={20} aria-hidden="true" /> MORE ANGLES. MORE CONTEXT.</div>
        <figcaption>AI-generated illustration of recording a plant; not an app screen.</figcaption>
      </figure>
      <div>
        <p className="premium-eyebrow">AI VIDEO ANALYSIS · PREMIUM ON iPHONE</p>
        <h2 id="video-analysis-title">One photo tells a story.<br /><em>Video shows more.</em></h2>
        <p className="premium-lead">Give your AI a fuller view of your plant. Record or upload a short video with Premium to bring more angles and visual context into your analysis.</p>
        <ol className="video-analysis-steps">
          <li><span>01</span><div><strong>Show more of your plant.</strong><p>Capture leaves, stems, and the surrounding grow in one short clip.</p></div></li>
          <li><span>02</span><div><strong>Get AI insights with more context.</strong><p>Review observations to guide what you check next.</p></div></li>
          <li><span>03</span><div><strong>Make your next move informed.</strong><p>Use those insights alongside your own observations and grow history.</p></div></li>
        </ol>
        <a className="premium-button" href={appStoreUrl("video-analysis")} data-cta-location="video-analysis:ios">Explore Premium on iPhone <ArrowRight size={18} aria-hidden="true" /></a>
        <p className="premium-fine">Video analysis requires Premium on iOS. Premium has no introductory free trial. AI insights can be imperfect.</p>
        <a className="premium-text-link" href="#app-plans">Start with photo analysis? Compare Pro plans <ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}
