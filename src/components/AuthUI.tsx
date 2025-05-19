import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PurchaseNotificationModal from "@/components/auth/PurchaseNotificationModal";

const AuthUI = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Default to sign in instead of sign up
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);

  // Check if user has a valid purchase token
  useEffect(() => {
    // Check URL for thank-you page with code parameter
    const isThankYouPage = window.location.pathname === '/thank-you';
    const urlParams = new URLSearchParams(window.location.search);
    const hasCode = urlParams.has('code') || urlParams.has('email');
    setHasValidToken(isThankYouPage && hasCode);
  }, []);
  const handleDisabledButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPurchaseModal(true);
  };
  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
  };
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const {
          data,
          error
        } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        toast.success("Check your email for the confirmation link!");
      } else {
        const {
          data,
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success("Logged in successfully!");
        navigate("/chat");
      }
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
      const {
        data,
        error
      } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };
  const handleSquareSubscription = () => {
    window.location.href = "https://www.aihighstore.com/shop/ai-tech-software/RYSLC7NKKOOL4Q64NBYA7GJD";
  };
  return <div className="w-full max-w-3xl mx-auto">
      <Card className="border border-primary/20">
        <CardHeader className="space-y-1 px-6 py-4">
          <CardTitle className="text-2xl text-center font-bold">Sign In or Create an account to use Master Growbot AI</CardTitle>
          <CardDescription className="text-center text-amber-50 text-base">New user? Click the AI Grow Optimizer Quiz or Click the Button Below to Subscribe to Master Growbot from Square Secure Checkout— you'll get a special sign-up link to gain access to Master Growbot AI</CardDescription>
          <div className="flex items-center justify-center mt-2 w-full">
            <img 
              src="/lovable-uploads/763e7583-18ee-41c9-96b4-bd1b51471ea6.png" 
              alt="Square secure checkout with payment options" 
              onClick={handleSquareSubscription} 
              className="w-full object-contain cursor-pointer hover:opacity-90 transition-opacity" 
            />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required autoComplete="email" aria-label="Email address" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required autoComplete={isSignUp ? "new-password" : "current-password"} aria-label="Password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || isSignUp && !hasValidToken} onClick={isSignUp && !hasValidToken ? handleDisabledButtonClick : undefined}>
              {loading ? "Loading..." : "Sign In"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1A1A1A] text-gray-400">Or continue with</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleGoogleSignIn} disabled={loading}>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </Button>

            <div className="text-center mt-4">
              <button type="button" className="text-sm text-gray-400 hover:text-white" onClick={handleToggleMode}>
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Purchase notification modal */}
      <PurchaseNotificationModal isOpen={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} />
    </div>;
};

export default AuthUI;
