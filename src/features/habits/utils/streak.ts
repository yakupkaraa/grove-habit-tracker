import type { Habit } from "../types";
import { addDays, isScheduledOn } from "./dates";

type StreakHabit = Pick<Habit, "repeatDays" | "createdAt">;

export function calculateCurrentStreak(
  habit: StreakHabit,
  completedDates: readonly string[],
  today: string,
): number {
  const completed = new Set(completedDates);
  let streak = 0;
  let day = completed.has(today) ? today : addDays(today, -1);

  for (; day >= habit.createdAt; day = addDays(day, -1)) {
    if (!isScheduledOn(habit, day)) continue;
    if (!completed.has(day)) break;
    streak++;
  }

  return streak;
}

export function calculateLongestStreak(
  habit: StreakHabit,
  completedDates: readonly string[],
  today: string,
): number {
  const completed = new Set(completedDates);
  let longest = 0;
  let run = 0;

  for (let day = habit.createdAt; day <= today; day = addDays(day, 1)) {
    if (!isScheduledOn(habit, day)) continue;
    run = completed.has(day) ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  return longest;
}
