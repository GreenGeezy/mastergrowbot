import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, Leaf, Droplets, Sun, Target, Heart } from 'lucide-react';
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

interface FullResultsScreenProps {
  analysisResult: StructuredAnalysisResult;
  isVisible: boolean;
  onClose: () => void;
  onSavePlants: () => void;
}

const FullResultsScreen = ({ 
  analysisResult, 
  isVisible, 
  onClose, 
  onSavePlants 
}: FullResultsScreenProps) => {
  const { toast } = useToast();
  const haptic = useHapticFeedback();
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!isVisible) return null;

  const handleShare = async () => {
    haptic.light();
    
    // Create shareable content
    const shareText = `🌱 Just analyzed my plant health with Master Growbot!\n\n` +
                     `Diagnosis: ${analysisResult.diagnosis}\n` +
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

  const handleSavePlants = () => {
    haptic.medium();
    onSavePlants();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4 pt-8">
        <Card className="w-full max-w-lg bg-gradient-to-br from-background/95 to-card/95 border border-border/50 shadow-2xl animate-fade-in">
          {/* Header */}
          <div className="p-6 border-b border-border/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Plant Analysis Complete</h2>
                  <p className="text-sm text-muted-foreground">Full health assessment</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                {Math.round(analysisResult.confidence_level * 100)}% Confident
              </Badge>
            </div>

            {/* Share Button */}
            <Button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 mb-4"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Your Plant Diagnosis!
            </Button>

            {/* Save Plants CTA */}
            <Button
              onClick={handleSavePlants}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Heart className="w-5 h-5 mr-2" />
              Save My Plants in Seconds
            </Button>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Main Diagnosis */}
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <h3 className="font-bold text-lg text-foreground mb-2">Primary Diagnosis</h3>
              <p className="text-foreground text-base">{analysisResult.diagnosis}</p>
            </div>

            {/* Health Overview Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/50 rounded-lg p-4 text-center">
                <Sun className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Growth Stage</p>
                <p className="font-medium text-foreground text-sm">
                  {analysisResult.detailed_analysis.growth_stage.split('\n')[0]}
                </p>
              </div>
              <div className="bg-card/50 rounded-lg p-4 text-center">
                <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Health Status</p>
                <p className="font-medium text-foreground text-sm">
                  {analysisResult.detailed_analysis.health_score.split('\n')[0]}
                </p>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Complete Health Assessment</h3>
              
              <div className="space-y-3">
                {/* Environmental Factors */}
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <h4 className="font-medium text-foreground">Environmental Conditions</h4>
                  </div>
                  <p className="text-sm text-foreground">
                    {analysisResult.detailed_analysis.environmental_factors}
                  </p>
                </div>
                
                {/* Specific Issues */}
                <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-orange-400" />
                    <h4 className="font-medium text-foreground">Specific Issues & Analysis</h4>
                  </div>
                  <p className="text-sm text-foreground">
                    {analysisResult.detailed_analysis.specific_issues}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Recommended Actions</h3>
              {analysisResult.recommended_actions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-sm text-foreground flex-1">{action}</p>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Footer */}
          <div className="p-6 border-t border-border/30">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full py-3"
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

export default FullResultsScreen;