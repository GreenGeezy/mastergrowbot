import OrderQuestions from "@/components/grow-tech/OrderQuestions";
import "@/components/landing/premium.css";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, ShieldCheck, Truck } from "lucide-react";
import EmbeddedGrowTechCheckout from "@/components/grow-tech/EmbeddedGrowTechCheckout";
import LandingFooter from "@/components/landing/LandingFooter";
import SEOHead from "@/components/SEOHead";
import { allGrowTechOffers, canPurchaseGrowTech, checkoutUrls, IS_JULY_PROMO_ACTIVE, planIds } from "@/data/growTechProducts";
import { trackGrowTechBeginCheckout } from "@/lib/analytics";
import { captureGrowTechAttribution } from "@/lib/growTechAttribution";

export default function GrowTechCheckout() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const product = allGrowTechOffers.find((item) => item.anchorId === productSlug);
  const [deliveryCountry, setDeliveryCountry] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    captureGrowTechAttribution();
    setDeliveryCountry("");
    if (product && canPurchaseGrowTech(product)) trackGrowTechBeginCheckout(product, `growtech_checkout_page:${product.anchorId}`, planIds[product.planKey]);
  }, [productSlug, product]);

  if (!product) {
    return (
      <main className="min-h-screen bg-black px-4 py-24 text-center text-white">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <Link to="/grow-tech" className="mt-6 inline-block text-landing-green underline">Back to GrowTech</Link>
      </main>
    );
  }

  if (!canPurchaseGrowTech(product)) {
    return <main className="min-h-screen bg-[#060d09] px-5 py-24 text-white"><Helmet><meta name="robots" content="noindex,follow" /></Helmet><div className="mx-auto max-w-xl"><Link to="/grow-tech" className="text-emerald-300 underline">← Back to GrowTech</Link><h1 className="mt-8 text-3xl font-bold">Hardware ordering is paused</h1><p className="mt-4 leading-7 text-white/70">{product.fulfillmentNote || "This hardware offer is unavailable while sourcing and fulfillment are checked. No payment is collected. Existing buyer access remains available through Whop."}</p><Link to="/grow-tech#lens-offer" className="mt-6 inline-block text-emerald-300 underline">Explore the $119 lens + guide package</Link></div></main>;
  }

  const planId = planIds[product.planKey];
  const checkoutUrl = checkoutUrls[product.checkoutKey];
  const isDigital = product.deliveryKind === "digital";
  const destinationSupported = isDigital || product.deliveryCountries?.some(country => country === deliveryCountry);

  return (
    <div className="premium-site min-h-screen bg-[#050a07] text-white">
      <SEOHead
        title={`Secure checkout: ${product.name} | MasterGrowbot AI`}
        description={`Complete your ${product.name} order with secure Whop checkout. ${isDigital ? "Digital access through Whop after purchase." : product.fulfillmentNote}`}
        canonicalUrl={`https://www.mastergrowbot.com/grow-tech/checkout/${product.anchorId}`}
      />
      <Helmet><meta name="robots" content="noindex,follow" /></Helmet>
      <header className="border-b border-white/10 px-5 py-5"><Link to="/grow-tech" className="font-bold text-white">MasterGrowbot · GrowTech</Link></header>
      <main className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
        <Link to="/grow-tech" className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to GrowTech
        </Link>
        <div className="mt-4 rounded-2xl border border-landing-green/25 bg-landing-green/10 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-landing-green">Secure one-time checkout</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Complete your order</h1>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/75">
            <span className="inline-flex items-center gap-2">{isDigital ? <Download className="h-4 w-4 text-landing-green" /> : <Truck className="h-4 w-4 text-landing-green" />} {isDigital ? "Digital access after purchase" : product.fulfillmentNote}</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-landing-green" /> Payment secured by Whop</span>
          </div>
        </div>
        {!isDigital && <div className="mt-4 rounded-xl border border-white/15 p-4"><label className="block text-sm font-semibold" htmlFor="delivery-country">Delivery country</label><select id="delivery-country" value={deliveryCountry} onChange={event => setDeliveryCountry(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-white/20 bg-[#102016] px-3 text-white"><option value="">Select your delivery country</option><option value="US">United States</option><option value="CA">Canada</option><option value="other">Another country</option></select>{deliveryCountry && !destinationSupported && <p role="alert" className="mt-3 text-sm text-amber-200">This package is not available for your destination yet. No payment form is opened. <Link to="/grow-tech" className="underline">See other GrowTech packages.</Link></p>}<p className="mt-3 text-xs leading-5 text-white/65">Shipping included for supported destinations. Sales tax shown at checkout. Canadian import charges, if assessed, are extra.</p></div>}
        {destinationSupported && <div className="mt-3" key={product.anchorId}>
          <EmbeddedGrowTechCheckout
            product={product}
            planId={planId}
            fallbackCheckoutUrl={checkoutUrl}
            ctaLocation={`growtech_checkout_page:${product.anchorId}`}
            promoActive={!product.deliveryKind && IS_JULY_PROMO_ACTIVE}
          />
        </div>}
        {isDigital ? <div className="mt-8 rounded-xl border border-white/10 p-5 text-sm leading-7 text-white/70"><h2 className="font-bold text-white">What happens after payment?</h2><p>Sign in to Whop with the email on your receipt to open the Equipment Quickstart Files and Start Here content. Your purchase includes the 12-page PDF, worksheets and CSV log. It includes no physical equipment or app subscription.</p><p>For access or purchase issues, email support@mastergrowbot.com with your receipt identifier.</p></div> : <div className="mt-8"><OrderQuestions fulfillmentNote={product.fulfillmentNote} /></div>}
        <p className="mt-8 text-center text-xs leading-5 text-white/50">
          Prices are in USD. Need order help? <a href="mailto:support@mastergrowbot.com" className="text-landing-green underline">support@mastergrowbot.com</a>
        </p>
      </main>
      <LandingFooter />
    </div>
  );
}
