import { Suspense, lazy, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

// Lazy load components with descriptive chunk names
const Index = lazy(() => import(/* webpackChunkName: "index" */ "./pages/Index"));
const ChatInterface = lazy(() => import(/* webpackChunkName: "chat" */ "./components/ChatInterface"));
const PlantHealthAnalyzer = lazy(() => import(/* webpackChunkName: "plant-health" */ "./pages/PlantHealthAnalyzer"));
const SharedAnalysis = lazy(() => import(/* webpackChunkName: "shared-analysis" */ "./pages/SharedAnalysis"));
const GrowingGuide = lazy(() => import(/* webpackChunkName: "growing-guide" */ "./pages/GrowingGuide"));

// Optimize query client settings
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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!session) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Enhanced loading fallback with timeout and error state
const LoadingFallback = () => {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowError(true);
    }, 10000); // Show error message after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">
          {showError 
            ? "Loading is taking longer than expected. Please refresh the page."
            : "Loading your experience..."}
        </p>
        {showError && (
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        )}
      </div>
    </div>
  );
};

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