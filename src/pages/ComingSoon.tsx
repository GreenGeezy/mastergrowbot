import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Award, Star, Mail, User, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SparklesCore } from '@/components/ui/sparkles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ComingSoon() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (name.length > 100) {
      toast.error('Name must be less than 100 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ name: name.trim(), email: email.trim().toLowerCase() }]);

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - email already exists
          toast.error('This email is already on the waitlist!');
        } else {
          console.error('Waitlist error:', error);
          toast.error('Something went wrong. Please try again.');
        }
        return;
      }

      setIsSuccess(true);
      setName('');
      setEmail('');
      toast.success("You're on the list! We'll notify you when we launch.");
    } catch (err) {
      console.error('Waitlist submission error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Sparkles Background */}
      <div className="fixed inset-0 w-full h-full">
        <SparklesCore
          id="coming-soon-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#36d399"
          speed={0.8}
        />
      </div>
      
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-background to-background -z-10" />
      
      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo with Glow */}
        <div className="relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-glow via-accent-glow to-secondary-glow rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <a href="https://www.mastergrowbot.com" className="block">
            <div className="relative bg-card p-4 sm:p-6 rounded-full backdrop-blur-xl ring-1 ring-white/10 hover:ring-accent/30 transition-all duration-500">
              <img 
                src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png" 
                alt="Master Growbot Logo" 
                className="w-20 h-20 sm:w-28 sm:h-28 transform group-hover:scale-105 transition-transform duration-500" 
                loading="eager" 
                width={112} 
                height={112} 
                fetchPriority="high" 
              />
            </div>
          </a>
        </div>

        {/* Headlines */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-10">
          <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-glow via-accent to-secondary-glow animate-fade-in tracking-tight tech-font">
            Master Growbot
          </h1>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            New and Improved Version Coming Soon!
          </h2>
          
          <p className="text-lg sm:text-xl text-gold font-medium">
            Stay Tuned!
          </p>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            We're working hard to bring you the most advanced AI-powered cannabis cultivation assistant. 
            Join the waitlist to be the first to know when we launch.
          </p>
        </div>

        {/* Waitlist Form Card */}
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-white flex items-center justify-center gap-2">
              {isSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5 text-primary-glow" />
                  You're on the List!
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 text-accent" />
                  Join the Waitlist
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isSuccess 
                ? "We'll send you an email when we're ready to launch."
                : "Be the first to experience the new Master Growbot AI."
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isSuccess ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary-glow/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary-glow" />
                </div>
                <p className="text-muted-foreground">
                  Thank you for your interest! We can't wait to share what we've been building.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSuccess(false)}
                  className="mt-4"
                >
                  Add Another Email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-background/50 border-white/20 focus:border-accent"
                      maxLength={100}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background/50 border-white/20 focus:border-accent"
                      maxLength={255}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white font-semibold py-5 shadow-lg shadow-primary-glow/30 hover:shadow-primary-glow/50 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    'Join the Waitlist'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Trust Signals */}
        <div className="mt-10 text-center space-y-4">
          <p className="text-sm sm:text-base font-medium text-gold">
            Created by Award-Winning AI Technologists
          </p>
          
          <div className="flex items-center justify-center space-x-3">
            <Award className="w-6 h-6 text-gold animate-float" />
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="w-5 h-5 fill-gold text-gold" />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-sm text-muted-foreground">
        <div className="space-x-4">
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
        <p className="mt-3 text-xs">
          © {new Date().getFullYear()} Master Growbot. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
