import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";

// Lazy load route components
const ChatInterface = lazy(() => import("./components/ChatInterface"));
const PlantHealthAnalyzer = lazy(() => import("./pages/PlantHealthAnalyzer"));
const SharedAnalysis = lazy(() => import("./pages/SharedAnalysis"));
const GrowingGuide = lazy(() => import("./pages/GrowingGuide"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      gcTime: 300000,
      retry: 1,
    },
  },
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const location = useLocation();
  
  if (!session) {
    sessionStorage.setItem('redirectTo', location.pathname);
    return <Navigate to="/" replace />;
  }
  
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

const App = () => {
  // Simplified domain handling - only redirect in production to main domain
  const currentHostname = window.location.hostname;
  const isLocalhost = currentHostname.includes('localhost') || currentHostname.includes('127.0.0.1');
  const isPreview = currentHostname.includes('preview--');
  const isProduction = process.env.NODE_ENV === 'production' && !isLocalhost && !isPreview;
  
  // Only redirect if we're in production and not on preview or localhost
  if (isProduction && currentHostname !== 'mastergrowbot.lovable.app') {
    window.location.replace(`https://mastergrowbot.lovable.app${window.location.pathname}${window.location.search}`);
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth/callback" element={<Index />} />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <ChatInterface />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/plant-health" 
                element={
                  <ProtectedRoute>
                    <PlantHealthAnalyzer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/shared/:token" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <SharedAnalysis />
                  </Suspense>
                } 
              />
              <Route 
                path="/grow-guide" 
                element={
                  <ProtectedRoute>
                    <GrowingGuide />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;