
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
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if quiz is completed
      const quizResponses = sessionStorage.getItem('mg_temp_quiz_responses');
      if (!quizResponses) {
        toast.error("Please complete the quiz first before signing up");
        navigate('/quiz');
        return;
      }

      const redirectUrl = getRedirectUrl();
      
      if (isSignUp) {
        // Check for pending subscription
        const { data: pendingSub, error: pendingError } = await supabase
          .rpc('check_pending_subscription', { check_email: email });

        if (pendingError) throw pendingError;

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

        // Store quiz responses to database after successful signup
        const parsedResponses = JSON.parse(quizResponses);
        const { error: quizError } = await supabase
          .from('quiz_responses')
          .insert([{
            ...parsedResponses,
            user_id: (await supabase.auth.getUser()).data.user?.id
          }]);

        if (quizError) throw quizError;

        // If there was a pending subscription, consume it and create active subscription
        if (pendingSub?.length > 0) {
          const { error: consumeError } = await supabase
            .rpc('consume_pending_subscription', { sub_email: email });

          if (consumeError) throw consumeError;

          const { error: subError } = await supabase
            .from('subscriptions')
            .insert([{
              user_id: (await supabase.auth.getUser()).data.user?.id,
              subscription_type: pendingSub[0].subscription_type,
              expires_at: pendingSub[0].expires_at,
              status: 'active'
            }]);

          if (subError) throw subError;
        }

        // Clear temporary storage
        sessionStorage.removeItem('mg_temp_quiz_responses');
        
        toast.success("Account created! Please check your email for verification.");
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
