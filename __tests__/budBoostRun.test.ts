import { describe, it, expect } from 'vitest';
import { computeStreakUpdate, startOfUtcDate } from '@/utils/streak';

// Fixed "today" for deterministic tests
const fixedNow = new Date(Date.UTC(2025, 0, 15, 12)); // 2025-01-15 12:00 UTC
const today = startOfUtcDate(fixedNow); // 2025-01-15T00:00:00.000Z

function daysAgo(base: Date, days: number) {
  return new Date(base.getTime() - days * 86_400_000);
}

describe('Bud Boost Run streak logic', () => {
  it('creates a new run row when none exists', () => {
    const { nextStreak, nextLastAction } = computeStreakUpdate({
      currentStreak: null,
      lastAction: null,
      today: fixedNow,
    });
    expect(nextStreak).toBe(1);
    expect(startOfUtcDate(nextLastAction).toISOString()).toBe(today.toISOString());
  });

  it('increments run when last_action is yesterday', () => {
    const yesterday = daysAgo(today, 1);
    const { nextStreak, nextLastAction } = computeStreakUpdate({
      currentStreak: 3,
      lastAction: yesterday,
      today: fixedNow,
    });
    expect(nextStreak).toBe(4);
    expect(startOfUtcDate(nextLastAction).toISOString()).toBe(today.toISOString());
  });

  it('resets run when last_action is >2 days ago', () => {
    const threeDaysAgo = daysAgo(today, 3);
    const { nextStreak, nextLastAction } = computeStreakUpdate({
      currentStreak: 5,
      lastAction: threeDaysAgo,
      today: fixedNow,
    });
    expect(nextStreak).toBe(1);
    expect(startOfUtcDate(nextLastAction).toISOString()).toBe(today.toISOString());
  });
});
