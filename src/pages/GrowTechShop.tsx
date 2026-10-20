import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Check, Leaf, ShieldCheck, Truck } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import LensGallery from '@/components/grow-tech/LensGallery';
import LensTestimonials from '@/components/grow-tech/LensTestimonials';
import LightSupplierReviews from '@/components/grow-tech/LightSupplierReviews';
import CheckoutAssurances from '@/components/grow-tech/CheckoutAssurances';
import ShopDigitalOffers from '@/components/grow-tech/ShopDigitalOffers';
import { growLightOffer, canPurchaseGrowTech, soilGuideOffer, scoutGuideBundle, growTentOffer, planIds, type GrowTechProduct } from '@/data/growTechProducts';
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
  const images = [
    {"src":"/images/grow-tech/ag1000-enhanced-v1/hero.webp","label":"Light","alt":"AI-enhanced supplier illustration of the ALPHAGROW AG1000 hanging LED panel","supplier":true},
    {"src":"/images/grow-tech/ag1000-enhanced-v1/dimming.webp","label":"Dimming","alt":"AI-enhanced supplier graphic showing the AG1000 rotary brightness control","supplier":true},
    {"src":"/images/grow-tech/ag1000-enhanced-v1/specs.webp","label":"Specifications","alt":"Supplier specifications: 100W input, 20–100% dimming, 456 LEDs and 140 cm power cord","supplier":true},
    {"src":"/images/grow-tech/ag1000-enhanced-v1/supplier-claims.webp","label":"Supplier claims","alt":"Supplier-reported 20% more yield and 30% better cooling; independent testing not verified","supplier":true},
    {"src":"/images/grow-tech/ag1000-supplier/spectrum.png","label":"Source graphic","alt":"Original AG1000 supplier spectrum graphic supplied by the store owner","supplier":true},
    {src:'/images/grow-tech/ag1000-lifestyle-v2/hero.webp', label:'Grower illustration', alt:'AI lifestyle illustration of the same adult grower inspecting plants beneath a supplier-reference LED light', supplier:false},
    {src:'/images/grow-tech/ag1000-lifestyle-v2/dimmer.webp', label:'Adjusting the light', alt:'AI lifestyle illustration of the grower adjusting the silver brightness dial beside the tent', supplier:false},
  ];
  const current=images[selected];
  return <figure className="gt-light-gallery"><img src={current.src} alt={current.alt} width={800} height={800} loading="lazy" style={{objectFit:'contain',background:'#06100d'}}/><div className="gt-gallery-tabs" aria-label="AG1000 product gallery">{images.map((image,index)=><button key={image.src} type="button" aria-pressed={index===selected} onClick={()=>setSelected(index)}><img src={image.src} alt="" width={72} height={60} loading="lazy"/><span>{image.label}</span></button>)}</div><figcaption>{current.supplier ? 'AI-enhanced AG1000 supplier graphics. Specifications and performance statements come from the supplier; comparison baseline and independent testing are not verified. Results vary. Original supplied image under Source graphic.' : 'AI lifestyle illustration. Based on supplier product references; not a product photograph, installation guide or performance demonstration. Tent, plants and props are not included.'}</figcaption></figure>;
}
export default function GrowTechShop() {
  useEffect(() => { captureGrowTechAttribution(); trackEvent('growtech_offer_view', { product_id: growLightOffer.productId, value: growLightOffer.numericPrice, currency: 'USD', availability: growLightOffer.availability }); }, []);
  return <div className="premium-site lens-page gt-shop">
    <SEOHead title="GrowTech | Equipment, Bundles & Guides for Home Growers" description="Shop the ALPHAGROW AG1000 100W light for $199 with free shipping to the US and Canada and secure Whop checkout. Compare soil meters, lens kits, tents and digital guides from $9." canonicalUrl="https://www.mastergrowbot.com/grow-tech" ogImage="https://www.mastergrowbot.com/images/grow-tech/ag1000-enhanced-v1/hero.webp"/>
    <Helmet><script type="application/ld+json">{JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'GrowTech equipment and guides',url:'https://www.mastergrowbot.com/grow-tech',hasPart:[{'@type':'WebPage',name:growLightOffer.name,url:'https://www.mastergrowbot.com/grow-tech#grow-light'},...offers.map(({product,kind})=>({'@type':'WebPage',name:product.name,url:`https://www.mastergrowbot.com/grow-tech#${kind === 'soil' ? 'soil-meter' : kind === 'lens' ? 'lens-offer' : 'grow-tent'}`}))]})}</script><script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"Product",name:growLightOffer.name,description:growLightOffer.schemaDescription,sku:growLightOffer.sku,brand:{"@type":"Brand",name:"ALPHAGROW"},offers:{"@type":"Offer",price:"199.00",priceCurrency:"USD",availability:"https://schema.org/InStock",url:"https://www.mastergrowbot.com/grow-tech/checkout/grow-light",shippingDetails:{"@type":"OfferShippingDetails",shippingRate:{"@type":"MonetaryAmount",value:0,currency:"USD"},shippingDestination:{"@type":"DefinedRegion",addressCountry:["US","CA"]}}}})}</script></Helmet>
    <LandingNav growTechMode/>
    <main>
      <header className="gt-hero gt-hero-v2"><div className="gt-container gt-hero-grid">
        <div className="gt-hero-copy">
          <p className="gt-kicker">GROWTECH / THE AG1000 LIGHT</p>
          <h1>Your space.<br/><em>Your light.<br/>Your next grow.</em></h1>
          <p className="gt-hero-lede">Bring your indoor setup into focus with the ALPHAGROW AG1000. Full-spectrum LED lighting. Brightness you control with a turn of the dial.</p>
          <div className="gt-hero-specs"><span><strong>100W</strong> LED input</span><span><strong>20–100%</strong> dimming</span><span><strong>US plug</strong> included</span></div>
          <div className="gt-hero-purchase"><div className="gt-hero-price"><strong>$199</strong><span>USD · one-time payment<br/><b>Free shipping to the US and Canada</b></span></div>
          <Link className="gt-button" to="/grow-tech/checkout/grow-light" onClick={()=>trackGrowTechSelectItem(growLightOffer,'growtech:hero:light',planIds[growLightOffer.planKey])}>Get the AG1000 <ArrowRight size={18}/></Link>
          <p className="gt-hero-delivery">US: 7–12 business days. Canada: contact us for timing. Tax at checkout.</p>
          <div className="gt-hero-trust"><ShieldCheck size={16}/><span>Secure Whop checkout · No subscription</span></div></div>
          <div className="gt-hero-links"><a className="gt-text-link" href="#grow-light">Explore the light & gallery <ArrowDown size={15}/></a><a className="gt-text-link" href="#shop-bundles">Shop all equipment <ArrowRight size={15}/></a></div>
          <p className="gt-hero-note">Light only. Tent, plants and guides sold separately.</p>
        </div>
        <div className="gt-hero-visual"><img src="/images/grow-tech/ag1000-lifestyle-v2/hero.webp" srcSet="/images/grow-tech/ag1000-lifestyle-v2/hero-mobile.webp 640w, /images/grow-tech/ag1000-lifestyle-v2/hero.webp 1200w" sizes="(max-width:760px) 100vw, 50vw" alt="AI lifestyle illustration of our grower checking plants beneath the hanging light inside a compact tent" width={1200} height={1500} fetchPriority="high"/><div className="gt-hero-product-tag"><span>ALPHAGROW AG1000</span><strong>A little space.<br/>A daily ritual.</strong></div><span className="gt-image-label">AI lifestyle illustration · props excluded</span></div>
      </div></header>
      <div className="gt-assurance"><div className="gt-container"><span><Truck size={18}/>Free shipping on hardware</span><span><ShieldCheck size={18}/>Secure Whop checkout</span><span><Leaf size={18}/>Guides included in every bundle</span></div></div>
      <section className="gt-light-section" id="grow-light" aria-labelledby="light-status-title">
        <div className="gt-container gt-light-grid"><LightGallery/><div>
          <p className="gt-kicker">FEATURED / COMPACT INDOOR LIGHTING</p><h2 id="light-status-title">ALPHAGROW AG1000.<br/><em>Light your next start.</em></h2>
          <p className="gt-light-lede">A hanging full-spectrum LED light for seed starting and compact indoor plant setups. Adjust brightness as your setup changes.</p>
          <div className="gt-price"><strong>$199</strong><span>USD · One-time payment</span></div>
          <CheckoutAssurances hardware/>
          <ul className="gt-includes"><li><Check size={15}/>AG1000 Full Spectrum 100Watts model</li><li><Check size={15}/>Supplier-rated 100W input · 20–100% dimming</li><li><Check size={15}/>US three-prong plug · manual setup</li></ul>
          <p className="gt-small"><strong>Supplier-reported: 20% more yield · 30% better cooling.</strong><br/>Comparison baseline and independent testing not verified. Results vary.</p><p className="gt-small"><strong>Free shipping to the US and Canada.</strong> US estimated delivery 7–12 business days from confirmed payment. Contact us for Canadian delivery timing. Tracking after dispatch. Tax shown in Whop checkout.</p>
          <CheckoutButton product={growLightOffer} location="growtech:featured:light"/>
          <p className="gt-small">Light only. Tent, ventilation, plants and digital guides are separate. Check mounting clearance and the supplied manual before installation. No automatic app syncing or guaranteed full-cycle coverage or yields.</p>
          <a className="gt-text-link" href="#light-reviews-title">Read attributed supplier reviews <ArrowRight size={16}/></a>
        </div></div>
      </section>
      <LightSupplierReviews/>
      <ShopDigitalOffers/>
      <section className="gt-container gt-section" id="shop-bundles" aria-labelledby="bundles-title"><div className="gt-section-heading"><div><p className="gt-kicker">THE GROWTECH COLLECTION</p><h2 id="bundles-title">Choose the job.<br/><em>Then choose the tool.</em></h2></div><p>Compare what you get, what it costs and when it can arrive. Every bundle is a one-time purchase.</p></div>
        <nav className="gt-category-nav" aria-label="Shop categories"><a href="#soil-meter">Soil observations <span>$59</span></a><a href="#lens-offer">Close inspection <span>$119</span></a><a href="#grow-tent">Grow space <span>$289</span></a><a href="#grow-light">Grow light <span>$199</span></a><a href="#digital-guides">Digital guides <span>from $9</span></a></nav>
        <div className="gt-products">{offers.map(({product,title,label,kind,description,contents,limitation,delivery}, index) => <article id={kind === 'lens' ? 'lens-offer' : kind === 'soil' ? 'soil-meter' : 'grow-tent'} key={product.productId} className={`gt-product ${index === 0 ? 'gt-product-featured' : ''}`}><div className="gt-product-image"><img src={product.imageWebp || product.image} alt={product.alt} width={600} height={480} loading="lazy"/><span>{index === 0 ? 'ENTRY BUNDLE' : kind === 'lens' ? 'LENS + COMPLETE KIT' : 'TENT + GUIDE'}</span><small>AI product illustration</small></div><div className="gt-product-body"><p className="gt-kicker">{label}</p><h3>{title}</h3><p className="gt-product-description">{description}</p><div className="gt-price"><strong>{product.price}</strong><span>USD · Pay once</span></div><ul className="gt-includes">{contents.map(item=><li key={item}><Check size={15}/>{item}</li>)}</ul><div className="gt-delivery"><Truck size={16}/><p>{delivery}<br/><strong>Free shipping.</strong> Tax shown at checkout.</p></div><CheckoutAssurances hardware/><CheckoutButton product={product} location={`growtech:collection:${kind}`}/><p className="gt-limit">{limitation}</p>{kind === 'lens' && <Link className="gt-text-link" to="/grow-tech/apexel-macro-lens-kit">Lens details & phone compatibility <ArrowRight size={15}/></Link>}<details className="gt-package-details"><summary>Photos & package details</summary><LensGallery kind={kind}/><p>{product.description}</p></details></div></article>)}</div>
        <p className="gt-section-note">Delivery estimates run from confirmed payment. Canadian import charges, if assessed, are extra. Remote address or a deadline? <a href="mailto:support@mastergrowbot.com">Ask before ordering.</a></p>
      </section>
      <LensTestimonials/>
      <section className="gt-support" id="delivery"><div className="gt-container"><div className="gt-section-heading"><div><p className="gt-kicker">KNOW BEFORE YOU ORDER</p><h2>Clear expectations.<br/><em>Real order support.</em></h2></div><a className="gt-text-link" href="mailto:support@mastergrowbot.com">support@mastergrowbot.com <ArrowRight size={16}/></a></div><div className="gt-support-grid"><details open><summary>What happens after I pay?</summary><p>Open your Whop purchase with the email on your receipt for digital files. Hardware is sourced to order and tracking follows dispatch. Estimated delivery is 7–12 business days for the light in the US (contact us for Canadian timing), 2–4 weeks for lens and soil bundles, and 3–4 weeks for the tent.</p></details><details><summary>What if it isn’t right for me?</summary><p>Contact us before returning unused, unopened hardware within 30 days of delivery. You pay return shipping except for damaged or incorrect goods. For digital access or purchase problems, email us with your receipt identifier.</p></details><details><summary>Do I need the MasterGrowbot app?</summary><p>No. These tools and observation files work without an app subscription. Readings are recorded manually. The lens needs a compatible phone; check the manufacturer’s phone and case guidance before ordering.</p></details><details><summary>Which offer should I start with?</summary><p>Choose the $59 soil bundle for indicative soil observations, the lens bundle for close-up photos, or the $9 Quickstart if you already own the tools. The tent is an enclosure, not a complete lighting or ventilation system.</p></details></div></div></section>
      <section className="gt-container gt-final"><p className="gt-kicker">START WITH SOMETHING USEFUL</p><h2>Your next observation<br/>deserves a better record.</h2><a className="gt-button" href="#shop-bundles">Find your bundle <ArrowRight size={17}/></a><Link className="gt-text-link" to="/vpd-calculator">Try the free VPD calculator first</Link></section>
    </main><LandingFooter/>
  </div>;
}
