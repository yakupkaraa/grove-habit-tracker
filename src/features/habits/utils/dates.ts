import type { Habit, Weekday } from "../types";

const DATE_PART_WIDTH = 2;

function pad(value: number): string {
  return String(value).padStart(DATE_PART_WIDTH, "0");
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Takvim günü ekler (ms değil): DST'de bir gün 23 veya 25 saat olabilir.
export function addDays(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function getWeekday(dateKey: string): Weekday {
  return parseDateKey(dateKey).getDay() as Weekday;
}

export function isScheduledOn(
  habit: Pick<Habit, "repeatDays">,
  dateKey: string,
): boolean {
  return habit.repeatDays.includes(getWeekday(dateKey));
}
