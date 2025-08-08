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
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 select-none">
            <Flame className="w-4 h-4" aria-hidden="true" />
            <span className="font-semibold text-sm">Day {run}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>🔥 Bud Boost Run — Day {run}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BudBoostBadge;
