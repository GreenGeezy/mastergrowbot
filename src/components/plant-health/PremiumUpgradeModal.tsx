import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Star, Zap, TrendingUp, Shield, Clock } from 'lucide-react';
import { useHapticFeedback } from '@/utils/hapticFeedback';

interface PremiumUpgradeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  scanCount: number;
  scansRemaining: number;
}

const PremiumUpgradeModal = ({ 
  isVisible, 
  onClose, 
  onUpgrade, 
  scanCount, 
  scansRemaining 
}: PremiumUpgradeModalProps) => {
  const haptic = useHapticFeedback();

  if (!isVisible) return null;

  const handleUpgrade = () => {
    haptic.medium();
    onUpgrade();
  };

  const handleClose = () => {
    haptic.light();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-background/95 to-card/95 border border-border/50 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="p-6 text-center border-b border-border/30">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {scansRemaining > 0 ? 'Almost There!' : 'Free Scans Complete!'}
          </h2>
          <p className="text-muted-foreground">
            {scansRemaining > 0 
              ? `You have ${scansRemaining} free scans remaining`
              : 'Unlock unlimited plant health analysis'
            }
          </p>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Free Scans Used</span>
              <span className="font-medium text-foreground">{scanCount}/5</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(scanCount / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Premium Benefits */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Premium Benefits
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                <Zap className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-sm">Unlimited Plant Scans</p>
                  <p className="text-xs text-muted-foreground">Analyze as many plants as you want</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-sm">Detailed Treatment Plans</p>
                  <p className="text-xs text-muted-foreground">Expert recommendations & solutions</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-sm">Analysis History</p>
                  <p className="text-xs text-muted-foreground">Track your plant's progress over time</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-sm">Priority Support</p>
                  <p className="text-xs text-muted-foreground">Get expert help when you need it</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <p className="text-sm text-muted-foreground">Cancel anytime</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium
            </Button>
            
            {scansRemaining > 0 && (
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full py-3"
              >
                Continue with {scansRemaining} Free Scans
              </Button>
            )}
            
            {scansRemaining === 0 && (
              <Button
                onClick={handleClose}
                variant="ghost"
                className="w-full py-3 text-muted-foreground"
              >
                Maybe Later
              </Button>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="text-center pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              ✓ 30-day money-back guarantee • ✓ Cancel anytime • ✓ Secure payment
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumUpgradeModal;