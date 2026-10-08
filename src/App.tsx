
import { Suspense, lazy, useEffect } from "react";
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { publicPageLoaders, type InitialPage } from '@/lib/publicRoutes';
import { captureGrowTechAttribution } from "@/lib/growTechAttribution";

function CampaignCapture() {
  const location = useLocation();
  useEffect(() => { captureGrowTechAttribution(); }, [location.search]);
  return null;
}

// Lazy load all page components
const LazyIndex = lazy(publicPageLoaders.Index);
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const LazyGrowGuidesHub = lazy(publicPageLoaders.GrowGuidesHub);
const LazyGrowGuideArticle = lazy(publicPageLoaders.GrowGuideArticle);
const LazyVPDCalculator = lazy(publicPageLoaders.VPDCalculator);
const Contact = lazy(() => import("@/pages/Contact"));
const LazyGrowTech = lazy(publicPageLoaders.GrowTech);
const GrowTechCheckout = lazy(() => import("@/pages/GrowTechCheckout"));
const GrowTechThankYou = lazy(() => import("@/pages/GrowTechThankYou"));
const WhopEmbedTest = lazy(() => import("@/pages/WhopEmbedTest"));
const CheckoutDiagnostics = lazy(() => import("@/pages/CheckoutDiagnostics"));
const LazyAbout = lazy(publicPageLoaders.About);
const LazyPlaybook = lazy(publicPageLoaders.Playbook);
const PlaybookCheckout = lazy(() => import("@/pages/PlaybookCheckout"));
const PlaybookThankYou = lazy(() => import("@/pages/PlaybookThankYou"));
const AIStrategyIntake = lazy(() => import("@/pages/AIStrategyIntake"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const LazyLensKit = lazy(publicPageLoaders.LensKit);
const App = ({ initialPage }: { initialPage?: InitialPage }) => {
  const Index = initialPage?.key === 'Index' ? initialPage.component : LazyIndex;
  const GrowGuidesHub = initialPage?.key === 'GrowGuidesHub' ? initialPage.component : LazyGrowGuidesHub;
  const GrowGuideArticle = initialPage?.key === 'GrowGuideArticle' ? initialPage.component : LazyGrowGuideArticle;
  const GrowTech = initialPage?.key === 'GrowTech' ? initialPage.component : LazyGrowTech;
  const VPDCalculator = initialPage?.key === 'VPDCalculator' ? initialPage.component : LazyVPDCalculator;
  const About = initialPage?.key === 'About' ? initialPage.component : LazyAbout;
  const Playbook = initialPage?.key === 'Playbook' ? initialPage.component : LazyPlaybook;
  const LensKit = initialPage?.key === 'LensKit' ? initialPage.component : LazyLensKit;
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <>
        <CampaignCapture />
        <Routes>
          <Route path="/" element={<Suspense fallback={<LoadingSpinner />}><Index /></Suspense>} />
          <Route path="/grow-tech/apexel-macro-lens-kit" element={<Suspense fallback={<LoadingSpinner />}><LensKit /></Suspense>} />
          <Route
            path="/privacy-policy"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />
          <Route
            path="/terms-of-service"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <TermsOfService />
              </Suspense>
            }
          />
          <Route
            path="/grow-guides"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <GrowGuidesHub />
              </Suspense>
            }
          />
          <Route
            path="/grow-guides/:slug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <GrowGuideArticle />
              </Suspense>
            }
          />
          <Route
            path="/vpd-calculator"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <VPDCalculator />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="/grow-tech"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <GrowTech />
              </Suspense>
            }
          />
          <Route
            path="/grow-tech/thank-you"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <GrowTechThankYou />
              </Suspense>
            }
          />
          <Route
            path="/grow-tech/checkout/:productSlug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <GrowTechCheckout />
              </Suspense>
            }
          />
          <Route
            path="/whop-embed-test"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <WhopEmbedTest />
              </Suspense>
            }
          />
          <Route
            path="/checkout-diagnostics"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CheckoutDiagnostics />
              </Suspense>
            }
          />
          <Route path="/about" element={<Suspense fallback={<LoadingSpinner />}><About /></Suspense>} />
          <Route path="/playbooks" element={<Suspense fallback={<LoadingSpinner />}><Playbook /></Suspense>} />
          <Route path="/playbooks/checkout" element={<Suspense fallback={<LoadingSpinner />}><PlaybookCheckout /></Suspense>} />
          <Route path="/playbooks/thank-you" element={<Suspense fallback={<LoadingSpinner />}><PlaybookThankYou /></Suspense>} />
          <Route
            path="/ai-strategy"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Navigate to="/about" replace />
              </Suspense>
            }
          />
          <Route
            path="/ai-strategy/book"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Navigate to="/about" replace />
              </Suspense>
            }
          />
          <Route
            path="/ai-strategy/intake"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AIStrategyIntake />
              </Suspense>
            }
          />
          <Route path="/playbook" element={<Navigate to="/playbooks" replace />} />
          <Route path="/playbook/checkout" element={<Navigate to="/playbooks/checkout" replace />} />
          <Route path="/playbook/thank-you" element={<Navigate to="/playbooks/thank-you" replace />} />
          <Route path="*" element={<main className="min-h-screen bg-black p-12 text-white"><h1>Page not found</h1><a href="/">Return to MasterGrowbot</a></main>} />
        </Routes>
      </>
      <Analytics />
    </TooltipProvider>
  );
};

export default App;
