import { Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import IPMPlaybookSection from '@/components/landing/IPMPlaybookSection';
import { trackEvent } from '@/lib/analytics';
export default function ShopDigitalOffers() {
 return <section className="gt-container gt-section" id="digital-guides" aria-labelledby="shop-digital-title"><div className="release-editorial"><img src="/images/premium-2026/guide-editorial.webp" width={1536} height={1024} loading="lazy" alt="Cannabis home grower documenting plant observations with a field manual"/><div><p className="gt-kicker">FREE FIELD NOTES</p><h2 id="shop-digital-title">Better observations.<br/>Start with what you own.</h2><p>Four practical pages: your first observation, useful plant photos, temperature and humidity records, and a printable worksheet. No purchase or AI account required.</p><a className="gt-button" href="/downloads/grow-tech/equipment-quickstart-free.pdf" onClick={()=>trackEvent('free_quickstart_download',{cta_location:'growtech:free-guide'})}><Download size={18}/> Download the free quickstart</a><p className="gt-small">Illustrative grower scene. Preview the actual pages before printing.</p><Link to="/playbooks" className="gt-text-link">Resources and existing buyer access →</Link></div></div><IPMPlaybookSection location="growtech:amazon-book" shopOffer/></section>;
}
