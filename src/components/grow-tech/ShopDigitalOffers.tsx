import { ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { trackEvent, trackGrowTechSelectItem } from "@/lib/analytics";
import { playbookEcommercePayload, PLAYBOOK_REGULAR_PRICE } from "@/data/playbook";
import { quickstartGuide } from "@/data/growTechProducts";

export default function ShopDigitalOffers() {
  return <section className="lens-wrap lens-section shop-digital" id="digital-guides" aria-labelledby="shop-digital-title">
    <p className="lens-eyebrow">DIGITAL GUIDES · USE THE TOOLS YOU ALREADY HAVE</p>
    <h2 id="shop-digital-title">Start with clearer records. No hardware required.</h2>
    <div className="shop-digital-grid">
      <article className="lens-panel"><img src="/images/playbook/observation-cover-v3.webp" alt="AI Plant Observation Playbook cover" width={612} height={792} loading="lazy" /><div><p className="lens-eyebrow">COMPLETE DIGITAL KIT</p><h3>AI Plant Observation Playbook</h3><p>32-page Playbook, 8 copy-ready prompts, 8-page fillable workbook, the complete Equipment Quickstart, two worksheets and a CSV log.</p><p className="lens-price"><strong>$29</strong><span>USD · Pay once · Six files</span></p><Link className="lens-button" to="/playbooks/checkout" onClick={() => trackEvent("select_item", { ...playbookEcommercePayload(PLAYBOOK_REGULAR_PRICE, "shop:digital-kit"), item_list_id: "growtech-shop", checkout_source_page: "/grow-tech" })}>Get the complete kit <ArrowRight size={18} /></Link><Link className="lens-secondary" to="/playbooks">See contents and sample pages →</Link></div></article>
      <article className="lens-panel"><img src="/images/playbook/quickstart-cover-v4.webp" alt="Equipment Quickstart cover" width={612} height={792} loading="lazy" /><div><p className="lens-eyebrow">EQUIPMENT ESSENTIALS</p><h3>Equipment Quickstart</h3><p>12-page equipment handling and recordkeeping guide, two worksheets and a CSV log. No AI account needed.</p><p className="lens-price"><strong>$19</strong><span>USD · Pay once</span></p><Link className="lens-button lens-outline" to="/grow-tech/checkout/quickstart-guide" onClick={() => trackGrowTechSelectItem(quickstartGuide, "shop:quickstart")}>Get the Quickstart <ArrowRight size={18} /></Link><a className="lens-secondary" href="/downloads/grow-tech/quickstart-sample.pdf" target="_blank" rel="noopener noreferrer"><Download size={16} /> Preview the sample</a><p className="lens-small">Already included in the $29 kit and hardware packages.</p></div></article>
    </div><p className="lens-small">Files through Whop after confirmed payment. Guides cover observation and recordkeeping. Hardware, AI account fees and app subscriptions are separate.</p>
  </section>;
}
