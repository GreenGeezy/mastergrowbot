import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Leaf, Play, RotateCcw, ShieldCheck, Star, Sun, Truck } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { AppActions } from '@/components/landing/HeroSection';
import HeroProductDemo from '@/components/landing/HeroProductDemo';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import LensGallery from '@/components/grow-tech/LensGallery';
import LightSupplierReviews from '@/components/grow-tech/LightSupplierReviews';
import CheckoutAssurances from '@/components/grow-tech/CheckoutAssurances';
import GrowSetupShop from '@/components/grow-tech/GrowSetupShop';
import { growLightOffer, canPurchaseGrowTech, soilGuideOffer, scoutGuideBundle, growTentOffer, planIds, type GrowTechProduct } from '@/data/growTechProducts';
import { captureGrowTechAttribution } from '@/lib/growTechAttribution';
import { trackEvent, trackGrowTechSelectItem } from '@/lib/analytics';
import '@/components/landing/premium.css';
import '@/components/grow-tech/lens-launch.css';
import '@/components/grow-tech/growtech-shop.css';
import '@/components/landing/premium-release.css';
import '@/components/landing/cinematic.css';
import '@/components/grow-tech/growtech-silver-hero.css';

const offers = [
  { product: soilGuideOffer, title: 'Soil meter + Quickstart', label: 'THE $59 STARTING POINT', kind: 'soil' as const, description: 'Take a spot reading, then keep the value and date together in your observation log.', contents: ['White six-function, two-probe meter', '12-page Equipment Quickstart', 'Two worksheets + CSV observation log'], limitation: 'Indicative spot readings, not a lab test. No automatic app syncing.', delivery: 'Availability under review for US and Canada' },
  { product: scoutGuideBundle, title: 'APEXEL lens + digital kit', label: 'FOR A CLOSER LOOK', kind: 'lens' as const, description: 'Clip the illuminated lens to a compatible phone and save close-up photos to compare later.', contents: ['10–20X macro lens, LED light + clip', 'Complete $19 Playbook digital kit', 'Quickstart, prompts, workbook + templates'], limitation: 'Phone not included. Check your phone and case compatibility first.', delivery: 'Availability under review for US and Canada' },
  { product: growTentOffer, title: 'Compact tent + Quickstart', label: 'FOR YOUR OWN GROW SPACE', kind: 'tent' as const, description: 'A 60 × 60 cm footprint with reflective lining and a floor tray for a compact indoor setup.', contents: ['60 × 60 × 140 cm all-black tent', 'Reflective lining + floor tray', 'Equipment Quickstart + templates'], limitation: 'Tent only. Light, fans, sensors and plants are sold separately.', delivery: 'Availability under review for US and Canada' },
].filter(({product}) => canPurchaseGrowTech(product));
function CheckoutButton({ product, location }: {product: GrowTechProduct; location: string}) {
  return canPurchaseGrowTech(product) ? <Link className="gt-button" to={`/grow-tech/checkout/${product.anchorId}`} onClick={() => trackGrowTechSelectItem(product, location, planIds[product.planKey])}>{product.anchorId === "grow-light" ? "Get the AG1000 for $199" : "Choose delivery & checkout"} <ArrowRight size={17}/></Link> : <a className="gt-text-link" href={`mailto:support@mastergrowbot.com?subject=${encodeURIComponent(`Delivery availability: ${product.name}`)}`} onClick={() => trackEvent("growtech_availability_inquiry", { product_id: product.productId, cta_location: location })}>Ask about delivery availability <ArrowRight size={17}/></a>;
}
function LightGallery() {
  const [selected, setSelected] = useState(0);
  const images = [
    {"src":"/images/grow-tech/ag1000-details-v2/spectrum.webp","label":"Light","alt":"AG1000 hanging LED panel and spectrum graphic","productGraphic":true},
    {"src":"/images/grow-tech/ag1000-details-v2/dimming.webp","label":"Dimming","alt":"Product graphic showing the AG1000 rotary brightness control","productGraphic":true},
    {"src":"/images/grow-tech/ag1000-details-v2/specs.webp","label":"Specifications","alt":"Product specifications: 100W input, 20–100% dimming, 456 LEDs and 140 cm power cord","productGraphic":true},
    {src:'/images/grow-tech/ag1000-supplier/spectrum.png', label:'Supplier image', alt:'AG1000 supplier product image and spectrum specifications', productGraphic:true},

  ];
  const current=images[selected];
  return <figure className="gt-light-gallery"><img src={current.src} alt={current.alt} width={800} height={800} loading="lazy" style={{objectFit:'contain',background:'#06100d'}}/><div className="gt-gallery-tabs" aria-label="AG1000 product gallery">{images.map((image,index)=><button key={image.src} type="button" aria-pressed={index===selected} onClick={()=>setSelected(index)}><img src={image.src} alt="" width={72} height={60} loading="lazy"/><span>{image.label}</span></button>)}</div><figcaption>{current.productGraphic ? 'Product specifications supplied by the manufacturer. Follow the supplied manual.' : 'Tent, plants and props are not included.'}</figcaption></figure>;
}
export default function GrowTechShop() {
  const heroRef = useRef<HTMLElement>(null);
  const [heroPassed, setHeroPassed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroVideo, setHeroVideo] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.bottom <= 72), {rootMargin:'-72px 0px 0px 0px'});
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { captureGrowTechAttribution(); trackEvent('growtech_collection_view', { collection: 'inspection-equipment' }); }, []);
  return <div className="premium-site cinematic-site lens-page gt-shop">
    <SEOHead title="GrowTech | Equipment, Bundles & Guides for Home Growers" description="Explore leaf inspection tools, soil meters, lighting and tents for home growers. Explore the AG1000 light and free equipment guidance." canonicalUrl="https://www.mastergrowbot.com/grow-tech" ogImage="https://www.mastergrowbot.com/images/grow-tech/ag1000-details-v2/spectrum.webp"/>
    <Helmet><script type="application/ld+json">{JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'GrowTech equipment and guides',url:'https://www.mastergrowbot.com/grow-tech',hasPart:[{'@type':'WebPage',name:growLightOffer.name,url:'https://www.mastergrowbot.com/grow-tech#grow-light'},...offers.map(({product,kind})=>({'@type':'WebPage',name:product.name,url:`https://www.mastergrowbot.com/grow-tech#${kind === 'soil' ? 'soil-meter' : kind === 'lens' ? 'lens-offer' : 'grow-tent'}`}))]})}</script><script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"Product",name:growLightOffer.name,description:growLightOffer.schemaDescription,image:`https://www.mastergrowbot.com${growLightOffer.image}`,sku:growLightOffer.sku,brand:{"@type":"Brand",name:"ALPHAGROW"},offers:{"@type":"Offer",price:"199.00",priceCurrency:"USD",availability:canPurchaseGrowTech(growLightOffer) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",url:"https://www.mastergrowbot.com/grow-tech/checkout/grow-light",itemCondition:"https://schema.org/NewCondition",eligibleRegion:growLightOffer.deliveryCountries?.map(name => ({"@type":"Country",name})),shippingDetails:{"@type":"OfferShippingDetails",shippingRate:{"@type":"MonetaryAmount",value:0,currency:"USD"},shippingDestination:{"@type":"DefinedRegion",addressCountry:growLightOffer.deliveryCountries}},hasMerchantReturnPolicy:{"@type":"MerchantReturnPolicy",applicableCountry:growLightOffer.deliveryCountries,returnPolicyCategory:"https://schema.org/MerchantReturnFiniteReturnWindow",merchantReturnDays:30,returnMethod:"https://schema.org/ReturnByMail",returnFees:"https://schema.org/ReturnFeesCustomerResponsibility",merchantReturnLink:"https://www.mastergrowbot.com/grow-tech#shipping-returns"}}})}</script></Helmet>
    <LandingNav growTechMode onMenuOpenChange={setMenuOpen}/>
    <main>
      <header ref={heroRef} className="gt-hero gt-hero-silver"><div className="gt-container gt-silver-grid">
        <div className="gt-silver-copy">
          <div className="gt-silver-product"><span className="gt-silver-icon" aria-hidden="true"><Sun size={20}/></span><p>ALPHAGROW AG1000<span>100W dimmable full-spectrum LED</span></p></div>
          <h1>Adjust the light.<br/><em>Watch your plants grow.</em></h1>
          <p className="gt-silver-lede">Hang the 100W full-spectrum panel in a 2×2, 3×3 or 4×2 tent. Turn the dial from 20% to 100% as your plants move from seedling to flower.</p>
          <a className="gt-silver-rating" href="#light-reviews-title"><span aria-hidden="true">{[0,1,2,3,4].map(i=><Star key={i} size={15} fill="currentColor"/>)}</span>5-star product reviews from growers</a>
          <div className="gt-silver-buy">
            <div className="gt-silver-price"><strong>$199</strong><span>USD · one-time purchase<b>US shipping included</b></span></div>
            <CheckoutButton product={growLightOffer} location="growtech:hero:light"/>
          </div>
          <ul className="gt-silver-trust"><li><Truck size={16}/>Ships to US addresses</li><li><RotateCcw size={16}/>30-day returns</li><li><ShieldCheck size={16}/>Secure checkout</li></ul>
          <p className="gt-silver-fine">Estimated US delivery about two weeks from confirmed payment. Tracking after dispatch. Tax at checkout. Tent, plants and ventilation sold separately. <a href="#shipping-returns">Return terms</a></p>
          <a className="gt-silver-next" href="#starter-setups">New: complete grow tent kits from $299 <ArrowRight size={15}/></a>
        </div>
        <div className="gt-silver-visual">
          {heroVideo
            ? <video controls autoPlay playsInline poster="/images/grow-tech/ag1000-lifestyle-v2/hero.webp" aria-label="Grower checking plants and adjusting the AG1000 dimmer" src="/videos/growtech-light-dimmer.mp4"/>
            : <><picture><source media="(max-width:900px)" srcSet="/images/grow-tech/ag1000-lifestyle-v2/hero-mobile.webp"/><img src="/images/grow-tech/ag1000-lifestyle-v2/hero.webp" width={1200} height={1500} fetchPriority="high" alt="Home grower checking cannabis plants under the AG1000 100W LED grow light in a reflective grow tent"/></picture>
              <button type="button" className="gt-silver-play" onClick={() => { setHeroVideo(true); trackEvent('growtech_hero_video_play', { product_id: 'growtech_ag1000_light' }); }}><Play size={16} fill="currentColor"/>Watch the dimmer in action</button></>}
          {!heroVideo && <div className="gt-silver-tag"><span>100W · 20–100% DIMMING</span><strong>Your light, your dial.</strong></div>}

        </div>
      </div></header>
      <div className="gt-assurance"><div className="gt-container"><span><Truck size={18}/>US shipping included on the AG1000</span><span><ShieldCheck size={18}/>Secure Whop checkout</span><span><Leaf size={18}/>Complete Playbook included with every order</span></div></div>
      <GrowSetupShop/>
      <section className="gt-light-section" id="grow-light" aria-labelledby="light-status-title">
        <div className="gt-container gt-light-grid"><LightGallery/><div>
          <p className="gt-kicker">FEATURED / COMPACT INDOOR LIGHTING</p><h2 id="light-status-title">ALPHAGROW AG1000.<br/><em>Bright, even light for your tent.</em></h2>
          <p className="gt-light-lede">A 100W full-spectrum LED panel that covers a 2×2 ft canopy through flower and lights up to about a 3×3 ft area for seedlings and veg. Run it soft for seedlings, then turn the dial up as your plants stretch.</p>
          <div className="gt-price"><strong>$199</strong><span>USD · One-time payment</span></div>
          <CheckoutAssurances hardware/>
          <p className="gt-kit-included">In the box: AG1000 light, plus a free equipment quickstart and observation worksheet.</p>
          <ul className="gt-includes"><li><Check size={15}/>AG1000 Full Spectrum 100Watts model</li><li><Check size={15}/>Rated 100W input · 20–100% dimming</li><li><Check size={15}/>US three-prong plug · manual setup</li><li><Check size={15}/>Fits 2×2, 3×3 and 4×2 tents (use two for a full 4×2 flower canopy)</li></ul>
          
          <CheckoutButton product={growLightOffer} location="growtech:featured:light"/><p className="gt-small">US shipping included · 30-day returns on undamaged hardware · <a href="#shipping-returns">Shipping and return policy</a> · <a href="mailto:support@mastergrowbot.com">Ask an order question</a></p>
          <p className="gt-small">Tent, ventilation and plants sold separately. Check mounting clearance in the supplied manual. Results depend on your setup; no yield guarantees.</p>
          <a className="gt-text-link" href="#light-reviews-title">Read product reviews <ArrowRight size={16}/></a>
        </div></div>
      </section>

      <LightSupplierReviews/>
      <section className="gt-container gt-section"><p className="gt-kicker">WHY GROWERS PICK THE AG1000</p><h2 className="gt-fit-title">Simple to hang.<br/><em>Easy to dial in.</em></h2><div className="release-fit"><article><h3>Works in 2×2 to 4×2 tents</h3><p>Full flowering coverage in a 2×2. In a 3×3 or 4×2 it handles seedlings and veg, and two panels cover a full 4×2 canopy through flower.</p></article><article><h3>One dial, every stage</h3><p>20 to 100% dimming lets you go gentle on seedlings and clones, then bring the intensity up through veg and flower.</p></article><article><h3>Backed by real support</h3><p>US shipping included, tracking after dispatch, 30-day returns on undamaged hardware, and a real person at support@mastergrowbot.com.</p></article></div></section>
      <section id="growtech-app" className="gt-container gt-section" aria-labelledby="growtech-app-title"><div className="gt-light-grid"><div><p className="gt-kicker">MASTERGROWBOT AI · iPHONE & ANDROID</p><h2 id="growtech-app-title">New light dialed in?<br/><em>Let AI watch the leaves.</em></h2><p>Lighting changes show up in your leaves first. Snap a photo with MasterGrowbot AI to spot stress, yellowing or bleaching early, get clear checks on what to adjust, and keep every observation in one grow journal.</p><p>Free download. Eligible new subscribers get a 3-day Pro trial; photo analysis requires a subscription after that.</p><AppActions location="growtech-app" trial/><Link className="gt-text-link" to="/#grow-walkthrough">See the app walkthrough <ArrowRight size={16}/></Link></div><div className="gt-app-preview"><HeroProductDemo/></div></div></section>
      <section className="gt-container gt-section" id="shipping-returns" aria-labelledby="shipping-returns-title"><h2 id="shipping-returns-title">Shipping and return policy</h2><h3>Hardware delivery</h3><p>The AG1000 ships to US addresses with shipping included. Estimated delivery is about two weeks from confirmed payment. Other equipment and destinations are under review. Global supply-chain conditions, customs processing and carrier delays may extend delivery times. Tracking is provided after dispatch. Delivery dates are estimates, not guarantees. Canadian import charges, if assessed, are extra.</p><h3>Hardware returns and refunds</h3><p>Your hardware purchase is eligible for a refund if we receive the returned item within 30 days of purchase and it is undamaged. Before sending a return, email <a href="mailto:support@mastergrowbot.com">support@mastergrowbot.com</a> for return instructions. You pay return shipping unless the item arrived damaged or incorrect. Contact support promptly if your order arrives damaged or incorrect.</p><h3>Digital guides</h3><p>Digital files are accessed through Whop after confirmed payment and do not require shipping. Digital purchases are non-refundable. If you cannot access your files, contact support and we will help.</p></section>
      <section className="gt-support" id="delivery"><div className="gt-container"><div className="gt-section-heading"><div><p className="gt-kicker">KNOW BEFORE YOU ORDER</p><h2>Delivery, returns<br/><em>and order support.</em></h2></div><a className="gt-text-link" href="mailto:support@mastergrowbot.com">support@mastergrowbot.com <ArrowRight size={16}/></a></div><div className="gt-support-grid"><details open><summary>What happens after I pay?</summary><p>Open your Whop purchase with the email on your receipt for digital files. Hardware is sourced to order and tracking follows dispatch. Delivery estimates are shown when a destination opens. Global supply-chain and carrier delays may extend delivery times. <a href="#shipping-returns">Read the shipping and return policy</a>.</p></details><details><summary>What if it isn’t right for me?</summary><p>Your hardware purchase is eligible for a refund if we receive the returned item within 30 days of purchase and it is undamaged. Contact us before returning it. You pay return shipping unless the item arrived damaged or incorrect. For digital access or purchase problems, email us with your receipt identifier.</p></details><details><summary>Do I need the MasterGrowbot app?</summary><p>No. These tools and observation files work without an app subscription. Readings are recorded manually. The light has manual controls and does not pair with the app.</p></details><details><summary>Which offer should I start with?</summary><p>Starting from scratch? The 2×2 grow tent kit is the simplest way in. Already have a tent? Add the AG1000 light. Want room for more plants? Go 4×2 and pair it with two AG1000 panels. <a href="#starter-setups">Compare tents and kits</a>.</p></details><details><summary>Will the AG1000 work in a tent bigger than 2×2?</summary><p>Yes. One AG1000 gives full flowering coverage in a 2×2 ft tent and covers up to about 3×3 ft for seedlings and vegetative growth. In a 3×3 or 4×2 tent, use one panel for seedlings and veg, or run two panels for full coverage through flower. Check hanging height in the supplied manual.</p></details><details><summary>What comes with every hardware order?</summary><p>Every AG1000, tent and kit order includes the complete MasterGrowbot Playbook digital kit, opened in Whop after confirmed payment. US shipping is included and tracking follows dispatch.</p></details></div></div></section>
      <section className="gt-container gt-final gt-final-v2"><p className="gt-kicker">ALPHAGROW AG1000 · $199</p><h2>Your light. Your dial.<br/><em>Your best grow yet.</em></h2><p>100W full spectrum, 20 to 100% dimming, US shipping included and 30-day returns.</p><CheckoutButton product={growLightOffer} location="growtech:closing:light"/><a className="gt-text-link" href="#light-reviews-title">Read grower reviews first <ArrowRight size={16}/></a></section>
    </main><LandingFooter/>{heroPassed && !menuOpen && <aside className="gt-mobile-purchase" aria-label="Shop the AG1000"><span>AG1000 · US delivery · $199</span><CheckoutButton product={growLightOffer} location="growtech:mobile-bar:light"/></aside>}
  </div>;
}
