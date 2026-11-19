import type { Weekday } from "../types";

export const MONDAY_FIRST: readonly Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export function toggleWeekday(days: readonly Weekday[], day: Weekday): Weekday[] {
  const selected = new Set(days);
  if (selected.has(day)) selected.delete(day);
  else selected.add(day);

  return MONDAY_FIRST.filter((d) => selected.has(d));
}

// Indexed by Weekday (0 = Sunday)
export const WEEKDAY_NAMES: readonly string[] = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

// Indexed by Weekday (0 = Sunday)
export const SHORT_WEEKDAY_NAMES: readonly string[] = [
  "Paz",
  "Pzt",
  "Sal",
  "Çar",
  "Per",
  "Cum",
  "Cmt",
];
