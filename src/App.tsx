
import { Suspense, lazy } from "react";
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load all page components
const Index = lazy(() => import("@/pages/Index"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const GrowGuidesHub = lazy(() => import("@/pages/GrowGuidesHub"));
const GrowGuideArticle = lazy(() => import("@/pages/GrowGuideArticle"));
const VPDCalculator = lazy(() => import("@/pages/VPDCalculator"));
const Contact = lazy(() => import("@/pages/Contact"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  );
};

export default App;
