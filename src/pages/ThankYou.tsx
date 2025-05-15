
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { useSession } from "@supabase/auth-helpers-react";

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [processingAuth, setProcessingAuth] = useState(false);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);
  
  // Handle successful authentication
  useEffect(() => {
    const handleSuccessfulAuth = async () => {
      if (session && !processingAuth) {
        setProcessingAuth(true);
        try {
          console.log("Authentication successful, activating subscription...");
          toast.info("Setting up your account...");
          
          // Call the edge function to activate subscription
          const { error } = await supabase.functions.invoke('mark-quiz-completed', {
            body: {
              user_id: session.user.id,
              email: session.user.email
              // subscription_type parameter removed
            }
          });
          
          if (error) throw error;
          
          toast.success("Your subscription has been activated!");
          console.log("Subscription activated successfully, redirecting to chat...");
          
          // Short delay before redirect to ensure toast is visible
          setTimeout(() => {
            navigate('/chat');
          }, 1500);
        } catch (error) {
          console.error("Error activating subscription:", error);
          toast.error("There was an issue activating your subscription. Please contact support.");
        } finally {
          setProcessingAuth(false);
        }
      }
    };
    
    handleSuccessfulAuth();
  }, [session, navigate, processingAuth]);
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data: signUpData,
        error: signUpError
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            // Mark user as having completed quiz automatically
            has_completed_quiz: true
          }
        }
      });
      
      if (signUpError) {
        // If user already exists, try to sign in
        if (signUpError.message.includes('User already registered')) {
          const {
            error: signInError
          } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (signInError) throw signInError;

          toast.success("Welcome back! Your subscription will be activated.");
          return;
        }
        throw signUpError;
      }
      
      toast.success("Account created successfully!");
      toast.info("Please check your email for a confirmation link.");
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // Store only completed quiz flag and email in session storage
      sessionStorage.setItem('mg_has_completed_quiz', 'true');
      if (email) {
        sessionStorage.setItem('mg_pending_email', email);
      }
      
      const {
        error
      } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      toast.success("Continuing with Google authentication...");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };
  
  return <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="border border-primary/20">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Thank you for your purchase!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">Thank you for your purchase! Enter your Email and Password and Click the Sign Up button or Click the Sign in with Google button below to set up your account. Please be sure to use the same email address or Google Account (gmail) you used for your purchase:</p>

            <AuthForm 
              email={email} 
              password={password} 
              loading={loading || processingAuth} 
              showPassword={showPassword} 
              isSignUp={true} 
              onEmailChange={setEmail} 
              onPasswordChange={setPassword} 
              onTogglePassword={() => setShowPassword(!showPassword)} 
              onSubmit={handleAuth} 
              onToggleMode={() => {}} // Disabled for this flow
              onGoogleSignIn={handleGoogleSignIn} 
            />
          </CardContent>
        </Card>
      </div>
    </div>;
};

export default ThankYou;
