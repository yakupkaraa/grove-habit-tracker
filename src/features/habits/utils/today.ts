import type { Completion, Habit } from "../types";
import { isPlannedOn } from "./dates";
import { calculateCurrentStreak } from "./streak";

export type TodayItem = { habit: Habit; done: boolean; streak: number };
export type TimeOfDay = "morning" | "afternoon" | "evening";
export type TimeOfDayFilter = "all" | TimeOfDay;

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/; // "HH:mm", 24h, zero-padded
const NOON_HOUR = 12;
const EVENING_HOUR = 18;

function datesOf(habit: Habit, completions: readonly Completion[]): string[] {
  return completions.filter((c) => c.habitId === habit.id).map((c) => c.date);
}

export function getTodayItems(
  habits: readonly Habit[],
  completions: readonly Completion[],
  today: string,
): TodayItem[] {
  const doneIds = new Set(
    completions.filter((c) => c.date === today).map((c) => c.habitId),
  );

  return habits
    .filter((habit) => isPlannedOn(habit, today))
    .map((habit) => ({
      habit,
      done: doneIds.has(habit.id),
      streak: calculateCurrentStreak(habit, datesOf(habit, completions), today),
    }));
}

export function getTimeOfDay(reminderTime?: string): TimeOfDay | undefined {
  if (reminderTime === undefined || !TIME_PATTERN.test(reminderTime)) {
    return undefined;
  }

  const hour = Number(reminderTime.slice(0, 2));
  if (hour < NOON_HOUR) return "morning";
  return hour < EVENING_HOUR ? "afternoon" : "evening";
}

export function filterByTimeOfDay(
  items: readonly TodayItem[],
  filter: TimeOfDayFilter,
): TodayItem[] {
  if (filter === "all") return [...items];
  return items.filter((item) => getTimeOfDay(item.habit.reminderTime) === filter);
}

export function getHighestStreak(items: readonly TodayItem[]): number {
  return Math.max(0, ...items.map((item) => item.streak));
}
