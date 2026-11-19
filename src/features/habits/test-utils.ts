// Test-only helpers: import from *.test.ts(x) files, never from app code.
import type { Habit, Weekday } from "./types";

export const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export function makeHabit(id: string, overrides: Partial<Habit> = {}): Habit {
  return {
    id,
    name: id,
    icon: "water",
    color: "#2F6B45",
    repeatDays: ALL_DAYS,
    createdAt: "2026-01-01",
    ...overrides,
  };
}
