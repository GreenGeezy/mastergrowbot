
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Envelope, ArrowRight } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <Card className="border border-primary/20 bg-card/90 backdrop-blur-sm shadow-lg animate-fade-in">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary-glow" />
            </div>
            <CardTitle className="text-2xl text-white">Thank you for your purchase!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-white/80">
              Your subscription is now active. You're one step away from accessing your premium features.
            </p>
            
            <div className="bg-card-hover p-4 rounded-lg border border-primary/10 mt-4">
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Envelope className="w-5 h-5 text-primary" />
                <p>Check your email for confirmation details and next steps.</p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              onClick={() => navigate("/")} 
              className="w-full group relative overflow-hidden"
              size="lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                Complete your registration
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-hover transform transition-transform group-hover:scale-105"></span>
            </Button>
            
            <p className="text-sm text-white/60 text-center">
              Your access code has been saved. Use the same email when signing up.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ThankYou;
