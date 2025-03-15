
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "./auth/AuthForm";
import { getRedirectUrl } from "@/utils/urlUtils";
import { toast } from "sonner";

// Feature flag to control whether quiz completion and subscription are required
const REQUIRE_QUIZ_AND_SUBSCRIPTION = import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';

const AuthUI = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [hasPendingSubscription, setHasPendingSubscription] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState("");
  const [canSignUp, setCanSignUp] = useState(!REQUIRE_QUIZ_AND_SUBSCRIPTION);
  const navigate = useNavigate();

  // Check if quiz has been completed
  useEffect(() => {
    // If feature flag is off, always allow sign up regardless of quiz
    if (!REQUIRE_QUIZ_AND_SUBSCRIPTION) {
      setCanSignUp(true);
      return;
    }

    const quizResponses = sessionStorage.getItem('mg_temp_quiz_responses');
    if (!quizResponses && isSignUp) {
      toast.error("Please complete the quiz first before signing up");
      navigate('/quiz');
    } else if (quizResponses && isSignUp) {
      setCanSignUp(true);
    }
  }, [isSignUp, navigate]);

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
          if (isSignUp) {
            setCanSignUp(true);
          }
        } else {
          setHasPendingSubscription(false);
          setSubscriptionType("");
          if (isSignUp && REQUIRE_QUIZ_AND_SUBSCRIPTION) {
            toast.error("Please purchase a subscription before signing up");
            // Redirect to quiz which will show subscription options after completion
            navigate('/quiz');
            setCanSignUp(false);
          }
        }
      } catch (error) {
        console.error('Error checking pending subscription:', error);
      }
    };

    if (isSignUp) {
      checkPendingSubscription();
    }
  }, [email, isSignUp, navigate]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event);
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
        if (REQUIRE_QUIZ_AND_SUBSCRIPTION) {
          // Always check if quiz is completed and subscription exists for sign up
          const quizResponses = sessionStorage.getItem('mg_temp_quiz_responses');
          if (!quizResponses) {
            toast.error("Please complete the quiz first before signing up");
            navigate('/quiz');
            setLoading(false);
            return;
          }

          // Check if there's a pending subscription for this email
          if (!hasPendingSubscription) {
            toast.error("Please purchase a subscription before signing up");
            navigate('/quiz');
            setLoading(false);
            return;
          }
        }

        const redirectUrl = getRedirectUrl();
        
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

        // Only save quiz responses if they exist
        const quizResponses = sessionStorage.getItem('mg_temp_quiz_responses');
        if (quizResponses) {
          const quizResponsesData = JSON.parse(quizResponses);
          const { error: quizError } = await supabase
            .from('quiz_responses')
            .insert([{
              ...quizResponsesData,
              user_id: (await supabase.auth.getUser()).data.user?.id
            }]);

          if (quizError) throw quizError;
          
          // Clear temporary storage
          sessionStorage.removeItem('mg_temp_quiz_responses');
        }
        
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
      
      if (isSignUp && REQUIRE_QUIZ_AND_SUBSCRIPTION) {
        // Check if quiz is completed for sign up via OAuth
        const quizResponses = sessionStorage.getItem('mg_temp_quiz_responses');
        if (!quizResponses) {
          toast.error("Please complete the quiz first before signing up");
          navigate('/quiz');
          setLoading(false);
          return;
        }
        
        // Check if there's a pending subscription for this email
        if (!hasPendingSubscription) {
          toast.error("Please purchase a subscription before signing up with Google");
          navigate('/quiz');
          setLoading(false);
          return;
        }
      }
      
      // Get the redirect URL
      const redirectUrl = getRedirectUrl();
      console.log("OAuth redirect URL:", redirectUrl);
      
      // Sign in with Google
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
      
      // This toast may not be seen as we're redirecting
      toast.success("Redirecting to Google authentication...");
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
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
