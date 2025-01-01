import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Suspense, lazy } from 'react';

// Lazy load components for better initial loading performance
const Index = lazy(() => import("./pages/Index"));
const ChatInterface = lazy(() => import("./components/ChatInterface"));
const PlantHealthAnalyzer = lazy(() => import("./pages/PlantHealthAnalyzer"));
const SharedAnalysis = lazy(() => import("./pages/SharedAnalysis"));
const GrowingGuide = lazy(() => import("./pages/GrowingGuide"));

// Loading component for better user experience
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const session = useSession();
  
  if (session === undefined) {
    return <LoadingSpinner />;
  }
  
  if (!session) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return children;
};

// Root component to handle initial routing
const Root = () => {
  const session = useSession();
  const location = useLocation();

  // If we're at the root and have a session, redirect to chat
  if (location.pathname === '/' && session) {
    return <Navigate to="/chat" replace />;
  }

  return <Index />;
};

const App = () => {
  const siteUrl = process.env.NODE_ENV === 'production' 
    ? 'https://preview--mastergrowbot-dashboard.lovable.app'
    : 'http://localhost:5173';

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider 
        supabaseClient={supabase}
        initialSession={null}
      >
        <TooltipProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Root />} />
                <Route path="/auth/callback" element={<Root />} />
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
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </Suspense>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;