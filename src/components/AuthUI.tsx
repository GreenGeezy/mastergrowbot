
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "./auth/AuthForm";
import { getRedirectUrl } from "@/utils/urlUtils";
import { toast } from "sonner";

// Feature flag to control whether quiz completion and subscription are required
// Set to false to bypass quiz requirement
const REQUIRE_QUIZ_AND_SUBSCRIPTION = false;

const AuthUI = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [hasPendingSubscription, setHasPendingSubscription] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState("");
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        // If there's already a session, redirect to chat
        console.log('[AuthUI] Existing session found, redirecting to chat');
        navigate('/chat', { replace: true });
      }
    };
    
    checkExistingSession();
  }, [navigate]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthUI] Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('[AuthUI] User signed in, redirecting');
        // Get redirect URL from sessionStorage or default to chat
        const redirectTo = sessionStorage.getItem('redirectTo') || '/chat';
        sessionStorage.removeItem('redirectTo');
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

        // Call the verification email function
        const response = await supabase.functions.invoke('send-verification-email', {
          body: { email },
        });

        if (response.error) throw new Error(response.error.message);
        
        toast.success("Account created! Please check your email for verification.");
        
        // Show subscription status if applicable
        if (hasPendingSubscription) {
          toast.success(`Your ${subscriptionType} subscription has been activated!`);
        }
      } else {
        // For sign in, we don't need to check for quiz or subscription
        console.log('[AuthUI] Signing in with email:', email);
        
        const { error: signInError, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        
        console.log('[AuthUI] Login successful, user:', data.user?.id);
        toast.success("Welcome back!");
        
        // Force navigate to chat after successful login
        navigate('/chat', { replace: true });
      }
    } catch (error) {
      console.error('[AuthUI] Auth error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async () => {
    try {
      setLoading(true);
      
      const redirectUrl = getRedirectUrl();
      console.log('[AuthUI] Using redirect URL for OAuth:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
    } catch (error) {
      toast.error("Failed to sign in with Google. Please try again.");
      console.error("[AuthUI] Google sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black/40 p-6 rounded-lg backdrop-blur-sm border border-primary/20">
      {REQUIRE_QUIZ_AND_SUBSCRIPTION && isSignUp && !hasPendingSubscription && (
        <div className="mb-4 p-3 bg-yellow-600/20 rounded-md border border-yellow-600/30">
          <p className="text-white text-sm">
            You need to purchase a subscription before signing up. Please complete the quiz to see subscription options.
          </p>
        </div>
      )}
      
      {hasPendingSubscription && (
        <div className="mb-4 p-3 bg-primary/20 rounded-md border border-primary/30">
          <p className="text-white text-sm">
            A <span className="font-bold">{subscriptionType}</span> subscription is ready to be activated with this email!
          </p>
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
