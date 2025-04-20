import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "./auth/AuthForm";
import { getRedirectUrl } from "@/utils/urlUtils";
import { toast } from "sonner";

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

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && REQUIRE_QUIZ_AND_SUBSCRIPTION) {
        try {
          const { data, error } = await supabase
            .from('user_access_view')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;
          
          if (!data.has_active_subscription || !data.has_completed_quiz) {
            console.log("User does not meet requirements:", data);
            await supabase.auth.signOut();
            if (!data.has_completed_quiz) {
              toast.error("Please complete the quiz first");
              navigate('/quiz');
            } else {
              toast.error("Active subscription required");
              navigate('/quiz');
            }
          }
        } catch (error) {
          console.error("Error checking access:", error);
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  useEffect(() => {
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

  useEffect(() => {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change in AuthUI:", event);
      
      if (event === 'SIGNED_IN' && session) {
        if (REQUIRE_QUIZ_AND_SUBSCRIPTION) {
          try {
            const { data, error } = await supabase
              .from('user_access_view')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) throw error;
            
            if (!data.has_active_subscription || !data.has_completed_quiz) {
              console.log("New login doesn't meet requirements:", data);
              
              await supabase.auth.signOut();
              
              if (!data.has_completed_quiz) {
                toast.error("Please complete the quiz first");
                navigate('/quiz');
                return;
              } else {
                toast.error("Active subscription required");
                navigate('/quiz');
                return;
              }
            }
          } catch (error) {
            console.error("Error checking access on sign in:", error);
          }
        }
        
        console.log("User signed in, redirecting...");
        
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
          const quizResponses = sessionStorage.getItem('mg_temp_quiz_responses');
          if (!quizResponses) {
            toast.error("Please complete the quiz first before signing up");
            navigate('/quiz');
            setLoading(false);
            return;
          }

          if (!hasPendingSubscription) {
            toast.error("Please purchase a subscription before signing up");
            navigate('/quiz');
            setLoading(false);
            return;
          }
        }

        const redirectUrl = getRedirectUrl();
        console.log("Signup attempt with email:", email);
        
        try {
          const response = await supabase.functions.invoke('send-verification-email', {
            body: { email },
          });

          console.log("Verification email function response:", response);
          
          if (response.error) {
            throw new Error(`Edge function error: ${response.error.message}`);
          }

          if (!response.data || !response.data.data) {
            throw new Error('Invalid response from verification function');
          }

          const isExistingUser = response.data.type === 'magiclink';
          
          if (isExistingUser) {
            toast.info("We noticed you already have an account. A magic link has been sent to your email.");
          } else {
            const { error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: redirectUrl,
              }
            });

            if (signUpError) throw signUpError;
            
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
              
              sessionStorage.removeItem('mg_temp_quiz_responses');
            }
            
            toast.success("Account created! Please check your email for verification.");
            
            if (hasPendingSubscription) {
              toast.success(`Your ${subscriptionType} subscription has been activated!`);
            }
          }
        } catch (edgeFunctionError) {
          console.error("Edge function error:", edgeFunctionError);
          toast.error(`Email verification error: ${edgeFunctionError.message}`);
          
          toast.info("Trying standard signup as fallback...");
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: redirectUrl,
            }
          });

          if (signUpError) {
            throw signUpError;
          } else {
            toast.success("Account created! Please check your email for verification.");
          }
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
      console.error("Authentication error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async () => {
    try {
      setLoading(true);
      
      if (isSignUp && REQUIRE_QUIZ_AND_SUBSCRIPTION) {
        const quizResponses = sessionStorage.getItem('mg_temp_quiz_responses');
        if (!quizResponses) {
          toast.error("Please complete the quiz first before signing up");
          navigate('/quiz');
          setLoading(false);
          return;
        }
        
        if (!hasPendingSubscription) {
          toast.error("Please purchase a subscription before signing up with Google");
          navigate('/quiz');
          setLoading(false);
          return;
        }
      }
      
      const redirectUrl = getRedirectUrl();
      console.log("OAuth redirect URL:", redirectUrl);
      
      sessionStorage.setItem('redirectTo', '/chat');
      sessionStorage.setItem('requiresAuthCheck', 'true');
      
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
