
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
      
      {/* Subtle cannabis-related background elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {/* Large central leaf silhouette */}
        <div className="absolute transform -translate-y-12 opacity-10">
          <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-glow">
            <path d="M250 40C230 90 200 130 180 150C160 170 130 200 120 240C110 280 110 320 120 350C130 380 150 400 180 420C210 440 240 450 270 450C300 450 330 440 350 420C370 400 390 370 400 340C410 310 410 280 400 250C390 220 370 200 350 180C330 160 300 140 280 120C260 100 240 80 250 40Z" 
                  fill="currentColor" fillOpacity="0.2" />
            <path d="M250 100C240 120 230 140 215 160C200 180 180 200 170 220C160 240 150 260 150 280C150 300 160 320 175 335C190 350 210 360 230 360C250 360 270 350 285 335C300 320 310 300 310 280C310 260 300 240 290 220C280 200 260 180 245 160C230 140 220 120 250 100Z" 
                  fill="currentColor" fillOpacity="0.3" />
          </svg>
        </div>
        
        {/* Secondary scattered smaller leaves */}
        <div className="absolute top-1/4 right-1/4 opacity-8">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary rotate-45">
            <path d="M60 10C55 22 48 31 43 36C38 41 31 48 29 58C27 67 27 77 29 84C31 91 36 96 43 101C50 106 58 108 65 108C72 108 79 106 84 101C89 96 94 89 96 82C98 74 98 67 96 60C94 53 89 48 84 43C79 38 72 34 67 29C62 24 58 19 60 10Z" 
                  fill="currentColor" fillOpacity="0.15" />
          </svg>
        </div>
        
        <div className="absolute bottom-1/3 left-1/4 opacity-8">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-secondary rotate-12">
            <path d="M50 8C46 18 40 26 36 30C32 34 26 40 24 48C22 56 22 64 24 70C26 76 30 80 36 84C42 88 48 90 54 90C60 90 66 88 70 84C74 80 78 74 80 68C82 62 82 56 80 50C78 44 74 40 70 36C66 32 60 28 56 24C52 20 48 16 50 8Z" 
                  fill="currentColor" fillOpacity="0.15" />
          </svg>
        </div>
        
        {/* Abstract growth pattern lines */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M500 100C500 300 600 500 700 600C800 700 900 800 900 900" stroke="#2D5A27" strokeWidth="2" strokeDasharray="10 15" />
            <path d="M500 100C500 300 400 500 300 600C200 700 100 800 100 900" stroke="#2D5A27" strokeWidth="2" strokeDasharray="10 15" />
            <path d="M500 100C500 400 550 550 600 650C650 750 700 850 750 950" stroke="#663399" strokeWidth="2" strokeDasharray="8 12" strokeOpacity="0.5" />
            <path d="M500 100C500 400 450 550 400 650C350 750 300 850 250 950" stroke="#663399" strokeWidth="2" strokeDasharray="8 12" strokeOpacity="0.5" />
          </svg>
        </div>
      </div>

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
