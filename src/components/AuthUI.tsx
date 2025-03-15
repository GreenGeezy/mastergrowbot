
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const checkExistingSession = async () => {
      console.log('[AuthUI] Checking for existing session');
      setCheckingSession(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          console.log('[AuthUI] Existing session found, user ID:', data.session.user.id);
          const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
          sessionStorage.removeItem('redirectTo');
          console.log('[AuthUI] Redirecting to:', redirectTo);
          navigate(redirectTo, { replace: true });
        } else {
          console.log('[AuthUI] No existing session found');
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
    // Check URL for error params from failed OAuth
    const checkUrlForErrors = () => {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get('error');
      const errorDescription = params.get('error_description');
      
      if (errorParam) {
        console.error(`[AuthUI] Auth error from URL: ${errorParam} - ${errorDescription}`);
        setAuthError(errorDescription || errorParam);
        toast.error(errorDescription || 'Authentication failed');
      }
    };
    
    checkUrlForErrors();
    
    // Subscribe to auth state changes - critical for OAuth flows
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthUI] Auth state changed:', event, session ? `Session exists for user ${session.user.id}` : 'No session');
      
      if (event === 'SIGNED_IN' && session) {
        console.log('[AuthUI] User signed in, redirecting to saved location');
        const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
        sessionStorage.removeItem('redirectTo');
        console.log('[AuthUI] Redirecting to:', redirectTo);
        // Force immediate navigation with no delay
        navigate(redirectTo, { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (isSignUp) {
        const redirectUrl = getRedirectUrl();
        console.log('[AuthUI] Using redirect URL for signup:', redirectUrl);
        
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          }
        });

        if (signUpError) throw signUpError;
        
        console.log('[AuthUI] Signup successful, user:', data.user?.id);
        toast.success("Account created! Please check your email for verification.");
      } else {
        console.log('[AuthUI] Signing in with email:', email);
        
        const { error: signInError, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        
        console.log('[AuthUI] Login successful, user:', data.user?.id);
        toast.success("Welcome back!");
      }
    } catch (error: any) {
      console.error('[AuthUI] Auth error:', error);
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
      console.log('[AuthUI] Using redirect URL for OAuth:', redirectUrl);
      
      // Enhanced logging for Google OAuth
      console.log('[AuthUI] Starting Google OAuth flow', { redirectUrl });
      
      // Save the current page to redirect back after login
      sessionStorage.setItem('redirectTo', '/chat');
      
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      console.log('[AuthUI] OAuth request complete', { error, data });
      
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
