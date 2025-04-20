import { Suspense, lazy, useState, useEffect } from "react";
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Eagerly load the Index page for better UX
import Index from "./pages/Index";

// Environment variable to control subscription requirement
const REQUIRE_QUIZ_AND_SUBSCRIPTION = import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';

// Lazy load all other components
const ChatInterface = lazy(() => import(/* webpackChunkName: "chat" */ "./components/ChatInterface"));
const PlantHealthAnalyzer = lazy(() => import(/* webpackChunkName: "plant-health" */ "./pages/PlantHealthAnalyzer"));
const SharedAnalysis = lazy(() => import(/* webpackChunkName: "shared-analysis" */ "./pages/SharedAnalysis"));
const GrowingGuide = lazy(() => import(/* webpackChunkName: "growing-guide" */ "./pages/GrowingGuide"));
const ThankYou = lazy(() => import(/* webpackChunkName: "thank-you" */ "./pages/ThankYou"));
const Quiz = lazy(() => import(/* webpackChunkName: "quiz" */ "./pages/Quiz"));
const PrivacyPolicy = lazy(() => import(/* webpackChunkName: "privacy-policy" */ "./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import(/* webpackChunkName: "terms-of-service" */ "./pages/TermsOfService"));
const EmailTest = lazy(() => import(/* webpackChunkName: "email-test" */ "./pages/EmailTest"));

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
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("AuthCallback component mounted with pathname:", location.pathname);
    console.log("Auth callback search params:", location.search);
    console.log("Auth callback hash params:", location.hash);
    console.log("Current session:", !!session);
    
    // Check if there are auth params in the URL
    const hasAuthParams = 
      location.hash.includes('access_token') || 
      location.search.includes('code=') || 
      location.search.includes('error=');
    
    if (hasAuthParams) {
      console.log("Auth params detected, letting Supabase handle auth");
      // Give Supabase some time to process the auth params
      const checkSession = async () => {
        // Wait for session to be set
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log("Session detected, redirecting to chat");
          navigate('/chat', { replace: true });
        } else {
          console.log("No session detected yet");
          // Check again in 1 second if no session was found
          setTimeout(checkSession, 1000);
        }
      };
      
      checkSession();
    }
    
    // If we have a session after handling the callback, redirect
    if (session) {
      const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
      console.log("Session detected, redirecting to:", redirectTo);
      sessionStorage.removeItem('redirectTo');
      navigate(redirectTo, { replace: true });
    }
  }, [session, location, navigate]);
  
  return <LoadingSpinner />;
};

// Global subscription and quiz check component
const AuthVerification = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Skip check on public routes
  const isPublicRoute = [
    '/', 
    '/privacy-policy', 
    '/terms-of-service', 
    '/quiz', 
    '/thank-you', 
    '/auth/callback', 
    '/auth/v1/callback'
  ].some(route => 
    location.pathname === route || 
    location.pathname.startsWith('/auth/') || 
    location.pathname.startsWith('/shared/')
  );
  
  useEffect(() => {
    // Skip if not requiring checks or on public routes
    if (!REQUIRE_QUIZ_AND_SUBSCRIPTION || isPublicRoute || !session) {
      return;
    }
    
    const checkRequirements = async () => {
      try {
        // Check subscription status
        const { data: accessData, error: accessError } = await supabase
          .from('user_access_view')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (accessError) throw accessError;
        
        // If user has no subscription or hasn't completed quiz, sign them out
        if (!accessData?.has_active_subscription || !accessData?.has_completed_quiz) {
          console.log("User does not meet requirements:", accessData);
          
          // Show appropriate message
          if (!accessData?.has_completed_quiz) {
            toast.error("Please complete the quiz first");
            await supabase.auth.signOut();
            navigate('/quiz', { replace: true });
          } else if (!accessData?.has_active_subscription) {
            toast.error("Active subscription required");
            await supabase.auth.signOut();
            navigate('/quiz', { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };
    
    checkRequirements();
  }, [session, navigate, location.pathname, isPublicRoute]);
  
  return null; // This component doesn't render anything
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
            {/* Add the global auth verification component */}
            <AuthVerification />
            <Routes>
              {/* Eagerly loaded route */}
              <Route path="/" element={<Index />} />
              
              {/* Public routes - No authentication required */}
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
              
              {/* Test route for subscription email */}
              <Route 
                path="/email-test" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <EmailTest />
                  </Suspense>
                } 
              />
              
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
