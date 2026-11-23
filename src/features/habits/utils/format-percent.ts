const PERCENT = 100;
const NO_RATE = "—";

// A missing rate (nothing planned yet) is a dash, never "%0".
export function formatPercent(rate: number | null): string {
  return rate === null ? NO_RATE : `%${Math.round(rate * PERCENT)}`;
}
