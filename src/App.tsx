
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "sonner";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { WalkthroughProvider } from "@/contexts/WalkthroughContext";
import { WalkthroughManager } from "@/components/walkthrough/WalkthroughManager";
import { Waves } from "@/components/Waves";

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <WalkthroughProvider>
          <div className="App relative overflow-hidden">
            <Waves 
              className="absolute inset-0 z-[-10] overflow-hidden" 
            />
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="/plant-health" element={<PlantHealthAnalyzer />} />
                <Route path="/grow-guide" element={<GrowingGuide />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/shared/:shareToken" element={<SharedAnalysis />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/thank-you" element={<ThankYou />} />
              </Routes>
              <WalkthroughManager />
            </BrowserRouter>
          </div>
        </WalkthroughProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
