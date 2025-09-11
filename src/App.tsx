
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
import SubscriptionGuard from "@/components/SubscriptionGuard";

// Lazy load all page components
const Index = lazy(() => import("@/pages/Index"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const ThankYou = lazy(() => import("@/pages/ThankYou"));
const ChatInterface = lazy(() => import("@/components/ChatInterface"));
const PlantHealthAnalyzer = lazy(() => import("@/pages/PlantHealthAnalyzer"));
const SharedAnalysis = lazy(() => import("@/pages/SharedAnalysis"));
const GrowingGuide = lazy(() => import("@/pages/GrowingGuide"));

const REQUIRE_QUIZ_AND_SUBSCRIPTION = import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';

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

const AuthVerification = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  
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
    if (!REQUIRE_QUIZ_AND_SUBSCRIPTION || isPublicRoute || !session) {
      return;
    }
    
    const checkRequirements = async () => {
      try {
        // Log the user info for debugging
        console.log("Checking user requirements:", session.user.id);
        
        const { data: accessData, error: accessError } = await supabase
          .from('user_access_view')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (accessError) {
          console.error("Error fetching user access data:", accessError);
          return;
        }
        
        console.log("User access data:", accessData);
        
        // No longer sign out the user, just redirect if needed
        if (!accessData?.has_completed_quiz) {
          toast.error("Please complete the quiz first");
          navigate('/quiz', { replace: true });
        } else if (!accessData?.has_active_subscription) {
          toast.error("Active subscription required");
          navigate('/quiz', { replace: true });
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };
    
    checkRequirements();
  }, [session, navigate, location.pathname, isPublicRoute]);
  
  return null;
};

const AuthCallback = () => {
  const session = useSession();
  const location = useLocation();
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    console.log("AuthCallback component mounted with pathname:", location.pathname);
    console.log("Auth callback search params:", location.search);
    console.log("Current session:", !!session);
    
    const handleCallbackParams = async () => {
      setProcessing(true);
      
      try {
        const hasAuthParams = 
          location.hash.includes('access_token') || 
          location.search.includes('code=') || 
          location.search.includes('error=');
        
        if (hasAuthParams) {
          console.log("Auth params detected, letting Supabase handle auth");
        }
        
        // Check session storage for subscription/quiz info instead of URL params
        const hasCompletedQuiz = sessionStorage.getItem('mg_has_completed_quiz') === 'true';
        const subscriptionType = sessionStorage.getItem('mg_subscription_type');
        const email = sessionStorage.getItem('mg_pending_email');
        
        console.log("Auth callback parameters from session storage:", { 
          hasCompletedQuiz, 
          subscriptionType, 
          email,
          session: !!session
        });
        
        if (session) {
          console.log("Processing with session userId:", session.user.id);
          const userEmail = email || session.user.email;
          
          try {
            console.log("Marking user as having completed quiz");
            const result = await supabase.functions.invoke('mark-quiz-completed', {
              body: { 
                user_id: session.user.id,
                email: userEmail,
                subscription_type: subscriptionType
              }
            });
            
            console.log("Mark quiz completed result:", result);
            
            if (result.error) throw new Error(result.error);
            
            console.log("Successfully marked user as having completed quiz");
            toast.success("Your account is ready to use!");
            
            // Clean up session storage
            sessionStorage.removeItem('mg_has_completed_quiz');
            sessionStorage.removeItem('mg_subscription_type');
            sessionStorage.removeItem('mg_pending_email');
          } catch (err) {
            console.error("Error marking quiz as completed:", err);
            toast.error("There was an issue activating your account");
          }
        } else {
          console.log("No session yet, waiting for auth to complete");
        }
      } catch (error) {
        console.error("Error in AuthCallback:", error);
      } finally {
        setProcessing(false);
      }
    };
    
    handleCallbackParams();
    
    if (session && !processing) {
      const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
      console.log("Session detected, redirecting to:", redirectTo);
      sessionStorage.removeItem('redirectTo');
      
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 500);
    }
  }, [session, location, processing]);
  
  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-primary">Setting up your account...</p>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const location = useLocation();
  
  useEffect(() => {
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
            <AuthVerification />
            <Routes>
              <Route 
                path="/" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Index />
                  </Suspense>
                } 
              />
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
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/v1/callback" element={<AuthCallback />} />
              <Route path="/auth/callback/*" element={<AuthCallback />} />
              <Route path="/auth/*" element={<AuthCallback />} />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <SubscriptionGuard>
                      <ChatInterface />
                    </SubscriptionGuard>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/plant-health" 
                element={
                  <ProtectedRoute>
                    <SubscriptionGuard>
                      <PlantHealthAnalyzer />
                    </SubscriptionGuard>
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
                    <SubscriptionGuard>
                      <GrowingGuide />
                    </SubscriptionGuard>
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
