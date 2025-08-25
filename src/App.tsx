
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
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

// Route guard component to enforce quiz -> auth -> paywall flow
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const location = useLocation();
  const { hasCompletedQuiz, hasAccess, isLoading } = useSubscriptionStatus();
  
  // Skip checks in iOS preview mode
  if (isIOSPreview) {
    return <>{children}</>;
  }
  
  // Allow access to public routes always
  const publicRoutes = ['/shared', '/privacy', '/terms'];
  const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));
  
  if (isPublicRoute) {
    return <>{children}</>;
  }
  
  // Always allow quiz access (regardless of auth status)
  if (location.pathname === '/quiz') {
    return <>{children}</>;
  }
  
  // Allow landing page access
  if (location.pathname === '/') {
    return <>{children}</>;
  }
  
  // For protected routes, check the flow
  
  // If loading, show nothing to prevent flash
  if (isLoading) {
    return null;
  }
  
  // 1. User must be signed in first
  if (!session) {
    return <Navigate to="/" replace />;
  }
  
  // 2. If user has active subscription (including Apple App Store), allow access even without quiz
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // 3. If user doesn't have subscription, they must complete quiz first
  if (!hasCompletedQuiz) {
    return <Navigate to="/quiz" replace />;
  }
  
  // 4. If quiz completed but no access, redirect to paywall (Index page)
  return <Navigate to="/" replace />;
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
