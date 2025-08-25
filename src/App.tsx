
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
import { QABottomBanner } from './components/QABottomBanner';

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
  const { isQAMode, qaAuth } = useQAOverrides();
  
  // Apply QA auth override if in QA mode
  const effectiveSession = isQAMode && qaAuth !== null 
    ? (qaAuth === 'on' ? { user: { id: 'qa-user' } } : null)
    : session;
  
  // Read all existing runtime flags for rollback safety
  const requireQuizAndSubscription = import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';
  const disableAuthGate = import.meta.env.VITE_DISABLE_AUTH_GATE === 'true';
  const disableQuizGate = import.meta.env.VITE_DISABLE_QUIZ_GATE === 'true';
  const disableAccessGate = import.meta.env.VITE_DISABLE_ACCESS_GATE === 'true';
  const disableAllGates = import.meta.env.VITE_DISABLE_ALL_GATES === 'true';
  
  // Log runtime flag variable names for Vercel env matching
  console.log('Runtime flags being read:', {
    'VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION': import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION,
    'VITE_DISABLE_AUTH_GATE': import.meta.env.VITE_DISABLE_AUTH_GATE,
    'VITE_DISABLE_QUIZ_GATE': import.meta.env.VITE_DISABLE_QUIZ_GATE,
    'VITE_DISABLE_ACCESS_GATE': import.meta.env.VITE_DISABLE_ACCESS_GATE,
    'VITE_DISABLE_ALL_GATES': import.meta.env.VITE_DISABLE_ALL_GATES
  });
  
  // Self-check: iOS preview bypass
  if (isIOSPreview) {
    logSelfCheck('iOS-Preview-Bypass', 'PASS', 'all gates disabled');
    return <>{children}</>;
  }
  
  // Self-check: Runtime flags bypass - check for any gate disable flags
  if (!requireQuizAndSubscription || disableAllGates || disableAuthGate || disableQuizGate || disableAccessGate) {
    logSelfCheck('Runtime-Flags-Bypass', 'PASS', 'gates disabled by config');
    return <>{children}</>;
  }
  
  // Self-check: Public route access
  const publicRoutes = [
    '/shared', 
    '/shared-analysis', 
    '/privacy', 
    '/terms', 
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
  
  // Self-check: Signed out user accessing protected page (skip if auth gate disabled)
  if (!disableAuthGate && !effectiveSession) {
    if (location.pathname !== '/') {
      // Determine where to redirect based on quiz completion
      const redirectTarget = hasCompletedQuiz ? '/' : '/quiz';
      logSelfCheck('Signed-Out-Protected-Access', 'PASS', `redirecting to ${redirectTarget}`);
      navigate(redirectTarget, { replace: true });
    } else {
      logSelfCheck('Signed-Out-Protected-Access', 'FAIL', 'already on landing page');
    }
    return null;
  }
  
  // Self-check: User with active access (bypass quiz requirement or skip if access gate disabled)
  if (!disableAccessGate && hasAccess) {
    logSelfCheck('Active-Access-Bypass', 'PASS', 'user has active subscription/trial');
    return <>{children}</>;
  }
  
  // Self-check: User signed in but no quiz completion and no access (skip if quiz gate disabled)
  if (!disableQuizGate && !hasCompletedQuiz && !hasAccess) {
    if (location.pathname !== '/quiz') {
      logSelfCheck('No-Quiz-No-Access', 'PASS', 'redirecting to quiz');
      navigate('/quiz', { replace: true });
    } else {
      logSelfCheck('No-Quiz-No-Access', 'FAIL', 'already on quiz page');
    }
    return null;
  }
  
  // Self-check: User completed quiz but no access (paywall scenario, skip if access gate disabled)
  if (!disableAccessGate && hasCompletedQuiz && !hasAccess) {
    if (location.pathname !== '/') {
      logSelfCheck('Quiz-Complete-No-Access', 'PASS', 'redirecting to paywall');
      navigate('/', { replace: true });
    } else {
      logSelfCheck('Quiz-Complete-No-Access', 'FAIL', 'already on paywall');
    }
    return null;
  }
  
  // Self-check: If we reach here and any gates are disabled, allow access
  if (disableAuthGate || disableQuizGate || disableAccessGate) {
    logSelfCheck('Individual-Gate-Bypass', 'PASS', 'specific gate disabled');
    return <>{children}</>;
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
              <QABottomBanner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/shared/:shareToken" element={<SharedAnalysis />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
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
