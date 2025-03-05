
import { Suspense, lazy } from "react";
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";

const ChatInterface = lazy(() => import("./components/ChatInterface"));
const PlantHealthAnalyzer = lazy(() => import("./pages/PlantHealthAnalyzer"));
const SharedAnalysis = lazy(() => import("./pages/SharedAnalysis"));
const GrowingGuide = lazy(() => import("./pages/GrowingGuide"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
import Quiz from "./pages/Quiz";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      gcTime: 300000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const AuthCallback = () => {
  const session = useSession();
  const location = useLocation();
  
  if (session) {
    const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
    sessionStorage.removeItem('redirectTo');
    return <Navigate to={redirectTo} replace />;
  }
  
  return <LoadingSpinner />;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const location = useLocation();
  
  if (!session) {
    if (location.pathname !== '/') {
      sessionStorage.setItem('redirectTo', location.pathname);
    }
    return <Navigate to="/" replace />;
  }
  
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/quiz" 
                element={<Quiz />} 
              />
              <Route 
                path="/thank-you" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ThankYou />
                  </Suspense>
                } 
              />
              <Route path="/auth/v1/callback" element={<AuthCallback />} />
              <Route path="/auth/v1/google/callback" element={<AuthCallback />} />
              <Route path="/auth/v1/*" element={<AuthCallback />} />
              <Route path="/auth/callback" element={<Navigate to="/auth/v1/callback" replace />} />
              <Route path="/auth/*" element={<Navigate to="/auth/v1/callback" replace />} />
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
          <Analytics />
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;
