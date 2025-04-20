
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [subscriptionType, setSubscriptionType] = useState<string>("basic");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get("email");
    const subType = searchParams.get("subscription_type") || "basic";
    
    if (emailParam) {
      setEmail(emailParam);
    }
    setSubscriptionType(subType);
  }, [location.search]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            subscription_type: subscriptionType,
            // Mark user as having completed the quiz automatically
            has_completed_quiz: true
          }
        }
      });

      if (signUpError) {
        // If user already exists, try to sign in
        if (signUpError.message.includes('User already registered')) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) throw signInError;
          
          // Update user metadata to include has_completed_quiz=true
          await supabase.functions.invoke('mark-quiz-completed', {
            body: { email }
          });
          
          toast.success("Welcome back! Your subscription has been activated.");
          navigate('/chat');
          return;
        }
        throw signUpError;
      }

      toast.success("Account created successfully!");
      navigate('/chat');
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            subscription_type: subscriptionType,
            has_completed_quiz: "true",
            email: email  // Pass email to help match with the pending subscription
          }
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
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
            <p className="text-center text-muted-foreground">
              Your {subscriptionType} subscription is ready to be activated. Please create your account or sign in to continue.
            </p>

            <AuthForm 
              email={email}
              password={password}
              loading={loading}
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
    </div>
  );
};

export default ThankYou;
