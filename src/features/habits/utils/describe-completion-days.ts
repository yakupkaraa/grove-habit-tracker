import { getWeekday } from "./dates";
import { WEEKDAY_NAMES } from "./weekdays";

type DayCount = { date: string; planned: number; done: number };
type Totals = { plannedDays: number; doneDays: number };

const WEEK_LENGTH = 7;

function describeDay({ date, planned, done }: DayCount): string {
  const name = WEEKDAY_NAMES[getWeekday(date)];
  return planned === 0 ? `${name} planlı gün yok` : `${name} ${done}/${planned}`;
}

function describeRange(rangeDays: number, { plannedDays, doneDays }: Totals): string {
  return `Son ${rangeDays} gün: ${plannedDays} planlı gün, ${doneDays} tamamlandı.`;
}

// A week is read day by day (the bars' own counts); a longer range is too long to listen to,
// so it is one sentence built from the same totals as the summary card.
export function describeCompletionDays(days: readonly DayCount[], totals: Totals): string {
  return days.length <= WEEK_LENGTH
    ? days.map(describeDay).join(", ")
    : describeRange(days.length, totals);
}
