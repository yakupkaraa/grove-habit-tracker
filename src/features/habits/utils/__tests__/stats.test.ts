import type { Completion, Habit, Weekday } from "../types";
import { calculateHabitRate, getDayStats, getRangeStats } from "./stats";

type TestHabit = Pick<Habit, "id" | "repeatDays" | "createdAt">;

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5];

function makeHabit(id: string, overrides: Partial<TestHabit> = {}): TestHabit {
  return { id, repeatDays: ALL_DAYS, createdAt: "2026-01-01", ...overrides };
}

function completion(habitId: string, date: string): Completion {
  return { habitId, date };
}

describe("getDayStats", () => {
  it("returns planned 0 and done 0 when there are no habits", () => {
    expect(getDayStats([], [], "2026-11-17")).toEqual({ planned: 0, done: 0 });
  });

  it("counts a habit scheduled on the date as planned", () => {
    const habits = [makeHabit("water")];

    expect(getDayStats(habits, [], "2026-11-17")).toEqual({ planned: 1, done: 0 });
  });

  it("counts a completed habit as done", () => {
    const habits = [makeHabit("water")];
    const completions = [completion("water", "2026-11-17")];

    expect(getDayStats(habits, completions, "2026-11-17")).toEqual({
      planned: 1,
      done: 1,
    });
  });

  it("does not count a habit that is not scheduled on that weekday", () => {
    const habits = [makeHabit("work", { repeatDays: WEEKDAYS })];
    const saturday = "2026-11-21";

    expect(getDayStats(habits, [], saturday)).toEqual({ planned: 0, done: 0 });
  });

  it("does not count a habit created after the date as planned", () => {
    const habits = [makeHabit("water", { createdAt: "2026-11-18" })];

    expect(getDayStats(habits, [], "2026-11-17")).toEqual({ planned: 0, done: 0 });
  });

  it("counts a habit created on that date as planned", () => {
    const habits = [makeHabit("water", { createdAt: "2026-11-17" })];

    expect(getDayStats(habits, [], "2026-11-17")).toEqual({ planned: 1, done: 0 });
  });

  it("ignores a completion recorded on a non-scheduled day", () => {
    const habits = [makeHabit("work", { repeatDays: WEEKDAYS })];
    const saturday = "2026-11-21";
    const completions = [completion("work", saturday)];

    expect(getDayStats(habits, completions, saturday)).toEqual({
      planned: 0,
      done: 0,
    });
  });

  it("counts duplicate completions of a habit once", () => {
    const habits = [makeHabit("water")];
    const completions = [
      completion("water", "2026-11-17"),
      completion("water", "2026-11-17"),
    ];

    expect(getDayStats(habits, completions, "2026-11-17")).toEqual({
      planned: 1,
      done: 1,
    });
  });

  it("ignores completions of unknown habitIds", () => {
    const habits = [makeHabit("water")];
    const completions = [completion("deleted-habit", "2026-11-17")];

    expect(getDayStats(habits, completions, "2026-11-17")).toEqual({
      planned: 1,
      done: 0,
    });
  });

  it("ignores completions of other dates", () => {
    const habits = [makeHabit("water")];
    const completions = [completion("water", "2026-11-16")];

    expect(getDayStats(habits, completions, "2026-11-17")).toEqual({
      planned: 1,
      done: 0,
    });
  });

  it("counts planned and done across several habits", () => {
    const habits = [
      makeHabit("water"),
      makeHabit("read"),
      makeHabit("work", { repeatDays: WEEKDAYS }),
    ];
    const saturday = "2026-11-21";
    const completions = [completion("water", saturday), completion("work", saturday)];

    expect(getDayStats(habits, completions, saturday)).toEqual({
      planned: 2,
      done: 1,
    });
  });
});

