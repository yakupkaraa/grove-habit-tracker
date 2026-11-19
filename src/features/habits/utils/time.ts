const TIME_PART_WIDTH = 2;

function pad(value: number): string {
  return String(value).padStart(TIME_PART_WIDTH, "0");
}

export function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseTime(time: string, base: Date): Date {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), hours, minutes);
}
