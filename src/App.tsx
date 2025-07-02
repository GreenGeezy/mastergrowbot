import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "sonner";

import Index from "./pages/Index";
import ChatInterface from "./pages/Chat";
import PlantHealthAnalyzer from "./pages/PlantHealth";
import GrowingGuide from "./pages/GrowingGuide";
import Quiz from "./pages/Quiz";
import SharedAnalysis from "./pages/SharedAnalysis";
import PrivacyPolicy from "./pages/Privacy";
import TermsOfService from "./pages/Terms";
import ThankYou from "./pages/ThankYou";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
const queryClient = new QueryClient();
import Settings from "@/pages/Settings";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
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
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
