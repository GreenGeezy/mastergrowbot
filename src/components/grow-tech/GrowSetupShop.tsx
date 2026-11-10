import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Check, Lightbulb, Mail, Truck } from "lucide-react";
import { alphaGrowKits, alphaGrowTents, canPurchaseGrowTech, planIds, type AlphaGrowVariant } from "@/data/growTechProducts";
import { trackEvent, trackGrowTechSelectItem } from "@/lib/analytics";

function VariantCard({ variants, kicker, title, pitch, ribbon, featured = false }: {
  variants: AlphaGrowVariant[]; kicker: string; title: string; pitch: string; ribbon?: string; featured?: boolean;
}) {
  // Default to the smallest size that can be bought; fall back to the first size while all are launching.
  const firstLive = variants.findIndex(v => canPurchaseGrowTech(v));
  const [index, setIndex] = useState(firstLive >= 0 ? firstLive : 0);
  const v = variants[index];
  const live = canPurchaseGrowTech(v);
  const family = v.family;
  return <article className={`gs-card${featured ? " is-featured" : ""}`} id={family === "kit" ? "grow-tent-kit" : "grow-tent"} aria-labelledby={`gs-${family}-title`}>
    {ribbon && <p className="gs-ribbon">{ribbon}</p>}
    <div className="gs-media">
      <picture key={v.anchorId}>
        <source media="(max-width:767px)" srcSet={v.mobileImage} />
        <img src={v.image} width={v.imageWidth} height={v.imageHeight} loading="lazy" alt={v.alt} />
      </picture>
      <span className="gs-size-chip">{v.sizeLabel}</span>
    </div>
    <div className="gs-body">
      <p className="gs-kicker">{kicker}</p>
      <h3 id={`gs-${family}-title`}>{title}</h3>
      <p className="gs-pitch">{pitch}</p>
      <div className="gs-sizes" role="radiogroup" aria-label={`Choose a ${family === "kit" ? "kit" : "tent"} size`}>
        {variants.map((option, i) => <button key={option.anchorId} type="button" role="radio" aria-checked={i === index}
          onClick={() => { setIndex(i); trackEvent("growtech_variant_select", { product_id: option.productId, family, size: option.sizeLabel, value: option.numericPrice, currency: "USD" }); }}>
          <strong>{option.sizeLabel}</strong><span>{option.price}</span>
        </button>)}
      </div>
      <p className="gs-dims">{v.dimensions} · {v.bestFor[1]}</p>
      <div className="gs-price"><strong>{v.price}</strong><span>USD · one-time<b>US shipping included</b></span></div>
      <ul className="gs-contents">{v.contents.map(item => <li key={item}>{item.startsWith("Complete Playbook") ? <BookOpen size={16} aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}{item}</li>)}</ul>
      <p className="gs-light"><Lightbulb size={15} aria-hidden="true" />{v.lightNote}</p>
      {live
        ? <Link className="gs-cta" to={`/grow-tech/checkout/${v.anchorId}`} onClick={() => trackGrowTechSelectItem(v, `growtech:setup-shop:${v.anchorId}`, planIds[v.planKey])}>{v.buttonLabel} <ArrowRight size={18} aria-hidden="true" /></Link>
        : <a className="gs-cta is-soon" href={`mailto:support@mastergrowbot.com?subject=${encodeURIComponent(`Notify me: ${v.name}`)}`} onClick={() => trackEvent("growtech_variant_notify", { product_id: v.productId, size: v.sizeLabel })}><Mail size={17} aria-hidden="true" /> Launching soon. Get notified</a>}
      <p className="gs-fine"><Truck size={14} aria-hidden="true" />{live ? "Ships to US addresses in about two weeks · 30-day returns" : "Checkout opens once stock and delivery are confirmed. No payment taken."}</p>
    </div>
  </article>;
}

export default function GrowSetupShop() {
  return <section className="gs-section" id="starter-setups" aria-labelledby="gs-title">
    <div className="gt-container">
      <div className="gs-head">
        <p className="gt-kicker">NEW · ALPHAGROW TENTS &amp; KITS</p>
        <h2 id="gs-title">Starting from zero?<br /><em>Get the whole grow space.</em></h2>
        <p>Pick your footprint. A 2×2 fits a closet and one to two plants. A 4×4 gives you room for four to six. Every order ships free in the US and includes the complete MasterGrowbot Playbook, so your first grow starts with a plan.</p>
      </div>
      <div className="gs-grid">
        <VariantCard variants={alphaGrowKits} featured ribbon="Everything but the plants" kicker="COMPLETE GROW TENT KIT" title="The grow tent kit"
          pitch="Tent, LED grow light, inline fan and carbon filter in one box. Unpack it, set it up in an afternoon and start your first grow." />
        <VariantCard variants={alphaGrowTents} kicker="GROW TENT" title="The grow tent"
          pitch="Already have a light or fan? Start with a light-tight, reflective tent and build around it." />
      </div>
      <p className="gs-compare">Not sure which? Start with the <a href="#grow-tent-kit">2×2 kit</a> for your first grow. Already own a light? Grab the <a href="#grow-tent">tent</a> and add the <a href="#grow-light">AG1000</a>.</p>
    </div>
  </section>;
}