describe("getRangeStats", () => {
  it("returns one entry for a single-day range when from equals to", () => {
    const habits = [makeHabit("water")];
    const completions = [completion("water", "2026-11-17")];

    const stats = getRangeStats(habits, completions, "2026-11-17", "2026-11-17");

    expect(stats.days).toEqual([{ date: "2026-11-17", planned: 1, done: 1 }]);
  });

  it("returns days in ascending order for an inclusive range", () => {
    const stats = getRangeStats([], [], "2026-11-15", "2026-11-18");

    expect(stats.days.map((day) => day.date)).toEqual([
      "2026-11-15",
      "2026-11-16",
      "2026-11-17",
      "2026-11-18",
    ]);
  });

  it("returns the right planned and done values for every day", () => {
    const habits = [
      makeHabit("water"),
      makeHabit("work", { repeatDays: WEEKDAYS }),
      makeHabit("swim", { repeatDays: [6] }),
    ];
    const completions = [
      completion("water", "2026-11-20"),
      completion("work", "2026-11-20"),
      completion("swim", "2026-11-21"),
      completion("water", "2026-11-22"),
    ];

    const { days } = getRangeStats(habits, completions, "2026-11-20", "2026-11-22");

    expect(days[0]).toEqual({ date: "2026-11-20", planned: 2, done: 2 });
    expect(days[1]).toEqual({ date: "2026-11-21", planned: 2, done: 1 });
    expect(days[2]).toEqual({ date: "2026-11-22", planned: 1, done: 1 });
  });

  it("sums planned and done over the days", () => {
    const habits = [
      makeHabit("water"),
      makeHabit("work", { repeatDays: WEEKDAYS }),
      makeHabit("swim", { repeatDays: [6] }),
    ];
    const completions = [
      completion("water", "2026-11-20"),
      completion("work", "2026-11-20"),
      completion("swim", "2026-11-21"),
      completion("water", "2026-11-22"),
    ];

    const stats = getRangeStats(habits, completions, "2026-11-20", "2026-11-22");

    expect(stats.planned).toBe(5);
    expect(stats.done).toBe(4);
  });

  it("computes rate as done divided by planned", () => {
    const habits = [makeHabit("water"), makeHabit("read")];
    const completions = [completion("water", "2026-11-17")];

    const stats = getRangeStats(habits, completions, "2026-11-17", "2026-11-17");

    expect(stats.rate).toBe(0.5);
  });

  it("returns rate 0 when nothing is planned in the range", () => {
    const habits = [makeHabit("work", { repeatDays: WEEKDAYS })];

    const stats = getRangeStats(habits, [], "2026-11-21", "2026-11-22");

    expect(stats.rate).toBe(0);
  });

  it("returns empty days and rate 0 when from is after to", () => {
    const habits = [makeHabit("water")];
    const completions = [completion("water", "2026-11-17")];

    const stats = getRangeStats(habits, completions, "2026-11-18", "2026-11-17");

    expect(stats).toEqual({ days: [], planned: 0, done: 0, rate: 0 });
  });

  it("returns planned 0 and done 0 with no habits", () => {
    const stats = getRangeStats([], [], "2026-11-16", "2026-11-17");

    expect(stats.planned).toBe(0);
    expect(stats.done).toBe(0);
    expect(stats.rate).toBe(0);
  });

  it("includes days before a habit's createdAt with planned 0", () => {
    const habits = [makeHabit("water", { createdAt: "2026-11-17" })];

    const { days } = getRangeStats(habits, [], "2026-11-16", "2026-11-18");

    expect(days.map((day) => day.planned)).toEqual([0, 1, 1]);
  });

  it("counts a weekday-only habit as planned only on weekdays across a weekend", () => {
    const habits = [makeHabit("work", { repeatDays: WEEKDAYS })];

    const { days, planned } = getRangeStats(habits, [], "2026-11-20", "2026-11-23");

    expect(days.map((day) => day.planned)).toEqual([1, 0, 0, 1]);
    expect(planned).toBe(2);
  });

  it("ignores a completion on a non-scheduled day in the totals", () => {
    const habits = [makeHabit("work", { repeatDays: WEEKDAYS })];
    const completions = [completion("work", "2026-11-21"), completion("work", "2026-11-23")];

    const stats = getRangeStats(habits, completions, "2026-11-20", "2026-11-23");

    expect(stats.done).toBe(1);
  });

  it("counts duplicate completions once in the totals", () => {
    const habits = [makeHabit("water")];
    const completions = [completion("water", "2026-11-17"), completion("water", "2026-11-17")];

    const stats = getRangeStats(habits, completions, "2026-11-17", "2026-11-17");

    expect(stats.done).toBe(1);
    expect(stats.rate).toBe(1);
  });

  it("ignores completions of unknown habitIds in the totals", () => {
    const habits = [makeHabit("water")];
    const completions = [completion("deleted-habit", "2026-11-17")];

    const stats = getRangeStats(habits, completions, "2026-11-17", "2026-11-17");

    expect(stats.done).toBe(0);
    expect(stats.planned).toBe(1);
  });

  it("handles a range crossing a month boundary", () => {
    const habits = [makeHabit("water")];
    const completions = [completion("water", "2026-11-30"), completion("water", "2026-12-01")];

    const stats = getRangeStats(habits, completions, "2026-11-29", "2026-12-02");

    expect(stats.days.map((day) => day.date)).toEqual([
      "2026-11-29",
      "2026-11-30",
      "2026-12-01",
      "2026-12-02",
    ]);
    expect(stats.done).toBe(2);
  });

  it("handles a range crossing a year boundary", () => {
    const habits = [makeHabit("water")];
    const completions = [completion("water", "2026-12-31"), completion("water", "2027-01-01")];

    const stats = getRangeStats(habits, completions, "2026-12-30", "2027-01-02");

    expect(stats.days.map((day) => day.date)).toEqual([
      "2026-12-30",
      "2026-12-31",
      "2027-01-01",
      "2027-01-02",
    ]);
    expect(stats.done).toBe(2);
  });

  it("returns planned 0, done 0 and rate 0 when all habits are created after the range", () => {
    const habits = [
      makeHabit("water", { createdAt: "2026-11-20" }),
      makeHabit("read", { createdAt: "2026-12-01" }),
    ];
    const completions = [completion("water", "2026-11-16")];

    const stats = getRangeStats(habits, completions, "2026-11-15", "2026-11-17");

    expect(stats.planned).toBe(0);
    expect(stats.done).toBe(0);
    expect(stats.rate).toBe(0);
  });
});

