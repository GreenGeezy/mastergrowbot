import { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./integrations/supabase/client";
import LoadingFallback from "./components/LoadingFallback";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const ChatInterface = lazy(() => import("./components/ChatInterface"));
const PlantHealthAnalyzer = lazy(() => import("./pages/PlantHealthAnalyzer"));
const SharedAnalysis = lazy(() => import("./pages/SharedAnalysis"));
const GrowingGuide = lazy(() => import("./pages/GrowingGuide"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      networkMode: 'online',
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth/callback" element={<Index />} />
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="/plant-health" element={<PlantHealthAnalyzer />} />
                <Route path="/shared/:token" element={<SharedAnalysis />} />
                <Route path="/grow-guide" element={<GrowingGuide />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;