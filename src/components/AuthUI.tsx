import React, { useState } from 'react';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Eye, EyeOff } from "lucide-react";
import PricingCards from './PricingCards';
import TestimonialCarousel from './TestimonialCarousel';
import { isIOSPreview } from '@/utils/flags';

const AuthUI = ({ children }) => {
  // Skip Supabase login when in preview
  if (isIOSPreview) return <>{children ?? null}</>;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const supabase = useSupabaseClient();

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    
    if (!email || !password) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });
      
      if (error) {
        console.error('Sign-in error:', error);
        
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Too many requests')) {
          setError('Too many sign-in attempts. Please wait a moment before trying again.');
        } else {
          setError(error.message);
        }
        toast.error(error.message);
      } else {
        toast.success('Signed in successfully!');
        // Clear form
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('Unexpected sign-in error:', err);
      setError('An unexpected error occurred during sign-in. Please try again.');
      toast.error('An unexpected error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError(null);
    setLoading(true);
    
    if (!email || !password) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Sign-up error:', error);
        
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
          setIsSignUp(false); // Switch to sign-in mode
        } else if (error.message.includes('Password should be at least')) {
          setError('Password must be at least 6 characters long.');
        } else if (error.message.includes('Invalid email')) {
          setError('Please enter a valid email address.');
        } else {
          setError(error.message);
        }
        toast.error(error.message);
      } else {
        toast.success('Account created successfully! Please check your email to verify your account.');
        // Clear form
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('Unexpected sign-up error:', err);
      setError('An unexpected error occurred during sign-up. Please try again.');
      toast.error('An unexpected error occurred during sign-up.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        setError('Google sign-in failed. Please try again or use email/password.');
        toast.error('Google sign-in failed. Please try again.');
      }
    } catch (err) {
      console.error('Unexpected Google sign-in error:', err);
      setError('An unexpected error occurred during Google sign-in. Please try again.');
      toast.error('An unexpected error occurred during Google sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      handleSignUp();
    } else {
      handleSignIn();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    // Clear form when switching modes
    setEmail('');
    setPassword('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">
          Master Growbot
        </h1>
        <p className="text-white/80 text-lg">
          AI-Powered Cannabis Cultivation Assistant
        </p>
      </div>

      <div className="text-center space-y-4">
        <h2 className="font-semibold text-white text-lg">Select a Plan and Subscribe with Square Checkout. Already Subscribed? Sign in at the Bottom of the Page</h2>
        
        <TestimonialCarousel />
        
        <PricingCards />
      </div>

      {/* Three Images Layout */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 max-w-5xl mx-auto">
        {/* Cancel Anytime Badge */}
        <div className="flex-shrink-0">
          <img 
            src="/lovable-uploads/0b625d46-6a8a-4ae6-a395-2ea7b1034b04.png" 
            alt="Cancel Anytime Zero Fees Badge" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain"
            loading="lazy"
          />
        </div>

        {/* Secure Checkout Image */}
        <div className="flex-shrink-0">
          <img 
            alt="Secure checkout by Square with multiple payment options" 
            className="w-full max-w-md h-auto object-contain rounded-lg" 
            src="/lovable-uploads/1f642749-fc10-4fb2-8ad3-3f0866f9c935.png" 
          />
        </div>

        {/* Trusted Seller Badge */}
        <div className="flex-shrink-0">
          <img 
            src="/lovable-uploads/30767198-f9b4-42cb-b632-0b9fbb0b856a.png" 
            alt="Trusted Seller Badge" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain"
            loading="lazy"
          />
        </div>
      </div>

      {/* Authentication Section */}
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
        {/* Authentication Form */}
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl p-6 max-w-md w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="bg-background/50 border-white/20" 
                required 
                autoComplete="email" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="bg-background/50 border-white/20 pr-10" 
                  required 
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  minLength={6}
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors" 
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading || !email.trim() || !password} 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-white/60">Or continue with</span>
              </div>
            </div>

            <Button 
              type="button" 
              onClick={handleGoogleSignIn} 
              disabled={loading} 
              variant="outline" 
              className="w-full hover:bg-white/5 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center mt-4">
              <button 
                type="button" 
                className="text-sm text-gray-400 hover:text-white transition-colors" 
                onClick={toggleMode}
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthUI;
