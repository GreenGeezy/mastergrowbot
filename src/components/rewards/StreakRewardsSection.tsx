import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useStreakRewards } from '@/hooks/use-streak-rewards';
import { BadgeCard } from './BadgeCard';
import { AvatarCard } from './AvatarCard';
import { RewardUnlockModal } from './RewardUnlockModal';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserBudBoostRun } from '@/integrations/supabase/client';
import { Trophy, Palette, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StreakRewardsSection() {
  const {
    userBadges,
    userAvatars,
    availableBadges,
    availableAvatars,
    loading,
    checking,
    checkStreakRewards,
    applyAvatarCustomization
  } = useStreakRewards();

  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<any>(null);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Check user's current streak and look for new rewards
  const handleCheckRewards = async () => {
    try {
      const streak = await getUserBudBoostRun();
      setCurrentStreak(streak);
      
      const newRewards = await checkStreakRewards(streak);
      if (newRewards && (newRewards.badges.length > 0 || newRewards.avatars.length > 0)) {
        setNewlyUnlocked(newRewards);
        setShowUnlockModal(true);
      }
    } catch (error) {
      console.error('Error checking streak rewards:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const unlockedBadgeIds = new Set(userBadges.map(b => b.id));
  const unlockedAvatarIds = new Set(userAvatars.map(a => a.id));
  const activeAvatar = userAvatars.find(a => a.is_active);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                My Bud Boost Streak Rewards
              </CardTitle>
              <CardDescription>
                Earn exclusive badges and avatar customizations by maintaining your daily Bud Boost Streak
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCheckRewards}
              disabled={checking}
            >
              {checking ? "Checking..." : "Check for New Rewards"}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userBadges.length}</div>
              <div className="text-xs text-muted-foreground">Badges Earned</div>
            </div>
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userAvatars.length}</div>
              <div className="text-xs text-muted-foreground">Avatars Unlocked</div>
            </div>
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{availableBadges.length + availableAvatars.length}</div>
              <div className="text-xs text-muted-foreground">Total Rewards</div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Rewards Tabs */}
          <Tabs defaultValue="badges" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="badges" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Badges ({userBadges.length}/{availableBadges.length})
              </TabsTrigger>
              <TabsTrigger value="avatars" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Avatar Customizations ({userAvatars.length}/{availableAvatars.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="badges" className="mt-4">
              {availableBadges.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No badge rewards available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableBadges.map((badge) => (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      isUnlocked={unlockedBadgeIds.has(badge.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="avatars" className="mt-4">
              {availableAvatars.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No avatar customizations available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableAvatars.map((avatar) => (
                    <AvatarCard
                      key={avatar.id}
                      avatar={avatar}
                      isUnlocked={unlockedAvatarIds.has(avatar.id)}
                      isActive={activeAvatar?.id === avatar.id}
                      onApply={unlockedAvatarIds.has(avatar.id) ? applyAvatarCustomization : undefined}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Empty State */}
          {userBadges.length === 0 && userAvatars.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="font-semibold mb-2">Start Your Bud Boost Streak!</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Use the Bud Boost feature daily to earn exclusive badges and avatar customizations.
              </p>
              <Badge variant="outline" className="text-xs">
                Maintain a 3-day streak to unlock your first reward! 🏆
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unlock Modal */}
      {newlyUnlocked && (
        <RewardUnlockModal
          isOpen={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
          rewards={newlyUnlocked}
          currentStreak={currentStreak}
        />
      )}
    </>
  );
}