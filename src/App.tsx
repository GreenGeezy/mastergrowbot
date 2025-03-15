
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

// Auth callback component with better error handling and detailed logging
const AuthCallback = () => {
  const session = useSession();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [processingCallback, setProcessingCallback] = useState(true);
  
  useEffect(() => {
    // Enhanced logging for debugging
    console.log('[AuthCallback] Handling auth callback', { 
      path: location.pathname,
      search: location.search,
      hash: location.hash,
      fullUrl: window.location.href
    });
    
    const processCallback = async () => {
      setProcessingCallback(true);
      try {
        // Extract error if present in the URL
        const params = new URLSearchParams(location.search);
        const urlError = params.get('error');
        const urlErrorDescription = params.get('error_description');
        const code = params.get('code');
        
        console.log('[AuthCallback] URL parameters:', { 
          error: urlError, 
          errorDescription: urlErrorDescription,
          hasCode: !!code
        });
        
        if (urlError) {
          const errorMessage = urlErrorDescription || urlError;
          setError(errorMessage);
          console.error('[AuthCallback] Auth error from URL:', errorMessage);
          return;
        }
        
        // If we have a code parameter but no session, explicitly exchange the code for a session
        if (code && !session) {
          console.log('[AuthCallback] Has code but no session, manually exchanging code');
          // This will trigger the internal Supabase auth exchange
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('[AuthCallback] Error exchanging code for session:', exchangeError);
            setError(exchangeError.message);
            return;
          }
          
          if (data?.session) {
            console.log('[AuthCallback] Successfully exchanged code for session');
            // If successful, redirect to the saved path or default to chat
            const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
            sessionStorage.removeItem('redirectTo');
            console.log('[AuthCallback] Redirecting to:', redirectTo);
            window.location.href = redirectTo;
            return;
          }
        }
        
        // Session check - if we have a session after processing
        if (session) {
          console.log('[AuthCallback] Session detected, user ID:', session.user.id);
          const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
          sessionStorage.removeItem('redirectTo');
          console.log('[AuthCallback] Redirecting to:', redirectTo);
          window.location.href = redirectTo;
        } else {
          console.log('[AuthCallback] No session detected in callback handler');
          
          // After a short delay, recheck session - sometimes it takes a moment to be available
          setTimeout(async () => {
            console.log('[AuthCallback] Rechecking session after delay');
            const { data } = await supabase.auth.getSession();
            if (data?.session) {
              console.log('[AuthCallback] Session found on recheck');
              const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
              sessionStorage.removeItem('redirectTo');
              window.location.href = redirectTo;
            } else {
              setProcessingCallback(false);
            }
          }, 2000);
        }
      } catch (callbackError) {
        console.error('[AuthCallback] Error in auth callback processing:', callbackError);
        setError('An unexpected error occurred while processing your login.');
        setProcessingCallback(false);
      }
    };
    
    processCallback();
  }, [session, location]);
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg max-w-md">
          <h2 className="text-red-500 font-semibold text-lg mb-2">Authentication Error</h2>
          <p className="text-white">{error}</p>
          <a href="/" className="mt-4 inline-block text-primary hover:underline">
            Return to home page
          </a>
        </div>
      </div>
    );
  }
  
  if (processingCallback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-white">Processing your login...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-yellow-500/10 border border-yellow-500 p-4 rounded-lg max-w-md">
        <h2 className="text-yellow-500 font-semibold text-lg mb-2">Session Not Found</h2>
        <p className="text-white">We couldn't complete your login. Please try again.</p>
        <a href="/" className="mt-4 inline-block text-primary hover:underline">
          Return to home page
        </a>
      </div>
    </div>
  );
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
              
              {/* Auth routes - Single standard path for OAuth callback reliability */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              
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
