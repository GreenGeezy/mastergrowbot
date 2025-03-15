import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthForm } from "./auth/AuthForm";
import { getRedirectUrl } from "@/utils/urlUtils";
import { toast } from "sonner";

const AuthUI = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkExistingSession = async () => {
      setCheckingSession(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
          sessionStorage.removeItem('redirectTo');
          navigate(redirectTo, { replace: true });
        }
      } catch (error) {
        console.error('[AuthUI] Error checking session:', error);
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkExistingSession();
  }, [navigate]);

  useEffect(() => {
    // Check URL for error parameters
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (errorParam) {
      setAuthError(errorDescription || errorParam);
      toast.error(errorDescription || 'Authentication failed');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
        sessionStorage.removeItem('redirectTo');
        navigate(redirectTo, { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (isSignUp) {
        const redirectUrl = getRedirectUrl();
        
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          }
        });

        if (signUpError) throw signUpError;
        
        toast.success("Account created! Please check your email for verification.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        
        toast.success("Welcome back!");
      }
    } catch (error: any) {
      setAuthError(error.message);
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const redirectUrl = getRedirectUrl();
      
      // Save the current page to redirect back after login
      sessionStorage.setItem('redirectTo', '/chat');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("[AuthUI] Google sign-in error:", error);
      setAuthError(error.message);
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="w-full max-w-md mx-auto bg-black/40 p-6 rounded-lg backdrop-blur-sm border border-primary/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-black/40 p-6 rounded-lg backdrop-blur-sm border border-primary/20">
      {authError && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
          <p className="text-red-300 text-sm">{authError}</p>
        </div>
      )}
      <AuthForm
        email={email}
        password={password}
        loading={loading}
        showPassword={showPassword}
        isSignUp={isSignUp}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onSubmit={handleAuth}
        onToggleMode={() => setIsSignUp(!isSignUp)}
        onGoogleSignIn={handleOAuthSignIn}
      />
    </div>
  );
};

export default AuthUI;
