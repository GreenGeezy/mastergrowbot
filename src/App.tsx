
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { WalkthroughProvider } from "@/contexts/WalkthroughContext";
import { WalkthroughManager } from "@/components/walkthrough/WalkthroughManager";
import { MilestoneProvider } from "@/components/milestones/MilestoneProvider";
import { useSubscriptionStatus } from "@/hooks/use-subscription-status";
import { useQAOverrides } from "@/hooks/use-qa-overrides";
import { isIOSPreview } from '@/utils/flags';
// import { QABottomBanner } from './components/QABottomBanner';

import Index from "./pages/Index";
import ChatInterface from "./pages/ChatInterface";
import PlantHealthAnalyzer from "./pages/PlantHealthAnalyzer";
import GrowingGuide from "./pages/GrowingGuide";
import Quiz from "./pages/Quiz";
import SharedAnalysis from "./pages/SharedAnalysis";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ThankYou from "./pages/ThankYou";
import Settings from "@/pages/Settings";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Self-check logging utility (no PII)
const logSelfCheck = (scenario: string, result: 'PASS' | 'FAIL', details?: string) => {
  const message = `SELF-CHECK [${scenario}]: ${result}${details ? ` - ${details}` : ''}`;
  console.log(message);
};

// Route guard component with self-check flow and rollback safety
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const { hasCompletedQuiz, hasAccess, isLoading } = useSubscriptionStatus();
  const { isQAMode, qaAuth, qaAccess, qaQuiz } = useQAOverrides();
  
  // Apply QA overrides if in QA mode
  const effectiveSession = isQAMode && qaAuth !== null 
    ? (qaAuth === 'on' ? { user: { id: 'qa-user' } } : null)
    : session;
    
  const effectiveHasCompletedQuiz = isQAMode && qaQuiz !== null
    ? qaQuiz === 'done'
    : hasCompletedQuiz;
    
  const effectiveHasAccess = isQAMode && qaAccess !== null
    ? qaAccess === 'on'
    : hasAccess;
  
  // Single runtime flag for gating control - read as string and compare to 'true'
  const requireQuizAndSubscription = import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';
  
  // QA "enforce gates" mode - when ?qa=1, enforce all gates regardless of runtime flag
  const enforceGatesInQA = isQAMode;
  const gatesEnabled = enforceGatesInQA || requireQuizAndSubscription;
  
  // Guard verification logging (no PII)
  console.info('Guard state:', {
    path: location.pathname,
    gatesEnabled,
    session: !!effectiveSession,
    access: effectiveHasAccess,
    quiz: effectiveHasCompletedQuiz
  });
  
  // Self-check: Runtime flags bypass - when gates disabled, open everything
  if (!gatesEnabled) {
    logSelfCheck('Runtime-Flags-Bypass', 'PASS', 'all gates disabled by config');
    return <>{children}</>;
  }
  
  // Self-check: iOS preview bypass - when gates enabled, preview does NOT bypass
  if (isIOSPreview && gatesEnabled && !enforceGatesInQA) {
    logSelfCheck('iOS-Preview-No-Bypass', 'PASS', 'preview ignored when gates enabled');
    // Continue to gate enforcement below
  }
  
  // Self-check: Public route access
  const publicRoutes = [
    '/shared', 
    '/shared-analysis', 
    '/privacy-policy', 
    '/terms-of-service', 
    '/404', 
    '/not-found'
  ];
  const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));
  if (isPublicRoute) {
    logSelfCheck('Public-Route-Access', 'PASS', `path: ${location.pathname}`);
    return <>{children}</>;
  }
  
  // Self-check: Quiz page access
  if (location.pathname === '/quiz') {
    logSelfCheck('Quiz-Page-Access', 'PASS', 'quiz page always accessible');
    return <>{children}</>;
  }
  
  // Self-check: Landing page access
  if (location.pathname === '/') {
    logSelfCheck('Landing-Page-Access', 'PASS', 'landing page always accessible');
    return <>{children}</>;
  }
  
  // For all other routes, run the protection checks:
  
  // Self-check: Loading state
  if (isLoading) {
    logSelfCheck('Loading-State', 'PASS', 'subscription status loading');
    return null;
  }
  
  // Self-check: Signed out user accessing protected page
  if (!effectiveSession) {
    if (location.pathname !== '/') {
      // Determine where to redirect based on quiz completion
      const redirectTarget = effectiveHasCompletedQuiz ? '/' : '/quiz';
      logSelfCheck('Signed-Out-Protected-Access', 'PASS', `redirecting to ${redirectTarget}`);
      navigate(redirectTarget, { replace: true });
    } else {
      logSelfCheck('Signed-Out-Protected-Access', 'FAIL', 'already on landing page');
    }
    return null;
  }
  
  // Self-check: User with active access (bypass quiz requirement)
  if (effectiveHasAccess) {
    logSelfCheck('Active-Access-Bypass', 'PASS', 'user has active subscription/trial');
    return <>{children}</>;
  }
  
  // Self-check: User signed in but no quiz completion and no access
  if (!effectiveHasCompletedQuiz && !effectiveHasAccess) {
    if (location.pathname !== '/quiz') {
      logSelfCheck('No-Quiz-No-Access', 'PASS', 'redirecting to quiz');
      navigate('/quiz', { replace: true });
    } else {
      logSelfCheck('No-Quiz-No-Access', 'FAIL', 'already on quiz page');
    }
    return null;
  }
  
  // Self-check: User completed quiz but no access (paywall scenario)
  if (effectiveHasCompletedQuiz && !effectiveHasAccess) {
    if (location.pathname !== '/') {
      logSelfCheck('Quiz-Complete-No-Access', 'PASS', 'redirecting to paywall');
      navigate('/', { replace: true });
    } else {
      logSelfCheck('Quiz-Complete-No-Access', 'FAIL', 'already on paywall');
    }
    return null;
  }
  
  // Self-check: Fallback case
  logSelfCheck('Fallback-Case', 'FAIL', 'unexpected state reached');
  if (location.pathname !== '/') {
    navigate('/', { replace: true });
  }
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <WalkthroughProvider>
          <MilestoneProvider>
            <div className="App">
              <Toaster />
              <BrowserRouter>
              {/* <QABottomBanner /> */}
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/shared/:shareToken" element={<SharedAnalysis />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/chat" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
                <Route path="/plant-health" element={<ProtectedRoute><PlantHealthAnalyzer /></ProtectedRoute>} />
                <Route path="/grow-guide" element={<ProtectedRoute><GrowingGuide /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              </Routes>
              <WalkthroughManager />
            </BrowserRouter>
          </div>
          </MilestoneProvider>
        </WalkthroughProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
