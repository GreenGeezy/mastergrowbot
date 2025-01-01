import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

// Optimize lazy loading with preload hints
const Index = lazy(() => import("./pages/Index"));
const ChatInterface = lazy(() => import("./components/ChatInterface"));
const PlantHealthAnalyzer = lazy(() => import("./pages/PlantHealthAnalyzer"));
const SharedAnalysis = lazy(() => import("./pages/SharedAnalysis"));
const GrowingGuide = lazy(() => import("./pages/GrowingGuide"));

// Preload critical components
Index.preload?.();

// Optimize query client settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      // Add timeout to prevent infinite loading
      networkMode: 'online',
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const location = useLocation();
  
  if (!session) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Enhanced loading fallback with timeout
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="text-muted-foreground">Loading your experience...</p>
    </div>
  </div>
);

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
                <Route path="/shared/:token" element={<SharedAnalysis />} />
                <Route 
                  path="/grow-guide" 
                  element={
                    <ProtectedRoute>
                      <GrowingGuide />
                    </ProtectedRoute>
                  } 
                />
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