import type { Weekday } from "../../types";
import { addDays, getWeekday, isScheduledOn, toDateKey } from "../dates";

describe("toDateKey", () => {
  it("formats a date as YYYY-MM-DD", () => {
    const date = new Date(2026, 10, 17);

    expect(toDateKey(date)).toBe("2026-11-17");
  });

  it("pads single-digit month and day with zero", () => {
    const date = new Date(2026, 2, 5);

    expect(toDateKey(date)).toBe("2026-03-05");
  });

  it("uses local date parts instead of UTC", () => {
    const lateEveningLocal = new Date(2026, 0, 1, 23, 30);

    expect(toDateKey(lateEveningLocal)).toBe("2026-01-01");
  });

  it("keeps the last day of the year as is", () => {
    const date = new Date(2026, 11, 31);

    expect(toDateKey(date)).toBe("2026-12-31");
  });
});

describe("addDays", () => {
  it("adds days within the same month", () => {
    expect(addDays("2026-11-17", 3)).toBe("2026-11-20");
  });

  it("returns the same date when adding 0 days", () => {
    expect(addDays("2026-11-17", 0)).toBe("2026-11-17");
  });

  it("rolls over to the next month at month end", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
  });

  it("rolls over to the next year at year end", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("lands on Feb 29 in a leap year", () => {
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
  });

  it("skips Feb 29 in a non-leap year", () => {
    expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
  });

  it("subtracts days when given a negative number", () => {
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("rolls back to the previous year at year start", () => {
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
  });

  it("handles large offsets", () => {
    expect(addDays("2026-01-01", 365)).toBe("2027-01-01");
  });

  it("adds whole days across the US DST start (2026-03-08)", () => {
    expect(addDays("2026-03-07", 2)).toBe("2026-03-09");
  });

  it("adds whole days across the US DST end (2026-11-01)", () => {
    expect(addDays("2026-10-31", 2)).toBe("2026-11-02");
  });

  it("subtracts whole days across the US DST start (2026-03-08)", () => {
    expect(addDays("2026-03-09", -2)).toBe("2026-03-07");
  });
});

describe("getWeekday", () => {
  it("returns 0 for a Sunday", () => {
    expect(getWeekday("2026-11-15")).toBe(0);
  });

  it("returns 1 for a Monday", () => {
    expect(getWeekday("2026-11-16")).toBe(1);
  });

  it("returns 6 for a Saturday", () => {
    expect(getWeekday("2026-11-21")).toBe(6);
  });

  it("returns the right weekday on a leap day", () => {
    expect(getWeekday("2028-02-29")).toBe(2);
  });
});

describe("isScheduledOn", () => {
  it("returns true when the weekday is in repeatDays", () => {
    const habit = { repeatDays: [1, 3, 5] as Weekday[] };

    expect(isScheduledOn(habit, "2026-11-16")).toBe(true);
  });

  it("returns false when the weekday is not in repeatDays", () => {
    const habit = { repeatDays: [1, 3, 5] as Weekday[] };

    expect(isScheduledOn(habit, "2026-11-17")).toBe(false);
  });

  it("returns false for a habit with empty repeatDays", () => {
    const habit = { repeatDays: [] as Weekday[] };

    expect(isScheduledOn(habit, "2026-11-16")).toBe(false);
  });

  it("returns true on every day of a week for a daily habit", () => {
    const daily = { repeatDays: [0, 1, 2, 3, 4, 5, 6] as Weekday[] };
    const weekDays = [0, 1, 2, 3, 4, 5, 6].map((offset) =>
      addDays("2026-11-15", offset),
    );

    expect(weekDays.every((day) => isScheduledOn(daily, day))).toBe(true);
  });

  it("matches only Saturday and Sunday for a weekend-only habit", () => {
    const weekend = { repeatDays: [0, 6] as Weekday[] };
    const sunday = "2026-11-15";
    const monday = "2026-11-16";
    const friday = "2026-11-20";
    const saturday = "2026-11-21";

    expect(isScheduledOn(weekend, sunday)).toBe(true);
    expect(isScheduledOn(weekend, saturday)).toBe(true);
    expect(isScheduledOn(weekend, monday)).toBe(false);
    expect(isScheduledOn(weekend, friday)).toBe(false);
  });
});
