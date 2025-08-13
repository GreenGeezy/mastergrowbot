import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NewlyUnlockedRewards } from '@/hooks/use-streak-rewards';
import { cn } from '@/lib/utils';

interface RewardUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: NewlyUnlockedRewards;
  currentStreak: number;
}

export function RewardUnlockModal({ isOpen, onClose, rewards, currentStreak }: RewardUnlockModalProps) {
  const totalRewards = rewards.badges.length + rewards.avatars.length;

  if (totalRewards === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            🎉 Congratulations!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          {/* Celebration Message */}
          <div className="space-y-2">
            <div className="text-4xl">🔥</div>
            <h3 className="text-lg font-semibold text-foreground">
              {currentStreak}-Day Bud Boost Streak Achieved!
            </h3>
            <p className="text-muted-foreground">
              You've unlocked {totalRewards} new reward{totalRewards > 1 ? 's' : ''}!
            </p>
          </div>

          {/* New Badges */}
          {rewards.badges.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-left">🏆 New Badges:</h4>
              <div className="space-y-2">
                {rewards.badges.map((badge) => (
                  <div 
                    key={badge.id}
                    className={cn(
                      "p-3 rounded-lg border bg-primary/5 border-primary/20",
                      "animate-scale-in"
                    )}
                  >
                    <div className="text-sm font-medium text-foreground">{badge.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{badge.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Avatar Customizations */}
          {rewards.avatars.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-left">🎨 New Avatar Customizations:</h4>
              <div className="space-y-2">
                {rewards.avatars.map((avatar) => (
                  <div 
                    key={avatar.id}
                    className={cn(
                      "p-3 rounded-lg border bg-primary/5 border-primary/20",
                      "animate-scale-in"
                    )}
                  >
                    <div className="text-sm font-medium text-foreground">{avatar.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{avatar.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4">
            <Button onClick={onClose} className="w-full">
              View My Rewards
            </Button>
          </div>

          {/* Motivational Message */}
          <div className="text-xs text-muted-foreground pt-2">
            Keep up your Bud Boost Streak to unlock even more rewards! 🌱
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}