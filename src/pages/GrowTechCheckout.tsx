import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import EmbeddedGrowTechCheckout from "@/components/grow-tech/EmbeddedGrowTechCheckout";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNav from "@/components/landing/LandingNav";
import SEOHead from "@/components/SEOHead";
import { bundle, checkoutUrls, IS_JULY_PROMO_ACTIVE, planIds, products } from "@/data/growTechProducts";

export default function GrowTechCheckout() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const product = [...products, bundle].find((item) => item.anchorId === productSlug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productSlug]);

  if (!product) {
    return (
      <main className="min-h-screen bg-black px-4 py-24 text-center text-white">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <Link to="/grow-tech" className="mt-6 inline-block text-landing-green underline">Back to GrowTech</Link>
      </main>
    );
  }

  const planId = planIds[product.planKey];
  const checkoutUrl = checkoutUrls[product.checkoutKey];

  return (
    <div className="min-h-screen bg-[#050a07] text-white">
      <SEOHead
        title={`Secure checkout: ${product.name} | MasterGrowbot AI`}
        description={`Complete your ${product.name} order with secure Whop checkout. Free shipping to the United States and Canada.`}
        canonicalUrl={`https://www.mastergrowbot.com/grow-tech/checkout/${product.anchorId}`}
      />
      <Helmet><meta name="robots" content="noindex,follow" /></Helmet>
      <LandingNav growTechMode />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Link to="/grow-tech" className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to all GrowTech products
        </Link>
        <div className="mt-6 rounded-2xl border border-landing-green/25 bg-landing-green/10 p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-landing-green">Secure one-time checkout</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Complete your {product.name} order</h1>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
            <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-landing-green" /> Free US & Canada shipping</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-landing-green" /> Payment secured by Whop</span>
          </div>
        </div>
        <div className="mt-5">
          <EmbeddedGrowTechCheckout
            product={product}
            planId={planId}
            fallbackCheckoutUrl={checkoutUrl}
            ctaLocation={`growtech_checkout_page:${product.anchorId}`}
            promoActive={IS_JULY_PROMO_ACTIVE}
          />
        </div>
        <p className="mt-8 text-center text-xs leading-5 text-white/50">
          Prices are in USD. Need order help? <a href="mailto:support@mastergrowbot.com" className="text-landing-green underline">support@mastergrowbot.com</a>
        </p>
      </main>
      <LandingFooter />
    </div>
  );
}
