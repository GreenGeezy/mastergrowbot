import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, User, Sparkles } from 'lucide-react';
import { useHapticFeedback } from '@/utils/hapticFeedback';

interface PostScanSignInPromptProps {
  isVisible: boolean;
  onSignIn: () => void;
  onDismiss: () => void;
  analysisComplete: boolean;
}

const PostScanSignInPrompt = ({ 
  isVisible, 
  onSignIn, 
  onDismiss, 
  analysisComplete 
}: PostScanSignInPromptProps) => {
  const haptic = useHapticFeedback();

  const handleSignIn = () => {
    haptic.light();
    onSignIn();
  };

  const handleDismiss = () => {
    haptic.light();
    onDismiss();
  };

  if (!isVisible || !analysisComplete) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-end justify-center p-4 animate-fade-in"
      role="dialog"
      aria-labelledby="signin-prompt-title"
      aria-describedby="signin-prompt-description"
    >
      <Card className="w-full max-w-md bg-gradient-to-br from-background/95 to-card/95 border border-border/50 shadow-2xl animate-slide-in-bottom">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 
              id="signin-prompt-title"
              className="text-lg font-semibold text-foreground"
            >
              Save Your Analysis
            </h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground p-1"
            aria-label="Close sign-in prompt"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p 
                id="signin-prompt-description"
                className="text-foreground font-medium"
              >
                Great analysis complete!
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sign in to save your plant health history, get personalized recommendations, 
                and track your growing progress over time.
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true" />
              <span className="text-muted-foreground">Save unlimited analysis history</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true" />
              <span className="text-muted-foreground">Get personalized growing tips</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full" aria-hidden="true" />
              <span className="text-muted-foreground">Track plant health trends</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleSignIn}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
              aria-describedby="signin-button-description"
            >
              Sign In to Save Analysis
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground py-2"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostScanSignInPrompt;