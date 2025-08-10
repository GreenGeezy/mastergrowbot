import React from "react";
import { Flame } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BudBoostBadgeProps {
  run: number;
}

// Small, reusable badge to celebrate the user's Bud Boost Run (streak)
// Hides automatically when run is 0 or less
const BudBoostBadge: React.FC<BudBoostBadgeProps> = ({ run }) => {
  if (!run || run <= 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            role="status"
            aria-label={`Bud Boost Run Streak — Day ${run}`}
            className="inline-flex items-center gap-3 rounded-full bg-gold/10 text-gold px-4 py-2 select-none ring-1 ring-gold/30 shadow-subtle"
          >
            <Flame className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium text-sm">Bud Boost Run Streak</span>
            <span className="font-semibold text-base">Day {run}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>🔥 Bud Boost Run Streak — Day {run}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BudBoostBadge;
