
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [subscriptionType, setSubscriptionType] = useState<string>("basic");
  const [isCompleteButtonDisabled, setIsCompleteButtonDisabled] = useState(false);
  
  // Parse location search params to get email and subscription info
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get("email");
    const subType = searchParams.get("subscription_type") || "basic";
    
    if (emailParam) {
      setEmail(emailParam);
    }
    setSubscriptionType(subType);
    
    console.log("ThankYou component mounted with params:", {
      email: emailParam,
      subscriptionType: subType
    });
  }, [location.search]);

  // Check if feature flag for quiz/subscription is enabled
  const isQuizAndSubscriptionRequired = 
    import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';

  const handleCompleteRegistration = async () => {
    if (!email) {
      toast.error("Email is required to complete registration");
      return;
    }

    setIsCompleteButtonDisabled(true);
    
    try {
      // If quiz is required and user hasn't completed it yet
      if (isQuizAndSubscriptionRequired) {
        // Check if there's quiz data saved in session storage
        const quizData = sessionStorage.getItem('mg_temp_quiz_responses');
        
        if (!quizData) {
          toast.info("Please complete the quiz before registering");
          navigate("/quiz?email=" + encodeURIComponent(email));
          return;
        }
      }
      
      // Redirect to signup with email pre-filled
      navigate("/?signup=true&email=" + encodeURIComponent(email));
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsCompleteButtonDisabled(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background circuit pattern */}
      <div className="absolute inset-0 circuit-background opacity-30" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Master Growbot Logo */}
        <div className="mb-8 animate-float">
          <img 
            src="/lovable-uploads/5d3166aa-c15c-4e67-9f65-aa1d7109581d.png" 
            alt="Master Growbot" 
            className="w-32 h-32 object-contain filter drop-shadow-xl"
          />
        </div>

        {/* Success Card with glowing effect */}
        <Card className="border border-primary/20 bg-card/90 backdrop-blur-sm shadow-xl animate-fade-in relative overflow-hidden w-full">
          {/* Glowing border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse-glow" />
          
          <div className="relative"> {/* Content wrapper for z-index ordering */}
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow relative">
                {/* Animated glow effect for check icon */}
                <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse-wave" />
                <Check className="w-10 h-10 text-primary-glow animate-float" />
              </div>
              <CardTitle className="text-3xl font-bold tech-font bg-clip-text text-transparent bg-gradient-to-r from-primary-glow via-white to-primary-glow animate-shimmer">
                Thank you for your purchase!
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-6 px-6">
              <p className="text-white/90 text-lg">
                Your {subscriptionType} subscription is now active. You're one step away from accessing your premium features.
              </p>
              
              {email && (
                <div className="bg-card-hover/60 p-5 rounded-lg border border-primary/20 mt-4 backdrop-blur-sm shimmer">
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <Mail className="w-5 h-5 text-accent animate-pulse-glow" />
                    <p>
                      We've saved your access for <span className="font-semibold text-white">{email}</span>. 
                      Use this email when signing up.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-5 px-6 pb-6">
              <Button 
                onClick={handleCompleteRegistration} 
                className="w-full group relative overflow-hidden cyber-button bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300"
                size="lg"
                disabled={isCompleteButtonDisabled}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-lg py-1">
                  {isCompleteButtonDisabled ? "Processing..." : "Complete your registration"}
                  {!isCompleteButtonDisabled && (
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  )}
                </span>
              </Button>
              
              <div className="bg-card-hover/40 rounded-md p-3 border border-white/10">
                <p className="text-sm text-white/60 text-center">
                  {isQuizAndSubscriptionRequired 
                    ? "You'll need to complete a quick growing quiz before creating your account."
                    : "Your access code has been saved. Use the same email when signing up."}
                </p>
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ThankYou;
