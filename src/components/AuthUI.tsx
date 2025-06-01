
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import PurchaseNotificationModal from './auth/PurchaseNotificationModal';
import PricingCards from './PricingCards';

const AuthUI = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message || 'Sign-in failed. Please check your credentials.');
        toast.error(error.message);
      } else {
        toast.success('Signed in successfully!');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('An unexpected error occurred during sign-in.');
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

    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message || 'Sign-up failed. Please try again.');
        toast.error(error.message);
      } else {
        toast.success('Account created successfully! Please check your email to verify.');
      }
    } catch (err) {
      console.error('Sign-up error:', err);
      setError('An unexpected error occurred during sign-up.');
      toast.error('An unexpected error occurred during sign-up.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message || 'Google sign-in failed. Please try again.');
        toast.error(error.message);
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('An unexpected error occurred during Google sign-in.');
      toast.error('An unexpected error occurred during Google sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-glow via-accent to-secondary-glow text-transparent bg-clip-text tech-font tracking-tight">
          Master Growbot
        </h1>
        <p className="text-white/80 text-lg">
          AI-Powered Cannabis Cultivation Assistant
        </p>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-white">Subscribe with Square Checkout</h2>
        
        <PricingCards />
        
        <div className="w-full">
          <img alt="Secure checkout by Square with multiple payment options" className="w-full h-auto object-contain rounded-lg" src="/lovable-uploads/21835d64-7d9a-49c8-b6e4-b59d95ce4a18.png" />
        </div>
      </div>

      {/* Authentication Form */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-white/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 border-white/20"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleSignIn}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <Button 
              onClick={handleSignUp}
              disabled={loading}
              variant="outline"
              className="w-full hover:bg-white/5 border-white/20"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-white/60">Or continue with</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full hover:bg-white/5 border-white/20"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>

      <PurchaseNotificationModal />
    </div>
  );
};

export default AuthUI;
