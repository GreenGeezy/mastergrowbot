import { ArrowRight, Video } from "lucide-react";
import { appStoreUrl } from "./ctaLinks";

export default function VideoAnalysisSection() {
  return (
    <section id="video-analysis" className="premium-wrap premium-section video-analysis" aria-labelledby="video-analysis-title">
      <figure className="video-analysis-visual">
        <img src="/images/premium/video-analysis-future.webp" width="1120" height="1400" loading="lazy" alt="Conceptual cannabis plant and smartphone with luminous AI scanning arcs" />
        <div className="video-analysis-label"><Video size={20} aria-hidden="true" /> MORE ANGLES. MORE CONTEXT.</div>
        <figcaption>Conceptual AI artwork. Not an app interface or analysis result.</figcaption>
      </figure>
      <div>
        <p className="premium-eyebrow">AI VIDEO ANALYSIS · PREMIUM ON iPHONE</p>
        <h2 id="video-analysis-title">Your grow deserves<br /><em>the bigger picture.</em></h2>
        <p className="premium-lead">One leaf is only part of the story. Show leaves, stems, and your setup in a short video. Premium helps you turn that wider view into observations you can use at your next plant check.</p>
        <ol className="video-analysis-steps">
          <li><span>01</span><div><strong>Show more of your plant.</strong><p>Capture leaves, stems, and the surrounding grow in one short clip.</p></div></li>
          <li><span>02</span><div><strong>Get AI insights with more context.</strong><p>Review observations to guide what you check next.</p></div></li>
          <li><span>03</span><div><strong>Grow your understanding.</strong><p>Use those insights alongside your own observations and grow history.</p></div></li>
        </ol>
        <a className="premium-button" href={appStoreUrl("video-analysis")} data-cta-location="video-analysis:ios">Explore Premium on iPhone <ArrowRight size={18} aria-hidden="true" /></a>
        <p className="premium-fine">Video analysis requires Premium on iOS. Premium has no introductory free trial. AI insights can be imperfect.</p>
        <a className="premium-text-link" href="#app-plans">Start with photo analysis? Compare Pro plans <ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}
