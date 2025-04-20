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
      
      // Store email for subscription activation
      if (email) {
        sessionStorage.setItem('mg_pending_email', email);
      }
      
      sessionStorage.setItem('redirectTo', '/chat');
      sessionStorage.setItem('requiresAuthCheck', 'true');
      
      // Prepare query parameters for the OAuth flow
      const queryParams: {
        access_type: string;
        prompt: string;
        has_completed_quiz?: string;
        subscription_type?: string;
        email?: string;
      } = {
        access_type: 'offline',
        prompt: 'consent',
      };
      
      // If we have subscription info, add it to the query params
      if (hasPendingSubscription) {
        queryParams.has_completed_quiz = 'true';
        queryParams.subscription_type = subscriptionType;
        
        // Also include the email so we can match it with the pending subscription
        if (email) {
          queryParams.email = email;
        }
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: queryParams,
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

  const handleTestEmailVerification = async () => {
    try {
      setLoading(true);
      const email = "eliduffy@gmail.com"; // Hardcoded email for testing
      
      const response = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email, 
          testMode: true 
        },
      });

      console.log("Test email verification response:", response);
      
      if (response.data) {
        toast.success("Test verification email generated successfully!");
      } else {
        toast.error("Failed to generate test verification email");
      }
    } catch (error) {
      console.error("Error in test email verification:", error);
      toast.error("Error generating test verification email");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestSubscription = async () => {
    try {
      setLoading(true);
      const testEmail = email || "eliduffy@gmail.com"; // Use entered email or default to test email
      
      console.log("Creating test subscription for:", testEmail);
      
      const response = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email: testEmail, 
          createTestSubscription: true
        },
      });

      console.log("Test subscription response:", response);
      
      if (response.data) {
        // If we have a verification link in the response, display it
        const verificationLink = response.data?.meta?.verificationLink;
        
        if (verificationLink) {
          console.log("Verification link for testing:", verificationLink);
        }
        
        toast.success(`Test subscription created for ${testEmail}! Check logs for verification link.`);
        
        // Set the email field to the test email if it wasn't already set
        if (!email) {
          setEmail(testEmail);
        }
      } else {
        toast.error("Failed to create test subscription");
      }
    } catch (error) {
      console.error("Error creating test subscription:", error);
      toast.error("Error creating test subscription");
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
      
      {import.meta.env.DEV && (
        <div className="mt-4 space-y-2">
          <button
            onClick={handleTestEmailVerification}
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
          >
            {loading ? "Processing..." : "Send Test Verification Email"}
          </button>
          
          <button
            onClick={handleCreateTestSubscription}
            disabled={loading}
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition-colors"
          >
            {loading ? "Processing..." : "Create Test Subscription"}
          </button>
          
          <div className="p-2 bg-yellow-600/20 rounded text-xs text-white/80">
            <p className="font-semibold">Developer Testing Guide:</p>
            <ol className="list-decimal pl-4 mt-1 space-y-1">
              <li>Enter an email (or leave empty for default test email)</li>
              <li>Click "Create Test Subscription" to simulate a purchase</li>
              <li>Sign up with the same email (subscription will be activated)</li>
              <li>Check console logs for full details</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthUI;
