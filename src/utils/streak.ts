// Streak utilities for Bud Boost Run logic
// Kept pure for unit testing and reuse across app/edge functions

export function startOfUtcDate(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function computeStreakUpdate(params: {
  currentStreak: number | null | undefined;
  lastAction: Date | string | null | undefined;
  today?: Date;
}): { nextStreak: number; nextLastAction: Date } {
  const now = params.today ?? new Date();
  const today = startOfUtcDate(now);

  // No existing row → create with streak 1
  if (!params.currentStreak || !params.lastAction) {
    return { nextStreak: 1, nextLastAction: today };
  }

  const current = params.currentStreak;
  const lastDate = startOfUtcDate(
    typeof params.lastAction === 'string' ? new Date(params.lastAction) : params.lastAction
  );

  const dayDiff = Math.floor((today.getTime() - lastDate.getTime()) / 86_400_000);

  let next = current;
  if (dayDiff === 1) {
    next = current + 1; // consecutive day
  } else if (dayDiff > 2) {
    next = 1; // gap larger than 2 days → reset
  }

  return { nextStreak: next, nextLastAction: today };
}
