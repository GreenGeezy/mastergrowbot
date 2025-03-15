import { Suspense, lazy, useState, useEffect } from "react";
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

// Eagerly load the Index page for better UX
import Index from "./pages/Index";

// Lazy load all other components
const ChatInterface = lazy(() => import(/* webpackChunkName: "chat" */ "./components/ChatInterface"));
const PlantHealthAnalyzer = lazy(() => import(/* webpackChunkName: "plant-health" */ "./pages/PlantHealthAnalyzer"));
const SharedAnalysis = lazy(() => import(/* webpackChunkName: "shared-analysis" */ "./pages/SharedAnalysis"));
const GrowingGuide = lazy(() => import(/* webpackChunkName: "growing-guide" */ "./pages/GrowingGuide"));
const ThankYou = lazy(() => import(/* webpackChunkName: "thank-you" */ "./pages/ThankYou"));
const Quiz = lazy(() => import(/* webpackChunkName: "quiz" */ "./pages/Quiz"));

// Create the query client outside of the component to prevent recreation on rerenders
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

// Separate loading component for better reuse
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Auth callback component
const AuthCallback = () => {
  const session = useSession();
  const location = useLocation();
  
  useEffect(() => {
    console.log("AuthCallback component mounted with pathname:", location.pathname);
    console.log("Auth callback search params:", location.search);
    console.log("Current session:", !!session);
    
    // Check if there are auth params in the URL
    const hasAuthParams = 
      location.hash.includes('access_token') || 
      location.search.includes('code=') || 
      location.search.includes('error=');
    
    if (hasAuthParams) {
      console.log("Auth params detected, letting Supabase handle auth");
      // Supabase should automatically handle this with detectSessionInUrl
    }
    
    // If we have a session after handling the callback, redirect
    if (session) {
      const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
      console.log("Session detected, redirecting to:", redirectTo);
      sessionStorage.removeItem('redirectTo');
      window.location.href = redirectTo;
    }
  }, [session, location]);
  
  return <LoadingSpinner />;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const location = useLocation();
  
  useEffect(() => {
    // Handle redirect on session change
    if (!session && location.pathname !== '/') {
      sessionStorage.setItem('redirectTo', location.pathname);
    }
  }, [session, location.pathname]);
  
  if (!session) {
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
              {/* Eagerly loaded route */}
              <Route path="/" element={<Index />} />
              
              {/* Lazy loaded routes */}
              <Route 
                path="/quiz" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Quiz />
                  </Suspense>
                } 
              />
              <Route 
                path="/thank-you" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ThankYou />
                  </Suspense>
                } 
              />
              
              {/* Auth routes - Add comprehensive coverage for all possible auth patterns */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/v1/callback" element={<AuthCallback />} />
              <Route path="/auth/callback/*" element={<AuthCallback />} />
              <Route path="/auth/*" element={<AuthCallback />} />
              
              {/* Protected routes */}
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
