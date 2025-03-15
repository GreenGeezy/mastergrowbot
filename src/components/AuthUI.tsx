
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
  const [canSignUp, setCanSignUp] = useState(true); // Always true now
  const navigate = useNavigate();

  // Check if email has a pending subscription when email changes
  useEffect(() => {
    // If feature flag is off, skip subscription check
    if (!REQUIRE_QUIZ_AND_SUBSCRIPTION) {
      return;
    }

    const checkPendingSubscription = async () => {
      if (!email || email.trim() === "") {
        setHasPendingSubscription(false);
        setSubscriptionType("");
        return;
      }
      
      try {
        const { data, error } = await supabase
          .rpc('get_pending_subscription', { email_address: email });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setHasPendingSubscription(true);
          setSubscriptionType(data[0].subscription_type);
        } else {
          setHasPendingSubscription(false);
          setSubscriptionType("");
        }
      } catch (error) {
        console.error('Error checking pending subscription:', error);
      }
    };

    if (isSignUp) {
      checkPendingSubscription();
    }
  }, [email, isSignUp]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
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
        console.log('Using redirect URL for signup:', redirectUrl);
        
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          }
        });

        if (signUpError) throw signUpError;

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
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        toast.success("Welcome back!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async () => {
    try {
      setLoading(true);
      
      const redirectUrl = getRedirectUrl();
      console.log('Using redirect URL for OAuth:', redirectUrl);
      
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
      console.error("Google sign-in error:", error);
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
