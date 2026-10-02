import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Check, Download } from "lucide-react";
import { planIds, quickstartGuide, scoutGuideBundle, type GrowTechProduct } from "@/data/growTechProducts";
import { trackEvent, trackGrowTechBeginCheckout, trackGrowTechSelectItem } from "@/lib/analytics";

function OfferLink({ product }: { product: GrowTechProduct }) {
  return <Link to={`/grow-tech/checkout/${product.anchorId}`} onClick={() => {
    const location = `growtech_quickstart:${product.anchorId}`;
    trackGrowTechSelectItem(product, location, planIds[product.planKey]);
    trackGrowTechBeginCheckout(product, location, planIds[product.planKey]);
  }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-5 py-3 font-bold text-emerald-950 transition hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-white">
    {product.buttonLabel}<ArrowRight size={18} aria-hidden="true" />
  </Link>;
}

export default function QuickstartOffers() {
  return <section className="relative z-10 px-4 py-16 sm:px-6" aria-labelledby="quickstart-title">
    <div className="mx-auto max-w-7xl">
      <p className="premium-eyebrow">MAKE YOUR TOOLS EASIER TO USE</p>
      <h2 id="quickstart-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Clearer photos. More useful records.</h2>
      <p className="mt-4 max-w-2xl leading-7 text-white/70">A practical equipment workflow, from your first close-up photo to a record you can compare later. Use the tools you already own.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article id="quickstart-guide" className="scroll-mt-24 overflow-hidden rounded-2xl border border-emerald-300/25 bg-white/[0.035]">
          <div className="grid sm:grid-cols-[180px_1fr]">
            <div className="relative min-h-52 bg-emerald-950">
              <img src={quickstartGuide.image} alt={quickstartGuide.alt} width={853} height={1280} loading="lazy" className="h-full max-h-80 w-full object-cover sm:absolute sm:max-h-none" />
              <p className="absolute inset-x-4 top-5 text-xl font-bold leading-tight">GrowTech<br />Equipment<br />Quickstart</p>
            </div>
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Digital download · $19 once</p>
              <h3 className="mt-3 text-2xl font-bold">Equipment Quickstart Guide</h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-white/75">
                {['Nine-page PDF: handling, photos, reading limitations and troubleshooting', 'Two printable observation worksheets', 'CSV log for your own records'].map(text => <li key={text} className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-emerald-300" aria-hidden="true" />{text}</li>)}
              </ul>
              <div className="mt-6"><OfferLink product={quickstartGuide} /></div>
              <a href="/downloads/grow-tech/quickstart-sample.pdf" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('growtech_guide_sample_open', { cta_location: 'quickstart_offer' })} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-300 underline underline-offset-4"><BookOpen size={16} />Read the free two-page sample</a>
              <p className="mt-3 text-xs leading-5 text-white/55">Access through your Whop purchase account. No hardware, app subscription or automatic syncing included.</p>
            </div>
          </div>
        </article>
        <article id="scout-guide-bundle" className="scroll-mt-24 rounded-2xl border border-white/15 bg-white/[0.035] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Camera + guide · $159 once</p>
          <h3 className="mt-3 text-2xl font-bold">A phone lens. A clear starting point.</h3>
          <p className="mt-4 leading-7 text-white/75">Get the Scout Camera 10–20X phone lens with the equipment guide, worksheets and log. Save $9 versus the $149 camera and $19 guide purchased separately.</p>
          <ul className="mt-5 space-y-2 text-sm leading-6 text-white/75">
            <li>Camera ships free to the US and Canada; tracking follows dispatch.</li>
            <li>Guide access is available through Whop after purchase.</li>
            <li>Check phone and case compatibility before ordering.</li>
          </ul>
          <div className="mt-7"><OfferLink product={scoutGuideBundle} /></div>
          <p className="mt-4 text-xs leading-5 text-white/55">One-time payment. App subscription sold separately. Full three-tool kit remains $247.</p>
        </article>
      </div>
      <div className="mt-8 rounded-xl border border-white/10 p-5">
        <h3 className="font-semibold">Basic setup help is included with your hardware</h3>
        <p className="mt-2 text-sm leading-6 text-white/65">Download the essentials now. Use the manufacturer manual included with your device for its exact operating and calibration instructions.</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {['scout-camera', 'environment-monitor', 'soil-health-meter'].map((slug, index) => <a key={slug} href={`/downloads/grow-tech/${slug}-setup.pdf`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-emerald-300 underline underline-offset-4"><Download size={15} />{['Camera setup', 'Monitor setup', 'Soil meter setup'][index]}</a>)}
        </div>
      </div>
    </div>
  </section>;
}
