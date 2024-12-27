import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import ChatInterface from "./components/ChatInterface";
import PlantHealthAnalyzer from "./pages/PlantHealthAnalyzer";
import SharedAnalysis from "./pages/SharedAnalysis";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const location = useLocation();
  
  if (!session) {
    // Redirect to home page but preserve the intended destination
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/callback" element={<Index />} />
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
            <Route path="/shared/:token" element={<SharedAnalysis />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;