import { Badge } from '@/hooks/use-streak-rewards';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
  className?: string;
}

export function BadgeCard({ badge, isUnlocked, className }: BadgeCardProps) {
  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-md",
      isUnlocked ? "bg-background border-primary/20" : "bg-muted/30 border-muted opacity-60",
      className
    )}>
      <div className="flex items-start space-x-3">
        {/* Badge Icon */}
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
          isUnlocked 
            ? "bg-primary/10 border-2 border-primary/20" 
            : "bg-muted border-2 border-muted-foreground/20"
        )}>
          {badge.icon_url ? (
            <img 
              src={badge.icon_url} 
              alt={badge.name}
              className={cn(
                "w-8 h-8 object-contain transition-all duration-300",
                !isUnlocked && "grayscale opacity-50"
              )}
              onError={(e) => {
                // Fallback to emoji if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '🏆';
                  parent.className += ' text-2xl';
                }
              }}
            />
          ) : (
            <span className="text-2xl">🏆</span>
          )}
        </div>

        {/* Badge Info */}
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-medium text-sm leading-tight mb-1",
            isUnlocked ? "text-foreground" : "text-muted-foreground"
          )}>
            {badge.name}
          </h4>
          
          <p className={cn(
            "text-xs leading-relaxed mb-2",
            isUnlocked ? "text-muted-foreground" : "text-muted-foreground/70"
          )}>
            {badge.description}
          </p>

          {/* Streak Requirement */}
          <div className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            isUnlocked 
              ? "bg-primary/10 text-primary" 
              : "bg-muted text-muted-foreground"
          )}>
            <span className="mr-1">🔥</span>
            {badge.unlock_requirement} day{badge.unlock_requirement !== 1 ? 's' : ''} streak
          </div>

          {/* Unlocked Indicator */}
          {isUnlocked && badge.unlocked_at && (
            <div className="mt-2 text-xs text-primary font-medium">
              ✅ Unlocked {new Date(badge.unlocked_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}