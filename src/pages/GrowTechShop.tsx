import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Check, Leaf, ShieldCheck, Truck } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import LensGallery from '@/components/grow-tech/LensGallery';
import LensTestimonials from '@/components/grow-tech/LensTestimonials';
import CheckoutAssurances from '@/components/grow-tech/CheckoutAssurances';
import ShopDigitalOffers from '@/components/grow-tech/ShopDigitalOffers';
import { canPurchaseGrowTech, soilGuideOffer, scoutGuideBundle, growTentOffer, planIds, type GrowTechProduct } from '@/data/growTechProducts';
import { captureGrowTechAttribution } from '@/lib/growTechAttribution';
import { trackEvent, trackGrowTechSelectItem } from '@/lib/analytics';
import '@/components/landing/premium.css';
import '@/components/grow-tech/lens-launch.css';
import '@/components/grow-tech/growtech-shop.css';

const offers = [
  { product: soilGuideOffer, title: 'Soil meter + Quickstart', label: 'THE $59 STARTING POINT', kind: 'soil' as const, description: 'A compact meter. A place for every reading.', contents: ['White six-function, two-probe meter', '12-page Equipment Quickstart', 'Two worksheets + CSV observation log'], limitation: 'Indicative spot readings, not a lab test. No automatic app syncing.', delivery: 'US & Canada · estimated 2–4 weeks' },
  { product: scoutGuideBundle, title: 'APEXEL lens + digital kit', label: 'FOR A CLOSER LOOK', kind: 'lens' as const, description: 'Get closer to the details your phone misses.', contents: ['10–20X macro lens, LED light + clip', 'Complete $19 Playbook digital kit', 'Quickstart, prompts, workbook + templates'], limitation: 'Phone not included. Check your phone and case compatibility first.', delivery: 'US & Canada · estimated 2–4 weeks' },
  { product: growTentOffer, title: 'Compact tent + Quickstart', label: 'FOR YOUR OWN GROW SPACE', kind: 'tent' as const, description: 'A defined space for a more organized setup.', contents: ['60 × 60 × 140 cm all-black tent', 'Reflective lining + floor tray', 'Equipment Quickstart + templates'], limitation: 'Tent only. Light, fans, sensors and plants are sold separately.', delivery: 'US & Canada · estimated 3–4 weeks' },
];
function CheckoutButton({ product, location }: {product: GrowTechProduct; location: string}) {
  return canPurchaseGrowTech(product) ? <Link className="gt-button" to={`/grow-tech/checkout/${product.anchorId}`} onClick={() => trackGrowTechSelectItem(product, location, planIds[product.planKey])}>Choose delivery & checkout <ArrowRight size={17}/></Link> : <span className="gt-unavailable">Currently unavailable</span>;
}
function LightGallery() {
  const [selected, setSelected] = useState(0);
  const scenes = ['product', 'grower-one', 'grower-two'];
  const labels = ['Light illustration', 'The same grower', 'In the tent'];
  return <figure className="gt-light-gallery"><img src={`/images/grow-tech/light-gallery-v1/${scenes[selected]}.webp`} alt={`AI illustration: ${labels[selected]}; generic compact LED panel, not a manufacturer photograph`} width={1000} height={1100} loading="lazy"/><div className="gt-gallery-tabs" aria-label="Light illustration gallery">{scenes.map((scene, index) => <button key={scene} type="button" aria-pressed={index === selected} onClick={() => setSelected(index)}>{labels[index]}</button>)}</div><figcaption>AI illustrations using the grower from our tent gallery. Generic light visualization, not a photograph of a qualified product, installation guide or performance demonstration. Props are not included.</figcaption></figure>;
}
export default function GrowTechShop() {
  useEffect(() => { captureGrowTechAttribution(); trackEvent('growtech_offer_view', { product_id: soilGuideOffer.productId, value: soilGuideOffer.numericPrice, currency: 'USD', availability: soilGuideOffer.availability }); }, []);
  return <div className="premium-site lens-page gt-shop">
    <SEOHead title="GrowTech | Equipment, Bundles & Guides for Home Growers" description="Compare the $59 soil meter bundle, APEXEL macro lens kit and compact grow tent. Clear contents, US/Canada delivery estimates, digital guides and selected equipment recommendations." canonicalUrl="https://www.mastergrowbot.com/grow-tech" ogImage="https://www.mastergrowbot.com/images/grow-tech/soil-launch/product.webp"/>
    <Helmet><script type="application/ld+json">{JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'GrowTech equipment and guides',url:'https://www.mastergrowbot.com/grow-tech',hasPart:offers.map(({product,kind})=>({'@type':'WebPage',name:product.name,url:`https://www.mastergrowbot.com/grow-tech#${kind === 'soil' ? 'soil-meter' : kind === 'lens' ? 'lens-offer' : 'grow-tent'}`}))})}</script></Helmet>
    <LandingNav growTechMode/>
    <main>
      <header className="gt-hero"><div className="gt-container gt-hero-grid"><div className="gt-hero-copy"><p className="gt-kicker">MASTERGROWBOT / GROWTECH</p><h1>A better setup.<br/><em>One useful tool<br/>at a time.</em></h1><p className="gt-hero-lede">Equipment you can understand. Guides you can actually use. Build your own home-grow toolkit, without buying everything at once.</p><div className="gt-hero-actions"><a className="gt-button" href="#digital-guides">Shop guides from $9 <ArrowDown size={17}/></a><a className="gt-text-link" href="#shop-bundles">Compare hardware bundles <ArrowRight size={16}/></a></div><p className="gt-hero-note">Digital guides from <strong>$9 USD</strong> · Hardware bundles from $59 USD</p></div><div className="gt-hero-visual"><img src="/images/grow-tech/tent-express-v2/grower-one.webp" alt="AI illustration of an adult home grower beside the compact black tent" width={1145} height={1374} fetchPriority="high"/><div className="gt-visual-caption"><span>YOUR SPACE. YOUR PACE.</span><p>A toolkit that grows with you.</p></div><span className="gt-image-label">AI lifestyle illustration · props excluded</span></div></div></header>
      <div className="gt-assurance"><div className="gt-container"><span><Truck size={18}/>Free shipping on hardware</span><span><ShieldCheck size={18}/>Secure Whop checkout</span><span><Leaf size={18}/>Guides included in every bundle</span></div></div>
      <ShopDigitalOffers/>
      <section className="gt-container gt-section" id="shop-bundles" aria-labelledby="bundles-title"><div className="gt-section-heading"><div><p className="gt-kicker">THE GROWTECH COLLECTION</p><h2 id="bundles-title">Choose the job.<br/><em>Then choose the tool.</em></h2></div><p>Compare what you get, what it costs and when it can arrive. Every bundle is a one-time purchase.</p></div>
        <nav className="gt-category-nav" aria-label="Shop categories"><a href="#soil-meter">Soil observations <span>$59</span></a><a href="#lens-offer">Close inspection <span>$119</span></a><a href="#grow-tent">Grow space <span>$289</span></a><a href="#grow-light">Lighting update</a><a href="#digital-guides">Digital guides <span>from $9</span></a></nav>
        <div className="gt-products">{offers.map(({product,title,label,kind,description,contents,limitation,delivery}, index) => <article id={kind === 'lens' ? 'lens-offer' : kind === 'soil' ? 'soil-meter' : 'grow-tent'} key={product.productId} className={`gt-product ${index === 0 ? 'gt-product-featured' : ''}`}><div className="gt-product-image"><img src={product.imageWebp || product.image} alt={product.alt} width={600} height={480} loading="lazy"/><span>{index === 0 ? 'ENTRY BUNDLE' : kind === 'lens' ? 'LENS + COMPLETE KIT' : 'TENT + GUIDE'}</span><small>AI product illustration</small></div><div className="gt-product-body"><p className="gt-kicker">{label}</p><h3>{title}</h3><p className="gt-product-description">{description}</p><div className="gt-price"><strong>{product.price}</strong><span>USD · Pay once</span></div><ul className="gt-includes">{contents.map(item=><li key={item}><Check size={15}/>{item}</li>)}</ul><div className="gt-delivery"><Truck size={16}/><p>{delivery}<br/><strong>Free shipping.</strong> Tax shown at checkout.</p></div><CheckoutAssurances hardware/><CheckoutButton product={product} location={`growtech:collection:${kind}`}/><p className="gt-limit">{limitation}</p>{kind === 'lens' && <Link className="gt-text-link" to="/grow-tech/apexel-macro-lens-kit">Lens details & phone compatibility <ArrowRight size={15}/></Link>}<details className="gt-package-details"><summary>Photos & package details</summary><LensGallery kind={kind}/><p>{product.description}</p></details></div></article>)}</div>
        <p className="gt-section-note">Delivery estimates run from confirmed payment. Canadian import charges, if assessed, are extra. Remote address or a deadline? <a href="mailto:support@mastergrowbot.com">Ask before ordering.</a></p>
      </section>
      <section className="gt-light-section" id="grow-light" aria-labelledby="light-status-title">
        <div className="gt-container gt-light-grid"><LightGallery/><div>
          <p className="gt-kicker">LIGHTING UPDATE</p><h2 id="light-status-title">A GrowTech light.<br/><em>Still being sourced.</em></h2>
          <p className="gt-brand">Not available to order</p>
          <p className="gt-light-lede">We’re checking a compact light to pair with the tent. A replacement will be offered only after its exact specifications, availability and delivered price are confirmed.</p>
          <p className="gt-small">The gallery shows a concept, not an available light. No light is included in the tent bundle.</p>
          <a className="gt-text-link" href="#shop-bundles">See available hardware bundles <ArrowRight size={16}/></a>
        </div></div>
      </section>
      <LensTestimonials/>
      <section className="gt-support" id="delivery"><div className="gt-container"><div className="gt-section-heading"><div><p className="gt-kicker">KNOW BEFORE YOU ORDER</p><h2>Clear expectations.<br/><em>Real order support.</em></h2></div><a className="gt-text-link" href="mailto:support@mastergrowbot.com">support@mastergrowbot.com <ArrowRight size={16}/></a></div><div className="gt-support-grid"><details open><summary>What happens after I pay?</summary><p>Open your Whop purchase with the email on your receipt for digital files. Hardware is sourced to order and tracking follows dispatch. Our hardware estimates are 2–4 weeks for lens and soil bundles, and 3–4 weeks for the tent.</p></details><details><summary>What if it isn’t right for me?</summary><p>Contact us before returning unused, unopened hardware within 30 days of delivery. You pay return shipping except for damaged or incorrect goods. For digital access or purchase problems, email us with your receipt identifier.</p></details><details><summary>Do I need the MasterGrowbot app?</summary><p>No. These tools and observation files work without an app subscription. Readings are recorded manually. The lens needs a compatible phone; check the manufacturer’s phone and case guidance before ordering.</p></details><details><summary>Which offer should I start with?</summary><p>Choose the $59 soil bundle for indicative soil observations, the lens bundle for close-up photos, or the $9 Quickstart if you already own the tools. The tent is an enclosure, not a complete lighting or ventilation system.</p></details></div></div></section>
      <section className="gt-container gt-final"><p className="gt-kicker">START WITH SOMETHING USEFUL</p><h2>Your next observation<br/>deserves a better record.</h2><a className="gt-button" href="#shop-bundles">Find your bundle <ArrowRight size={17}/></a><Link className="gt-text-link" to="/vpd-calculator">Try the free VPD calculator first</Link></section>
    </main><LandingFooter/>
  </div>;
}
