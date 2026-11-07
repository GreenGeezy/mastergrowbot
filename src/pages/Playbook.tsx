import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import PremiumMotion from '@/components/landing/PremiumMotion';
import { PLAYBOOK_FILES_URL } from '@/data/playbook';
import { QUICKSTART_FILES_URL } from '@/data/growTechProducts';
import '@/components/landing/premium.css';
import '@/components/landing/premium-release.css';
export default function Playbook() {
 return <div className="premium-site min-h-screen"><SEOHead title="Free Equipment Quickstart & Grow Records | MasterGrowbot" description="Download a free equipment quickstart, printable observation sheet and CSV log. Existing Playbook buyers retain their Whop access." canonicalUrl="https://www.mastergrowbot.com/playbooks"/><LandingNav/>
 <main className="premium-wrap premium-section"><div className="release-editorial"><div><p className="premium-eyebrow">MASTERGROWBOT FIELD NOTES</p><h1 style={{fontSize:'clamp(40px,6vw,72px)',lineHeight:1.05}}>A clearer record.<br/>A better question.</h1><p>Start using your phone, equipment readings and AI more deliberately. This free quickstart helps you capture useful evidence before asking for advice.</p><a className="premium-button" href="/downloads/grow-tech/equipment-quickstart-free.pdf">Download the free quickstart</a><p className="premium-fine">4 pages · PDF · No purchase required</p></div><img src="/images/premium-2026/guide-editorial.webp" alt="Illustrative grower reviewing a field manual" width={1536} height={1024}/></div>
 <div className="release-fit"><article><h3>Photograph clearly</h3><p>Capture an overview and useful detail. Keep the original and record which plant you photographed.</p></article><article><h3>Keep the context</h3><p>Save readings with units, device, placement and time. Missing information stays unknown.</p></article><article><h3>Review the answer</h3><p>Separate AI suggestions from verified facts. Record what you will check next.</p></article></div>
 <PremiumMotion name="guide-story" label="Actual free quickstart pages and observation worksheet" poster="/images/premium-2026/quickstart-preview.webp"/>
 <p><a className="premium-text-link" href="/downloads/grow-tech/observation-log.csv" download>Download the editable CSV observation log →</a></p>
 <section className="premium-section"><h2>Already purchased a guide?</h2><p>Your existing files remain available through Whop. Sign in with the email used for your purchase.</p><div className="premium-actions"><a className="premium-button secondary" href={PLAYBOOK_FILES_URL}>Open purchased Playbook files</a><a className="premium-button secondary" href={QUICKSTART_FILES_URL}>Open purchased Quickstart files</a></div><p className="premium-fine">New paid guide purchases are paused while the next edition is reviewed. Existing customer access is unchanged.</p></section>
 <Link className="premium-text-link" to="/#grow-walkthrough">Explore photo insights and journal records in the app →</Link></main><LandingFooter/></div>;
}
