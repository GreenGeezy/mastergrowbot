import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import LensGallery from '@/components/grow-tech/LensGallery';
import LensTestimonials from '@/components/grow-tech/LensTestimonials';
import { AppPlatformButtons } from '@/components/landing/cta';
import { scoutGuideBundle as offer, canPurchaseGrowTech } from '@/data/growTechProducts';
import { trackGrowTechSelectItem } from '@/lib/analytics';
import '@/components/landing/premium.css';
import '@/components/grow-tech/lens-launch.css';

const url = 'https://www.mastergrowbot.com/grow-tech/apexel-macro-lens-kit';
const product = {
  '@context': 'https://schema.org', '@type': 'Product', '@id': `${url}#product`,
  name: offer.name, description: offer.schemaDescription, sku: offer.sku,
  image: `https://www.mastergrowbot.com${offer.image}`, brand: { '@type': 'Brand', name: 'APEXEL' },
  offers: { '@type': 'Offer', url, price: offer.numericPrice, priceCurrency: 'USD',
    availability: canPurchaseGrowTech(offer) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    eligibleRegion: offer.deliveryCountries?.map(addressCountry => ({ '@type': 'Country', name: addressCountry })),
    hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: offer.deliveryCountries,
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow', merchantReturnDays: 30,
      returnMethod: 'https://schema.org/ReturnByMail', returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility' },
  },
};
const breadcrumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.mastergrowbot.com/' },
  { '@type': 'ListItem', position: 2, name: 'GrowTech', item: 'https://www.mastergrowbot.com/grow-tech' },
  { '@type': 'ListItem', position: 3, name: 'APEXEL macro lens kit', item: url },
] };
function Buy({ location }: { location: string }) {
  return canPurchaseGrowTech(offer)
    ? <Link className="lens-button" to={`/grow-tech/checkout/${offer.anchorId}`} onClick={() => trackGrowTechSelectItem(offer, location)}>{offer.buttonLabel}</Link>
    : <a className="lens-button" href="#delivery">Ordering opens soon</a>;
}
export default function LensKit() {
  return <div className="premium-site lens-page">
    <SEOHead title="APEXEL 10–20X Macro Lens Kit + Guide | MasterGrowbot" description="APEXEL phone macro lens, LED light and MasterGrowbot guide with worksheets. $119 USD. Check phone fit and US/Canada delivery before ordering." canonicalUrl={url} ogImage={`https://www.mastergrowbot.com${offer.image}`} />
    <Helmet><script type="application/ld+json">{JSON.stringify(product)}</script><script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script></Helmet>
    <LandingNav growTechMode />
    <main>
      <section className="lens-wrap lens-hero"><div className="lens-intro"><p className="lens-eyebrow">LENS + LIGHT + OBSERVATION KIT</p><h1>APEXEL 10–20X macro lens kit</h1><p>Get an adjustable phone macro lens and LED light, plus MasterGrowbot’s equipment guide, two worksheets and CSV observation log.</p><div className="lens-price"><strong>{offer.price}</strong><span>USD · One-time purchase</span></div><p className="lens-small">{offer.fulfillmentNote}</p><Buy location="lens-product:hero" /><p className="lens-small">Phone and app subscription not included.</p><a className="lens-secondary" href="#compatibility">Check your phone compatibility ↓</a></div><LensGallery /></section>
      <section className="lens-wrap lens-section"><h2>What you receive</h2><div className="lens-grid"><article><h3>APEXEL lens and light</h3><p>Adjustable 10–20X ZoomMacro lens, LED ring light and mounting clip. Align it with your phone’s main rear camera.</p></article><article><h3>MasterGrowbot Equipment Quickstart</h3><p>A 12-page digital guide covering equipment handling, photo consistency, reading limitations and troubleshooting.</p><a href="/downloads/grow-tech/quickstart-sample.pdf" className="lens-secondary">Preview the guide sample</a></article><article><h3>Worksheets and observation log</h3><p>Two printable/fillable worksheets and a CSV log. Keep dates, equipment settings and checked observations with your photos.</p></article></div></section>
      <section className="lens-wrap lens-section" id="compatibility"><h2>Check fit and optical limits first</h2><p>Compatibility is not universal. Camera bumps and cases can affect alignment. APEXEL specifies 10–20X macro magnification; that does not guarantee microscope-level detail or diagnosis.</p><p>View the <a className="lens-secondary" href="https://www.shopapexel.com/pages/compatibility-guide" target="_blank" rel="noopener noreferrer">manufacturer’s phone compatibility guide</a> and <a className="lens-secondary" href="https://www.shopapexel.com/products/zoommacro-macro-lens?variant=48462996472116" target="_blank" rel="noopener noreferrer">product specifications and demonstrations</a> before ordering. Our gallery contains AI illustrations, not optical performance evidence.</p></section>
      <LensTestimonials />
      <section className="lens-wrap lens-section" id="delivery"><h2>Delivery, access and returns</h2><p>{offer.fulfillmentNote}</p><p>Digital files are available through Whop after confirmed payment. Hardware is sourced to order; tracking follows dispatch. Sales tax is shown at checkout. Canadian import charges, if assessed, are extra.</p><p>Contact support@mastergrowbot.com before returning unused, unopened hardware within 30 days of delivery. You pay return shipping except for damaged or incorrect goods. Contact us before ordering for a remote address or a particular deadline.</p></section>
      <section className="lens-wrap lens-section"><h2>Keep photos with your notes</h2><p>MasterGrowbot AI offers a separate place for your photos, journal and tasks on iOS and Android. The lens does not automatically sync to the app. App subscription terms and any AI limitations are separate from this hardware purchase.</p><AppPlatformButtons campaign="lens-product" location="lens-product:app" /></section>
      <section className="lens-wrap lens-section lens-final"><h2>A closer view, with a clearer record</h2><p>{offer.name} · {offer.price} USD</p><Buy location="lens-product:final" /><p className="mt-5"><Link className="lens-secondary" to="/grow-tech">Compare other GrowTech products</Link> · <Link className="lens-secondary" to="/playbooks">Explore the digital Playbook</Link></p></section>
    </main><LandingFooter />
  </div>;
}
