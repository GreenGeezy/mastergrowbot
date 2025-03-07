
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
      
      {/* Enhanced cannabis-related icon elements with improved positioning and styling */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Top-right icon - Main chemistry/cannabis icon */}
        <div className="absolute top-[12%] right-[15%] w-36 h-36 opacity-20 animate-float transform rotate-6">
          <img 
            src="/lovable-uploads/3454df8d-2c33-4d1d-8bcd-71290c3c10a7.png" 
            alt="Cannabis Science Icon" 
            className="w-full h-full object-contain"
          />
          {/* Connecting line to card */}
          <svg className="absolute -bottom-10 -left-6 w-40 h-40 text-primary/10" viewBox="0 0 100 100">
            <path 
              d="M20 90 Q 40 70, 60 80 T 100 60" 
              stroke="currentColor" 
              strokeWidth="1" 
              fill="none" 
              strokeDasharray="4 4"
              className="animate-circuit-flow"
            />
          </svg>
        </div>
        
        {/* Bottom-left icon - THC Chemistry icon */}
        <div className="absolute bottom-[18%] left-[12%] w-40 h-40 opacity-20 animate-float" style={{ animationDelay: "1.5s" }}>
          <img 
            src="/lovable-uploads/d6780d98-10fa-4593-b3e1-ac414fffc91c.png" 
            alt="THC Chemistry Icon" 
            className="w-full h-full object-contain"
          />
          {/* Connecting curve to card */}
          <svg className="absolute -top-6 right-0 w-32 h-32 text-accent/10" viewBox="0 0 100 100">
            <path 
              d="M10 20 Q 30 40, 50 20 T 90 40" 
              stroke="currentColor" 
              strokeWidth="1" 
              fill="none" 
              strokeDasharray="4 4"
              className="animate-circuit-flow"
              style={{ animationDelay: "0.5s" }}
            />
          </svg>
        </div>
        
        {/* Top-left icon - CBD icon */}
        <div className="absolute top-[20%] left-[15%] w-32 h-32 opacity-20 animate-float" style={{ animationDelay: "2s" }}>
          <img 
            src="/lovable-uploads/9d51bc4c-8b3f-4e08-a954-a5fde33a3d9a.png" 
            alt="CBD Icon" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Bottom-right decorative molecule element */}
        <div className="absolute bottom-[22%] right-[15%] w-28 h-28 opacity-20 animate-float" style={{ animationDelay: "1s" }}>
          <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="8" fill="#4AE54A" opacity="0.8" />
            <circle cx="30" cy="30" r="6" fill="#B24BF3" opacity="0.8" />
            <circle cx="70" cy="30" r="6" fill="#B24BF3" opacity="0.8" />
            <circle cx="30" cy="70" r="6" fill="#B24BF3" opacity="0.8" />
            <circle cx="70" cy="70" r="6" fill="#B24BF3" opacity="0.8" />
            <line x1="50" y1="50" x2="30" y2="30" stroke="#B24BF3" strokeWidth="2" opacity="0.5" />
            <line x1="50" y1="50" x2="70" y2="30" stroke="#B24BF3" strokeWidth="2" opacity="0.5" />
            <line x1="50" y1="50" x2="30" y2="70" stroke="#B24BF3" strokeWidth="2" opacity="0.5" />
            <line x1="50" y1="50" x2="70" y2="70" stroke="#B24BF3" strokeWidth="2" opacity="0.5" />
          </svg>
        </div>
        
        {/* Additional small decorative element middle-right */}
        <div className="absolute top-1/2 right-[10%] transform -translate-y-1/2 opacity-15 animate-float" style={{ animationDelay: "0.7s" }}>
          <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="4" fill="#4AE54A" opacity="0.8" />
            <circle cx="15" cy="15" r="3" fill="#B24BF3" opacity="0.8" />
            <circle cx="35" cy="15" r="3" fill="#B24BF3" opacity="0.8" />
            <line x1="25" y1="25" x2="15" y2="15" stroke="#B24BF3" strokeWidth="1" opacity="0.5" />
            <line x1="25" y1="25" x2="35" y2="15" stroke="#B24BF3" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
        
        {/* Small decorative element middle-left */}
        <div className="absolute top-1/2 left-[10%] transform -translate-y-1/2 opacity-15 animate-float" style={{ animationDelay: "1.2s" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="10" height="10" rx="2" fill="#4AE54A" opacity="0.8" />
            <circle cx="10" cy="10" r="3" fill="#B24BF3" opacity="0.8" />
            <circle cx="30" cy="10" r="3" fill="#B24BF3" opacity="0.8" />
            <line x1="20" y1="20" x2="10" y2="10" stroke="#B24BF3" strokeWidth="1" opacity="0.5" />
            <line x1="20" y1="20" x2="30" y2="10" stroke="#B24BF3" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
        
        {/* Enhanced abstract growth pattern lines */}
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
        {/* Master Growbot Logo with subtle float animation */}
        <div className="mb-8 animate-float">
          <img 
            src="/lovable-uploads/5d3166aa-c15c-4e67-9f65-aa1d7109581d.png" 
            alt="Master Growbot" 
            className="w-32 h-32 object-contain filter drop-shadow-xl"
          />
        </div>

        {/* Success Card with enhanced glowing effect */}
        <Card className="border border-primary/20 bg-card/90 backdrop-blur-sm shadow-xl animate-fade-in relative overflow-hidden w-full">
          {/* Enhanced glowing border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse-glow" />
          
          <div className="relative"> {/* Content wrapper for z-index ordering */}
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow relative">
                {/* Enhanced animated glow effect for check icon */}
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
              {/* Enhanced CTA button with pulse animation */}
              <Button 
                onClick={handleCompleteRegistration} 
                className="w-full group relative overflow-hidden cyber-button bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 animate-pulse-glow"
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
