import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, X, Award, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Milestone {
  id: string;
  title: string;
  fun_fact: string;
  streak_requirement: number;
}

interface MilestoneCelebrationModalProps {
  milestones: Milestone[];
  isOpen: boolean;
  onClose: () => void;
  onShare?: (milestoneId: string) => Promise<boolean>;
}

/**
 * Personal milestone celebration modal component
 * Displays achieved streak milestones with sharing capabilities
 * Completely isolated from auth/payment flows
 */
export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  milestones,
  isOpen,
  onClose,
  onShare
}) => {
  const [isSharing, setIsSharing] = useState<string | null>(null);

  // Handle sharing a milestone achievement
  const handleShare = async (milestone: Milestone) => {
    setIsSharing(milestone.id);
    
    try {
      // Create shareable text content
      const shareText = `🎉 ${milestone.title}\n\n${milestone.fun_fact}\n\nAchieved in MasterGrowbot AI! 🌿\n\n#BudBoostRun #CannabisGrowing #MasterGrowbot`;
      
      // Try native sharing first (mobile)
      if (navigator.share && navigator.canShare({ text: shareText })) {
        await navigator.share({
          title: milestone.title,
          text: shareText
        });
        
        // Mark as shared in database
        if (onShare) {
          await onShare(milestone.id);
        }
        
        toast.success('Milestone shared successfully! 🎉');
      } else {
        // Fallback to clipboard copy (desktop)
        await navigator.clipboard.writeText(shareText);
        
        // Mark as shared in database
        if (onShare) {
          await onShare(milestone.id);
        }
        
        toast.success('Milestone copied to clipboard! Share it anywhere! 📋');
      }
    } catch (err) {
      console.error('Error sharing milestone:', err);
      toast.error('Failed to share milestone. Please try again.');
    } finally {
      setIsSharing(null);
    }
  };

  if (!milestones || milestones.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-b from-primary/10 to-background border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <Award className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Milestone Achieved!
            </span>
            <Sparkles className="h-6 w-6 text-secondary" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <Card 
              key={milestone.id} 
              className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 animate-scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 text-center space-y-4">
                {/* Milestone Badge */}
                <div className="flex justify-center">
                  <Badge 
                    variant="outline" 
                    className="px-3 py-1 text-sm border-primary/30 bg-primary/10 text-primary font-semibold"
                  >
                    {milestone.streak_requirement} Day Streak
                  </Badge>
                </div>

                {/* Milestone Title */}
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  {milestone.title}
                </h3>

                {/* Fun Fact */}
                <p className="text-muted-foreground text-base leading-relaxed">
                  {milestone.fun_fact}
                </p>

                {/* Share Button */}
                <Button
                  onClick={() => handleShare(milestone)}
                  disabled={isSharing === milestone.id}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  {isSharing === milestone.id ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sharing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Share Achievement
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-muted-foreground/30 hover:bg-muted/50"
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};