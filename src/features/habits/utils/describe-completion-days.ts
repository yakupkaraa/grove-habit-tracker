import { getWeekday } from "./dates";
import { WEEKDAY_NAMES } from "./weekdays";

type DayCount = { date: string; planned: number; done: number };

const WEEK_LENGTH = 7;
// Turkish possessive suffix by the last digit ("dördü", "üçü", "altısı"...).
const SUFFIX_BY_LAST_DIGIT = ["ı", "i", "si", "ü", "ü", "i", "sı", "si", "i", "u"];
// For round numbers the tens word decides ("onu", "yirmisi", "otuzu"...).
const SUFFIX_BY_TENS_DIGIT = ["ı", "u", "si", "u", "ı", "si", "ı", "i", "i", "ı"];

function suffixOf(count: number): string {
  const lastDigit = count % 10;
  if (lastDigit !== 0) return SUFFIX_BY_LAST_DIGIT[lastDigit];

  return SUFFIX_BY_TENS_DIGIT[Math.floor(count / 10) % 10];
}

function describeDay({ date, planned, done }: DayCount): string {
  const name = WEEKDAY_NAMES[getWeekday(date)];
  return planned === 0 ? `${name} planlı gün yok` : `${name} ${done}/${planned}`;
}

function describeRange(days: readonly DayCount[]): string {
  const planned = days.reduce((sum, day) => sum + day.planned, 0);
  const done = days.reduce((sum, day) => sum + day.done, 0);

  return `Son ${days.length} gün, ${planned} planlı günden ${done}'${suffixOf(done)} tamamlandı`;
}

// A week is read day by day; a longer range is too long to listen to, so it is one sentence.
export function describeCompletionDays(days: readonly DayCount[]): string {
  return days.length <= WEEK_LENGTH ? days.map(describeDay).join(", ") : describeRange(days);
}
