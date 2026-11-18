import type { Completion, Habit } from "../types";
import { addDays, isScheduledOn } from "./dates";

type Schedule = Pick<Habit, "repeatDays" | "createdAt">;
type StatsHabit = Schedule & Pick<Habit, "id">;
type DayStats = { planned: number; done: number };
type DayEntry = DayStats & { date: string };
type RangeStats = DayStats & { days: DayEntry[]; rate: number };

function isPlannedOn(habit: Schedule, date: string): boolean {
  return habit.createdAt <= date && isScheduledOn(habit, date);
}

function toRate(done: number, planned: number): number {
  return planned === 0 ? 0 : done / planned;
}

export function getDayStats(
  habits: readonly StatsHabit[],
  completions: readonly Completion[],
  date: string,
): DayStats {
  const completedIds = new Set(
    completions.filter((c) => c.date === date).map((c) => c.habitId),
  );
  const planned = habits.filter((h) => isPlannedOn(h, date));
  const done = planned.filter((h) => completedIds.has(h.id)).length;

  return { planned: planned.length, done };
}

export function getRangeStats(
  habits: readonly StatsHabit[],
  completions: readonly Completion[],
  from: string,
  to: string,
): RangeStats {
  const days: DayEntry[] = [];

  for (let date = from; date <= to; date = addDays(date, 1)) {
    days.push({ date, ...getDayStats(habits, completions, date) });
  }

  const planned = days.reduce((sum, day) => sum + day.planned, 0);
  const done = days.reduce((sum, day) => sum + day.done, 0);

  return { days, planned, done, rate: toRate(done, planned) };
}

export function calculateHabitRate(
  habit: Schedule,
  completedDates: readonly string[],
  from: string,
  to: string,
): number {
  const completed = new Set(completedDates);
  let planned = 0;
  let done = 0;

  for (let date = from; date <= to; date = addDays(date, 1)) {
    if (!isPlannedOn(habit, date)) continue;
    planned++;
    if (completed.has(date)) done++;
  }

  return toRate(done, planned);
}