describe("calculateHabitRate", () => {
  it("returns 0 when no days are planned in the range", () => {
    const habit = makeHabit("work", { repeatDays: WEEKDAYS });
    const saturday = "2026-11-21";

    expect(calculateHabitRate(habit, [], saturday, saturday)).toBe(0);
  });

  it("returns 1 when every planned day is completed", () => {
    const habit = makeHabit("water");
    const completed = ["2026-11-16", "2026-11-17", "2026-11-18"];

    expect(calculateHabitRate(habit, completed, "2026-11-16", "2026-11-18")).toBe(1);
  });

  it("returns the fraction of planned days that are completed", () => {
    const habit = makeHabit("water");
    const completed = ["2026-11-15", "2026-11-16", "2026-11-18"];

    expect(calculateHabitRate(habit, completed, "2026-11-15", "2026-11-18")).toBe(0.75);
  });

  it("counts only planned days for a weekday-only habit across a weekend", () => {
    const habit = makeHabit("work", { repeatDays: WEEKDAYS });
    const completed = ["2026-11-20"];

    expect(calculateHabitRate(habit, completed, "2026-11-20", "2026-11-23")).toBe(0.5);
  });

  it("ignores a completion recorded on a non-scheduled day", () => {
    const habit = makeHabit("work", { repeatDays: WEEKDAYS });
    const completed = ["2026-11-20", "2026-11-21", "2026-11-22"];

    expect(calculateHabitRate(habit, completed, "2026-11-20", "2026-11-23")).toBe(0.5);
  });

  it("counts duplicate dates once", () => {
    const habit = makeHabit("water");
    const completed = ["2026-11-16", "2026-11-16", "2026-11-16"];

    expect(calculateHabitRate(habit, completed, "2026-11-16", "2026-11-17")).toBe(0.5);
  });

  it("does not count days before createdAt as planned", () => {
    const habit = makeHabit("water", { createdAt: "2026-11-18" });
    const completed = ["2026-11-18", "2026-11-19"];

    expect(calculateHabitRate(habit, completed, "2026-11-16", "2026-11-19")).toBe(1);
  });

  it("counts the createdAt day as planned", () => {
    const habit = makeHabit("water", { createdAt: "2026-11-18" });

    expect(calculateHabitRate(habit, [], "2026-11-18", "2026-11-18")).toBe(0);
    expect(calculateHabitRate(habit, ["2026-11-18"], "2026-11-18", "2026-11-18")).toBe(1);
  });

  it("returns 0 when the whole range is before createdAt", () => {
    const habit = makeHabit("water", { createdAt: "2026-11-20" });
    const completed = ["2026-11-16", "2026-11-17"];

    expect(calculateHabitRate(habit, completed, "2026-11-16", "2026-11-17")).toBe(0);
  });

  it("returns the same result when completedDates are not sorted", () => {
    const habit = makeHabit("water");
    const sorted = ["2026-11-15", "2026-11-16", "2026-11-18"];
    const shuffled = ["2026-11-18", "2026-11-15", "2026-11-16"];

    const expected = calculateHabitRate(habit, sorted, "2026-11-15", "2026-11-18");

    expect(calculateHabitRate(habit, shuffled, "2026-11-15", "2026-11-18")).toBe(expected);
    expect(expected).toBe(0.75);
  });

  it("returns 0 when from is after to", () => {
    const habit = makeHabit("water");
    const completed = ["2026-11-17"];

    expect(calculateHabitRate(habit, completed, "2026-11-18", "2026-11-17")).toBe(0);
  });

  it("handles a range crossing a month boundary", () => {
    const habit = makeHabit("water");
    const completed = ["2026-11-30", "2026-12-01"];

    expect(calculateHabitRate(habit, completed, "2026-11-29", "2026-12-02")).toBe(0.5);
  });

  it("handles a range crossing a year boundary", () => {
    const habit = makeHabit("water");
    const completed = ["2026-12-31", "2027-01-01", "2027-01-02"];

    expect(calculateHabitRate(habit, completed, "2026-12-30", "2027-01-02")).toBe(0.75);
  });

  it("returns 0 for a habit with empty repeatDays", () => {
    const habit = makeHabit("water", { repeatDays: [] });
    const completed = ["2026-11-16", "2026-11-17"];

    expect(calculateHabitRate(habit, completed, "2026-11-16", "2026-11-17")).toBe(0);
  });
});
