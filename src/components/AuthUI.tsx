
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthForm } from "./auth/AuthForm";
import { getRedirectUrl, handleOAuthError, generateOAuthState } from "@/utils/urlUtils";
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
    // Check URL for auth parameters
    const checkUrlForParams = () => {
      const params = new URLSearchParams(location.search);
      const errorParam = params.get('error');
      const errorDescription = params.get('error_description');
      const code = params.get('code');
      
      // Enhanced logging for debugging
      console.log(`[AuthUI] URL params check - Error: ${errorParam}, Code present: ${!!code}`);
      console.log('[AuthUI] Full current URL:', window.location.href);
      
      if (errorParam) {
        const formattedError = handleOAuthError(errorParam, errorDescription);
        console.error(`[AuthUI] Auth error from URL: ${errorParam} - ${errorDescription}`);
        setAuthError(formattedError);
        toast.error(formattedError || 'Authentication failed');
        
        // Clear the error from URL to prevent showing it again on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      
      // If we have a code in the URL but we're on the main page, process it immediately
      if (code && location.pathname === '/') {
        console.log('[AuthUI] Code found in URL on main page, manually handling');
        handleCodeExchange(code);
        return;
      }
    };
    
    checkUrlForParams();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthUI] Auth state changed:', event, session ? `Session exists for user ${session?.user?.id || 'unknown'}` : 'No session');
      
      if (event === 'SIGNED_IN' && session) {
        console.log('[AuthUI] User signed in, redirecting to saved location');
        const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
        sessionStorage.removeItem('redirectTo');
        console.log('[AuthUI] Redirecting to:', redirectTo);
        
        // Add a delay to ensure everything is settled before navigation
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 100);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);
  
  // Enhanced code exchange handler
  const handleCodeExchange = async (code: string) => {
    try {
      setLoading(true);
      setAuthError(null);
      console.log('[AuthUI] Manually exchanging code for session');
      
      // First, clear local session to prevent conflicts
      await supabase.auth.signOut({ scope: 'local' });
      await new Promise(resolve => setTimeout(resolve, 300)); // Small delay for cleanup
      
      // Now exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('[AuthUI] Error exchanging code:', error);
        toast.error('Failed to complete authentication. Please try again.');
        setAuthError(error.message);
        return;
      }
      
      if (data?.session) {
        console.log('[AuthUI] Successfully exchanged code for session:', data.session.user.id);
        const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
        sessionStorage.removeItem('redirectTo');
        
        // Remove the code from the URL to prevent reuse
        window.history.replaceState({}, document.title, '/');
        
        toast.success('Successfully signed in!');
        navigate(redirectTo, { replace: true });
      } else {
        console.error('[AuthUI] No session returned after code exchange');
        toast.error('Authentication failed. Please try again.');
        setAuthError('No session returned from authentication');
      }
    } catch (error: any) {
      console.error('[AuthUI] Exception during code exchange:', error);
      toast.error('An unexpected error occurred');
      setAuthError(error.message || 'Failed to complete authentication');
    } finally {
      setLoading(false);
    }
  };

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
      
      // Save the current page to redirect back after login
      sessionStorage.setItem('redirectTo', '/chat');
      
      // Temporary bug fix: Clear local session to prevent state conflicts
      await supabase.auth.signOut({ scope: 'local' });
      
      // Generate a consistent state parameter to prevent state mismatches
      const stateParam = generateOAuthState();
      
      // Enhanced OAuth call with detailed query params to ensure fresh flow
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            // These ensure a fresh auth flow each time
            access_type: 'offline',
            prompt: 'consent select_account',  // Force account selection & consent
            state: stateParam,
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
