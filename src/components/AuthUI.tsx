
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
  const [hasPendingSubscription, setHasPendingSubscription] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState("");
  const navigate = useNavigate();

  // Check if email has a pending subscription when email changes
  useEffect(() => {
    const checkPendingSubscription = async () => {
      if (!email || email.trim() === "") return;
      
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

    checkPendingSubscription();
  }, [email]);

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
      // Always check if quiz is completed for sign up
      if (isSignUp) {
        const quizResponses = sessionStorage.getItem('mg_temp_quiz_responses');
        if (!quizResponses) {
          toast.error("Please complete the quiz first before signing up");
          navigate('/quiz');
          setLoading(false);
          return;
        }
      }

      const redirectUrl = getRedirectUrl();
      
      if (isSignUp) {
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

        // Store quiz responses - the updated trigger will handle setting has_completed_quiz
        if (isSignUp) {
          const quizResponses = sessionStorage.getItem('mg_temp_quiz_responses');
          if (quizResponses) {
            const parsedResponses = JSON.parse(quizResponses);
            const { error: quizError } = await supabase
              .from('quiz_responses')
              .insert([{
                ...parsedResponses,
                user_id: (await supabase.auth.getUser()).data.user?.id
              }]);

            if (quizError) throw quizError;
            
            // Clear temporary storage
            sessionStorage.removeItem('mg_temp_quiz_responses');
          }
        }
        
        toast.success("Account created! Please check your email for verification.");
        
        // Show subscription status if applicable
        if (hasPendingSubscription) {
          toast.success(`Your ${subscriptionType} subscription has been activated!`);
        }
      } else {
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
      
      // Check if quiz is completed for sign up via OAuth
      const quizResponses = sessionStorage.getItem('mg_temp_quiz_responses');
      if (!quizResponses) {
        toast.error("Please complete the quiz first before signing up");
        navigate('/quiz');
        setLoading(false);
        return;
      }
      
      const redirectUrl = getRedirectUrl();
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

  // If quiz hasn't been completed, redirect to quiz
  useEffect(() => {
    const quizResponses = sessionStorage.getItem('mg_temp_quiz_responses');
    if (!quizResponses) {
      navigate('/quiz');
    }
  }, [navigate]);

  return (
    <div className="w-full max-w-md mx-auto bg-black/40 p-6 rounded-lg backdrop-blur-sm border border-primary/20">
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
