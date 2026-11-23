import type { Completion, Habit } from "../types";
import { addDays } from "./dates";
import { getHabitDetail, type HabitDetail } from "./habit-detail";
import { getRangeStats } from "./stats";

export type StatsOverview = {
  rate: number | null;
  plannedDays: number;
  doneDays: number;
  days: { date: string; planned: number; done: number; ratio: number }[];
  habits: { habit: Habit; rate: number | null }[];
  longestStreak: { habit: Habit; days: number } | null;
};

// All-time best, so it does not depend on the selected range. Strict ">" keeps the
// first habit (store order) on a tie.
function findLongestStreak(
  habits: readonly Habit[],
  details: readonly HabitDetail[],
): StatsOverview["longestStreak"] {
  let best: StatsOverview["longestStreak"] = null;
  details.forEach((detail, index) => {
    if (detail.longestStreak > (best?.days ?? 0)) {
      best = { habit: habits[index], days: detail.longestStreak };
    }
  });
  return best;
}

export function getStatsOverview(
  habits: readonly Habit[],
  completions: readonly Completion[],
  today: string,
  rangeDays: number,
): StatsOverview {
  const details = habits.map((habit) => getHabitDetail(habit, completions, today, rangeDays));
  const plannedDays = details.reduce((sum, d) => sum + d.plannedDays, 0);
  const doneDays = details.reduce((sum, d) => sum + d.doneDays, 0);
  const range = getRangeStats(habits, completions, addDays(today, -(rangeDays - 1)), today);
  const days = range.days.map((day) => ({
    ...day,
    ratio: day.planned === 0 ? 0 : day.done / day.planned,
  }));

  return {
    rate: plannedDays === 0 ? null : doneDays / plannedDays,
    plannedDays,
    doneDays,
    days,
    habits: habits.map((habit, index) => ({ habit, rate: details[index].rate })),
    longestStreak: findLongestStreak(habits, details),
  };
}
