import type { Completion, Habit } from "../types";
import { addDays } from "./dates";
import { calculateHabitRate, getRangeStats } from "./stats";
import { calculateCurrentStreak, calculateLongestStreak } from "./streak";

const RATE_WINDOW_DAYS = 30;

type DetailHabit = Pick<Habit, "id" | "repeatDays" | "createdAt">;

export type HabitDetail = {
  currentStreak: number;
  longestStreak: number;
  rate: number | null;
};

export function getHabitDetail(
  habit: DetailHabit,
  completions: readonly Completion[],
  today: string,
): HabitDetail {
  const dates = completions.filter((c) => c.habitId === habit.id).map((c) => c.date);
  const windowStart = addDays(today, -(RATE_WINDOW_DAYS - 1));
  // Like the streak, a pending today is not a miss: it only counts once it is done.
  const windowEnd = dates.includes(today) ? today : addDays(today, -1);

  const { planned } = getRangeStats([habit], completions, windowStart, windowEnd);

  return {
    currentStreak: calculateCurrentStreak(habit, dates, today),
    longestStreak: calculateLongestStreak(habit, dates, today),
    // No planned day yet (a brand-new habit): there is no rate to show, not "0%".
    rate: planned === 0 ? null : calculateHabitRate(habit, dates, windowStart, windowEnd),
  };
}
