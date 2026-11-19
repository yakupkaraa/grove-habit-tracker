import type { Weekday } from "../types";
import { MONDAY_FIRST, SHORT_WEEKDAY_NAMES } from "./weekdays";

const EVERY_DAY: Weekday[] = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5];
const WEEKEND: Weekday[] = [6, 0];

function hasExactly(days: ReadonlySet<Weekday>, expected: readonly Weekday[]): boolean {
  return days.size === expected.length && expected.every((day) => days.has(day));
}

export function formatRepeatDays(repeatDays: readonly Weekday[]): string {
  const days = new Set(repeatDays);

  if (hasExactly(days, EVERY_DAY)) return "Her gün";
  if (hasExactly(days, WEEKDAYS)) return "Hafta içi";
  if (hasExactly(days, WEEKEND)) return "Hafta sonu";

  return MONDAY_FIRST.filter((day) => days.has(day))
    .map((day) => SHORT_WEEKDAY_NAMES[day])
    .join(", ");
}
