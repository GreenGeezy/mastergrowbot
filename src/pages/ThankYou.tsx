
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Mail, ArrowRight } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();
  
  // Add useEffect for debugging
  useEffect(() => {
    console.log("ThankYou component mounted");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background circuit pattern */}
      <div className="absolute inset-0 circuit-background opacity-30" />

      <div className="w-full max-w-md z-10">
        {/* Success Card with glowing effect */}
        <Card className="border border-primary/20 bg-card/90 backdrop-blur-sm shadow-xl animate-fade-in relative overflow-hidden">
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
                Your subscription is now active. You're one step away from accessing your premium features.
              </p>
              
              <div className="bg-card-hover/60 p-5 rounded-lg border border-primary/20 mt-4 backdrop-blur-sm shimmer">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <Mail className="w-5 h-5 text-accent animate-pulse-glow" />
                  <p>Check your email for confirmation details and next steps.</p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-5 px-6 pb-6">
              <Button 
                onClick={() => navigate("/")} 
                className="w-full group relative overflow-hidden cyber-button bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300"
                size="lg"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-lg py-1">
                  Complete your registration
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              
              <div className="bg-card-hover/40 rounded-md p-3 border border-white/10">
                <p className="text-sm text-white/60 text-center">
                  Your access code has been saved. Use the same email when signing up.
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
