import type { CardState } from "./types";

const DAY = 24 * 60 * 60 * 1000;

// Simple review spacing by box
const BOX_INTERVALS: Record<CardState["box"], number> = {
  1: 0,          // always eligible
  2: 1 * DAY,
  3: 3 * DAY,
  4: 7 * DAY,
  5: 14 * DAY,
};

export function getDefaultState(): CardState {
  return { box: 1, lastSeen: 0, correctStreak: 0, seenCount: 0 };
}

export function isDue(s: CardState, now = Date.now()): boolean {
  const wait = BOX_INTERVALS[s.box];
  return now - s.lastSeen >= wait;
}

export function markResult(s: CardState, correct: boolean, now = Date.now()): CardState {
  const next: CardState = { ...s };
  next.lastSeen = now;
  next.seenCount += 1;

  if (correct) {
    next.correctStreak += 1;
    next.box = (Math.min(5, next.box + 1) as CardState["box"]);
  } else {
    next.correctStreak = 0;
    next.box = (Math.max(1, next.box - 1) as CardState["box"]);
  }
  return next;
}
