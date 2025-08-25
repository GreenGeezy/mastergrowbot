
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
import { isIOSPreview } from '@/utils/flags';

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

// Route guard component with exact check order
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const { hasCompletedQuiz, hasAccess, isLoading } = useSubscriptionStatus();
  
  // Read existing runtime flags without adding new ones
  const requireQuizAndSubscription = import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';
  
  // 1. If in iOS preview mode → allow immediately
  if (isIOSPreview) {
    return <>{children}</>;
  }
  
  // If runtime flags disable the quiz and subscription gates → allow immediately
  if (!requireQuizAndSubscription) {
    return <>{children}</>;
  }
  
  // 2. If on a public route → allow
  const publicRoutes = ['/shared', '/privacy', '/terms'];
  const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));
  if (isPublicRoute) {
    return <>{children}</>;
  }
  
  // 3. If on the quiz route → allow
  if (location.pathname === '/quiz') {
    return <>{children}</>;
  }
  
  // 4. If on the landing page → allow
  if (location.pathname === '/') {
    return <>{children}</>;
  }
  
  // For all other routes, run the protection checks:
  
  // 5. If the subscription/status hook is still loading → render nothing (no flash)
  if (isLoading) {
    return null;
  }
  
  // 6. If the user is not signed in and sign-in is required → navigate to the existing sign-in screen
  if (!session) {
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
    }
    return null;
  }
  
  // 7. If the user has active access (trial or subscription) → allow immediately (bypass the quiz requirement)
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // 8. If the quiz gate is enabled and the user has not completed the quiz → navigate to the quiz
  if (!hasCompletedQuiz) {
    if (location.pathname !== '/quiz') {
      navigate('/quiz', { replace: true });
    }
    return null;
  }
  
  // 9. If access is required and the user still has no active access → navigate to the paywall
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
