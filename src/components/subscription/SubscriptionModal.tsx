import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, TrendingUp, Shield, Clock, Check, Sparkles } from 'lucide-react';
import { useHapticFeedback } from '@/utils/hapticFeedback';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  quizAnswers?: Record<string, string>;
}

const SubscriptionModal = ({ 
  isVisible, 
  onClose, 
  onSubscribe,
  quizAnswers 
}: SubscriptionModalProps) => {
  const haptic = useHapticFeedback();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isVisible) return null;

  const handleSubscribe = async () => {
    haptic.medium();
    setIsProcessing(true);

    try {
      // Simulate subscription process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      haptic.success();
      toast({
        title: "Welcome to Premium!",
        description: "Your subscription is now active. Enjoy unlimited plant analysis!",
      });
      
      onSubscribe();
    } catch (error) {
      haptic.error();
      toast({
        title: "Subscription failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    haptic.light();
    onClose();
  };

  // Personalized features based on quiz answers
  const getPersonalizedFeatures = () => {
    const features = [
      {
        icon: <Zap className="w-5 h-5 text-green-400" />,
        title: 'Unlimited Plant Scans',
        description: 'Analyze as many plants as you want, anytime'
      },
      {
        icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
        title: 'Detailed Treatment Plans',
        description: 'Step-by-step care instructions and expert recommendations'
      },
      {
        icon: <Clock className="w-5 h-5 text-purple-400" />,
        title: 'Analysis History & Tracking',
        description: 'Monitor your plant\'s progress over time'
      },
      {
        icon: <Shield className="w-5 h-5 text-orange-400" />,
        title: 'Priority Expert Support',
        description: 'Get help from plant care specialists'
      }
    ];

    // Add personalized features based on quiz answers
    if (quizAnswers?.plant_type === 'cannabis') {
      features.push({
        icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
        title: 'Cannabis-Specific Insights',
        description: 'Specialized analysis for cultivation optimization'
      });
    }

    if (quizAnswers?.main_concern === 'pests') {
      features.push({
        icon: <Shield className="w-5 h-5 text-red-400" />,
        title: 'Advanced Pest Detection',
        description: 'Early identification and treatment protocols'
      });
    }

    return features;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-gradient-to-br from-background/95 to-card/95 border border-border/50 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="p-6 text-center border-b border-border/30">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Master Growbot Premium
          </h2>
          <p className="text-muted-foreground text-lg">
            Unlock the full power of AI plant care
          </p>
          
          {quizAnswers && (
            <Badge className="mt-3 bg-green-500/20 text-green-400 border-green-500/30">
              Personalized for your {quizAnswers.plant_type || 'plants'}
            </Badge>
          )}
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Premium Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Premium Features
            </h3>
            
            <div className="space-y-3">
              {getPersonalizedFeatures().map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-card/50 rounded-lg border border-border/20">
                  <div className="flex-shrink-0 p-1">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-6 border border-yellow-500/20 text-center">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-foreground">
                $9.99
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Billed monthly • Cancel anytime
              </p>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                7-day free trial included
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Start Free Trial
                </>
              )}
            </Button>
            
            <Button
              onClick={handleClose}
              variant="ghost"
              className="w-full py-3 text-muted-foreground hover:text-foreground"
            >
              Maybe Later
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              ✓ 7-day free trial • ✓ Cancel anytime • ✓ 30-day money-back guarantee
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ✓ Secure payment via App Store • ✓ No hidden fees
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionModal;