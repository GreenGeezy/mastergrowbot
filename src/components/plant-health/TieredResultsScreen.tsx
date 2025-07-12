import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, Lock, Star, Zap, Eye, Camera, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/utils/hapticFeedback';

interface StructuredAnalysisResult {
  diagnosis: string;
  confidence_level: number;
  detailed_analysis: {
    growth_stage: string;
    health_score: string;
    specific_issues: string;
    environmental_factors: string;
  };
  recommended_actions: string[];
}

interface TieredResultsScreenProps {
  analysisResult: StructuredAnalysisResult;
  isVisible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  isPremium: boolean;
  scanCount: number;
}

const TieredResultsScreen = ({ 
  analysisResult, 
  isVisible, 
  onClose, 
  onUpgrade, 
  isPremium,
  scanCount 
}: TieredResultsScreenProps) => {
  const { toast } = useToast();
  const haptic = useHapticFeedback();
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!isVisible) return null;

  const handleShare = async () => {
    haptic.light();
    
    // Create shareable content
    const shareText = `🌱 Just analyzed my plant health with Master Growbot!\n\n` +
                     `Health Score: ${analysisResult.detailed_analysis.health_score}\n` +
                     `Confidence: ${Math.round(analysisResult.confidence_level * 100)}%\n\n` +
                     `Check out this AI-powered plant health analyzer! 📱`;

    // Web Share API for mobile devices
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Plant Health Analysis',
          text: shareText,
          url: window.location.origin
        });
        haptic.success();
        toast({ title: "Shared successfully!", description: "Thanks for spreading the word!" });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback: Copy to clipboard and show share options
      await navigator.clipboard.writeText(shareText + `\n\n${window.location.origin}`);
      setShowShareMenu(true);
      toast({ title: "Copied to clipboard!", description: "Share this with your fellow growers!" });
    }
  };

  const handleUpgrade = () => {
    haptic.medium();
    onUpgrade();
  };

  const freeActions = analysisResult.recommended_actions.slice(0, 2);
  const premiumActions = analysisResult.recommended_actions.slice(2);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4 pt-8">
        <Card className="w-full max-w-lg bg-gradient-to-br from-background/95 to-card/95 border border-border/50 shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-border/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Analysis Complete</h2>
                  <p className="text-sm text-muted-foreground">Scan #{scanCount}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                {Math.round(analysisResult.confidence_level * 100)}% Confident
              </Badge>
            </div>

            {/* Share Button */}
            <Button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Your Plant Diagnosis!
            </Button>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Basic Health Info (Always Free) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-foreground">Basic Health Assessment</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Growth Stage</p>
                  <p className="font-medium text-foreground text-sm">
                    {analysisResult.detailed_analysis.growth_stage.split('\n')[0]}
                  </p>
                </div>
                <div className="bg-card/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Health Status</p>
                  <p className="font-medium text-foreground text-sm">
                    {analysisResult.detailed_analysis.health_score.split('\n')[0]}
                  </p>
                </div>
              </div>

              {/* Free Recommendations */}
              <div className="space-y-2">
                <p className="font-medium text-foreground">Quick Tips:</p>
                {freeActions.map((action, index) => (
                  <div key={index} className="flex items-start gap-2 bg-green-500/10 rounded-lg p-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-foreground">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Content */}
            {!isPremium && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <h4 className="font-bold text-foreground mb-2">Premium Analysis</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Unlock detailed treatment plans and expert recommendations
                    </p>
                    <Button
                      onClick={handleUpgrade}
                      size="sm"
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </Button>
                  </div>
                </div>

                {/* Blurred Premium Content */}
                <div className="filter blur-sm opacity-50 space-y-4">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold text-foreground">Detailed Treatment Plan</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-card/50 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Environmental Optimization</h4>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.detailed_analysis.environmental_factors.substring(0, 150)}...
                      </p>
                    </div>
                    
                    <div className="bg-card/50 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Specific Issues & Solutions</h4>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.detailed_analysis.specific_issues.substring(0, 150)}...
                      </p>
                    </div>

                    {premiumActions.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-medium text-foreground">Advanced Recommendations:</p>
                        {premiumActions.slice(0, 3).map((action, index) => (
                          <div key={index} className="flex items-start gap-2 bg-yellow-500/10 rounded-lg p-3">
                            <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground">{action.substring(0, 100)}...</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Premium Content (Full Access) */}
            {isPremium && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-semibold text-foreground">Premium Analysis</h3>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Premium</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-card/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Environmental Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.detailed_analysis.environmental_factors}
                    </p>
                  </div>
                  
                  <div className="bg-card/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Specific Issues & Solutions</h4>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.detailed_analysis.specific_issues}
                    </p>
                  </div>

                  {premiumActions.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">Advanced Recommendations:</p>
                      {premiumActions.map((action, index) => (
                        <div key={index} className="flex items-start gap-2 bg-yellow-500/10 rounded-lg p-3">
                          <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground">{action}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>

          {/* Footer */}
          <div className="p-6 border-t border-border/30">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Continue Growing
            </Button>
          </div>
        </Card>
      </div>

      {/* Share Menu Overlay */}
      {showShareMenu && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-end">
          <Card className="w-full mx-4 mb-4 bg-background">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Share Your Analysis</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => {
                    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(`🌱 Just analyzed my plant health with Master Growbot! Check it out: ${window.location.origin}`), '_blank');
                    setShowShareMenu(false);
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Twitter
                </Button>
                <Button
                  onClick={() => {
                    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.origin), '_blank');
                    setShowShareMenu(false);
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Facebook
                </Button>
              </div>
              <Button
                onClick={() => setShowShareMenu(false)}
                variant="ghost"
                className="w-full mt-3"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TieredResultsScreen;