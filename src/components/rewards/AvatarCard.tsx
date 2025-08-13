import { AvatarCustomization } from '@/hooks/use-streak-rewards';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface AvatarCardProps {
  avatar: AvatarCustomization;
  isUnlocked: boolean;
  isActive?: boolean;
  onApply?: (avatarId: string) => void;
  className?: string;
}

export function AvatarCard({ avatar, isUnlocked, isActive, onApply, className }: AvatarCardProps) {
  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-md",
      isUnlocked ? "bg-background border-primary/20" : "bg-muted/30 border-muted opacity-60",
      isActive && "ring-2 ring-primary ring-offset-2",
      className
    )}>
      <div className="space-y-3">
        {/* Avatar Preview */}
        <div className={cn(
          "w-full h-24 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300",
          isUnlocked 
            ? "bg-primary/5 border-2 border-primary/20" 
            : "bg-muted border-2 border-muted-foreground/20"
        )}>
          {avatar.image_url ? (
            <img 
              src={avatar.image_url} 
              alt={avatar.name}
              className={cn(
                "w-full h-full object-cover transition-all duration-300",
                !isUnlocked && "grayscale opacity-50"
              )}
              onError={(e) => {
                // Fallback to emoji if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<span class="text-3xl">🎨</span>';
                  parent.className = parent.className.replace('object-cover', 'items-center justify-center');
                }
              }}
            />
          ) : (
            <span className="text-3xl">🎨</span>
          )}
        </div>

        {/* Avatar Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className={cn(
              "font-medium text-sm leading-tight",
              isUnlocked ? "text-foreground" : "text-muted-foreground"
            )}>
              {avatar.name}
            </h4>
            
            {isActive && (
              <div className="flex items-center text-xs text-primary font-medium">
                <Check className="w-3 h-3 mr-1" />
                Active
              </div>
            )}
          </div>
          
          <p className={cn(
            "text-xs leading-relaxed",
            isUnlocked ? "text-muted-foreground" : "text-muted-foreground/70"
          )}>
            {avatar.description}
          </p>

          {/* Streak Requirement */}
          <div className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            isUnlocked 
              ? "bg-primary/10 text-primary" 
              : "bg-muted text-muted-foreground"
          )}>
            <span className="mr-1">🔥</span>
            {avatar.unlock_requirement} day{avatar.unlock_requirement !== 1 ? 's' : ''} streak
          </div>

          {/* Apply Button */}
          {isUnlocked && onApply && (
            <Button
              variant={isActive ? "secondary" : "outline"}
              size="sm"
              onClick={() => onApply(avatar.id)}
              disabled={isActive}
              className="w-full mt-2"
            >
              {isActive ? "Currently Applied" : "Apply Avatar"}
            </Button>
          )}

          {/* Unlocked Indicator */}
          {isUnlocked && avatar.applied_at && !isActive && (
            <div className="text-xs text-muted-foreground">
              Previously applied {new Date(avatar.applied_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}