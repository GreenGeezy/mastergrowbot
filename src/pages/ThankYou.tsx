
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import PurchaseNotificationModal from "@/components/auth/PurchaseNotificationModal";
import { isIOSPreview } from "@/utils/flags";
import { AuroraBackground } from "@/components/ui/aurora-background";

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [subscriptionType, setSubscriptionType] = useState<string>("basic");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [hasInvokedFunction, setHasInvokedFunction] = useState(false);
  
  // Skip paywall in iOS preview
  if (isIOSPreview) return null;
  
  // Get token parameters from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get("email");
    const subType = searchParams.get("subscription_type") || "basic";
    const codeParam = searchParams.get("code");
    
    // Validate token against environment variable
    const expectedToken = import.meta.env.VITE_THANKYOU_TOKEN;
    const isTokenValid = codeParam === expectedToken;
    
    // Set validation state
    setHasValidToken(isTokenValid);
    setIsValidating(false);
    
    // Redirect if token is invalid
    if (!isTokenValid) {
      toast.error("Invalid access token");
      navigate('/', { replace: true });
      return;
    }
    
    // If token is valid, set the email and subscription type
    if (emailParam) {
      setEmail(emailParam);
    }
    setSubscriptionType(subType);
  }, [location.search, navigate]);

  // Listen for auth state changes and invoke function on SIGNED_IN
  useEffect(() => {
    if (!hasValidToken) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'User signed in' : 'User signed out');
      
      // Check if user just signed in and we haven't invoked the function yet
      if (event === 'SIGNED_IN' && session?.user && !hasInvokedFunction) {
        try {
          console.log('Invoking mark-quiz-completed for user:', session.user.email || session.user.id);
          setHasInvokedFunction(true);
          
          const { data, error } = await supabase.functions.invoke('mark-quiz-completed', {
            body: { 
              user_id: session.user.id,
              email: session.user.email || email, // Use session email or form email
              subscription_type: subscriptionType 
            }
          });
          
          if (error) {
            console.error('Error invoking mark-quiz-completed:', error);
          } else {
            console.log('Successfully invoked mark-quiz-completed:', data);
            toast.success('Your subscription has been activated!');
            
            // Navigate to chat after a short delay
            setTimeout(() => {
              navigate('/chat');
            }, 1500);
          }
        } catch (err) {
          console.error('Exception when invoking function:', err);
        }
      }
    });
    
    // Clean up subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [hasValidToken, hasInvokedFunction, email, subscriptionType, navigate]);

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
          
          toast.success("Welcome back! Your subscription has been activated.");
          // Don't navigate here - let the auth listener handle it
          return;
        }
        throw signUpError;
      }

      toast.success("Account created successfully!");
      // Don't navigate here - let the auth listener handle it
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
      
      // Store subscription info in session storage instead of passing it in query params
      sessionStorage.setItem('mg_has_completed_quiz', 'true');
      sessionStorage.setItem('mg_subscription_type', subscriptionType);
      if (email) {
        sessionStorage.setItem('mg_pending_email', email);
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
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

  const handleDisabledButtonClick = () => {
    setShowPurchaseModal(true);
  };

  // Show loading state while validating token
  if (isValidating) {
    return (
      <AuroraBackground className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border border-primary/20">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {hasValidToken ? (
                <Check className="w-10 h-10 text-primary" />
              ) : (
                <AlertCircle className="w-10 h-10 text-destructive" />
              )}
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
              disabled={!hasValidToken}
              onDisabledClick={handleDisabledButtonClick}
            />
          </CardContent>
        </Card>
        
        {/* Purchase notification modal */}
        <PurchaseNotificationModal 
          isOpen={showPurchaseModal} 
          onClose={() => setShowPurchaseModal(false)} 
        />
      </div>
    </AuroraBackground>
  );
};

export default ThankYou;
