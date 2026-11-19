import type { Weekday } from "../types";
import { calculateCurrentStreak, calculateLongestStreak } from "./streak";

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5];

const dailyHabit = { repeatDays: ALL_DAYS, createdAt: "2026-01-01" };
const weekdayHabit = { repeatDays: WEEKDAYS, createdAt: "2026-01-01" };

describe("calculateCurrentStreak", () => {
  it("returns 0 when there are no completions", () => {
    expect(calculateCurrentStreak(dailyHabit, [], "2026-11-17")).toBe(0);
  });

  it("returns 1 when only today is completed", () => {
    const completed = ["2026-11-17"];

    expect(calculateCurrentStreak(dailyHabit, completed, "2026-11-17")).toBe(1);
  });

  it("counts consecutive completed days including today", () => {
    const completed = ["2026-11-15", "2026-11-16", "2026-11-17"];

    expect(calculateCurrentStreak(dailyHabit, completed, "2026-11-17")).toBe(3);
  });

  it("keeps the streak when today is scheduled but not completed yet", () => {
    const completed = ["2026-11-15", "2026-11-16"];

    expect(calculateCurrentStreak(dailyHabit, completed, "2026-11-17")).toBe(2);
  });

  it("returns 0 when today is not completed and yesterday was missed", () => {
    const completed = ["2026-11-15"];

    expect(calculateCurrentStreak(dailyHabit, completed, "2026-11-17")).toBe(0);
  });

  it("returns 1 when today is completed but yesterday was missed", () => {
    const completed = ["2026-11-15", "2026-11-17"];

    expect(calculateCurrentStreak(dailyHabit, completed, "2026-11-17")).toBe(1);
  });

  it("stops at the first missed day and ignores older completions", () => {
    const completed = [
      "2026-11-10",
      "2026-11-11",
      "2026-11-12",
      "2026-11-16",
      "2026-11-17",
    ];

    expect(calculateCurrentStreak(dailyHabit, completed, "2026-11-17")).toBe(2);
  });

  it("skips non-scheduled days for a weekday-only habit across a weekend", () => {
    const friday = "2026-11-20";
    const monday = "2026-11-23";

    expect(calculateCurrentStreak(weekdayHabit, [friday, monday], monday)).toBe(2);
  });

  it("ignores a completion recorded on a non-scheduled day", () => {
    const completed = ["2026-11-20", "2026-11-21", "2026-11-23"];

    expect(calculateCurrentStreak(weekdayHabit, completed, "2026-11-23")).toBe(2);
  });

  it("keeps the streak when today is not scheduled", () => {
    const completed = ["2026-11-19", "2026-11-20"];
    const saturday = "2026-11-21";

    expect(calculateCurrentStreak(weekdayHabit, completed, saturday)).toBe(2);
  });

  it("counts duplicate dates once", () => {
    const completed = ["2026-11-16", "2026-11-16", "2026-11-17"];

    expect(calculateCurrentStreak(dailyHabit, completed, "2026-11-17")).toBe(2);
  });

  it("returns the same result when completedDates are not sorted", () => {
    const completed = ["2026-11-17", "2026-11-15", "2026-11-16"];

    expect(calculateCurrentStreak(dailyHabit, completed, "2026-11-17")).toBe(3);
  });

  it("ignores completions before createdAt", () => {
    const habit = { repeatDays: ALL_DAYS, createdAt: "2026-11-16" };
    const completed = ["2026-11-14", "2026-11-15", "2026-11-16", "2026-11-17"];

    expect(calculateCurrentStreak(habit, completed, "2026-11-17")).toBe(2);
  });

  it("counts a completion on the createdAt day", () => {
    const habit = { repeatDays: ALL_DAYS, createdAt: "2026-11-15" };
    const completed = ["2026-11-15", "2026-11-16", "2026-11-17"];

    expect(calculateCurrentStreak(habit, completed, "2026-11-17")).toBe(3);
  });

  it("returns 0 for a habit created today that is not completed yet", () => {
    const habit = { repeatDays: ALL_DAYS, createdAt: "2026-11-17" };

    expect(calculateCurrentStreak(habit, [], "2026-11-17")).toBe(0);
  });

  it("does not count days before createdAt as missed", () => {
    const habit = { repeatDays: ALL_DAYS, createdAt: "2026-11-16" };
    const completed = ["2026-11-16", "2026-11-17"];

    expect(calculateCurrentStreak(habit, completed, "2026-11-17")).toBe(2);
  });

  it("ignores completions after today", () => {
    const completed = ["2026-11-17", "2026-11-18", "2026-11-19"];

    expect(calculateCurrentStreak(dailyHabit, completed, "2026-11-17")).toBe(1);
  });

  it("counts a run crossing a month boundary", () => {
    const completed = ["2026-11-30", "2026-12-01", "2026-12-02"];

    expect(calculateCurrentStreak(dailyHabit, completed, "2026-12-02")).toBe(3);
  });

  it("counts a run crossing a year boundary", () => {
    const completed = ["2026-12-31", "2027-01-01", "2027-01-02"];

    expect(calculateCurrentStreak(dailyHabit, completed, "2027-01-02")).toBe(3);
  });

  it("returns 0 when the habit is created after today", () => {
    const habit = { repeatDays: ALL_DAYS, createdAt: "2026-11-20" };

    expect(calculateCurrentStreak(habit, ["2026-11-17"], "2026-11-17")).toBe(0);
  });

  it("returns 0 for a habit with empty repeatDays even if dates are completed", () => {
    const habit = { repeatDays: [] as Weekday[], createdAt: "2026-01-01" };
    const completed = ["2026-11-16", "2026-11-17"];

    expect(calculateCurrentStreak(habit, completed, "2026-11-17")).toBe(0);
  });
});

describe("calculateLongestStreak", () => {
  it("returns 0 when there are no completions", () => {
    expect(calculateLongestStreak(dailyHabit, [], "2026-11-17")).toBe(0);
  });

  it("returns the current run when it is the longest", () => {
    const completed = ["2026-11-15", "2026-11-16", "2026-11-17"];

    expect(calculateLongestStreak(dailyHabit, completed, "2026-11-17")).toBe(3);
  });

  it("returns the longest past run when it is bigger than the current streak", () => {
    const completed = [
      "2026-11-10",
      "2026-11-11",
      "2026-11-12",
      "2026-11-13",
      "2026-11-16",
      "2026-11-17",
    ];

    expect(calculateLongestStreak(dailyHabit, completed, "2026-11-17")).toBe(4);
  });

  it("does not reduce the result when today is scheduled but not completed yet", () => {
    const completed = ["2026-11-14", "2026-11-15", "2026-11-16"];

    expect(calculateLongestStreak(dailyHabit, completed, "2026-11-17")).toBe(3);
  });

  it("splits runs at a missed day and returns the bigger one", () => {
    const completed = [
      "2026-11-01",
      "2026-11-02",
      "2026-11-04",
      "2026-11-05",
      "2026-11-06",
    ];

    expect(calculateLongestStreak(dailyHabit, completed, "2026-11-17")).toBe(3);
  });

  it("skips non-scheduled days inside a run for a weekday-only habit", () => {
    const completed = ["2026-11-13", "2026-11-16", "2026-11-17"];

    expect(calculateLongestStreak(weekdayHabit, completed, "2026-11-17")).toBe(3);
  });

  it("ignores a completion recorded on a non-scheduled day", () => {
    const completed = ["2026-11-20", "2026-11-21", "2026-11-22", "2026-11-23"];

    expect(calculateLongestStreak(weekdayHabit, completed, "2026-11-23")).toBe(2);
  });

  it("counts duplicate dates once", () => {
    const completed = ["2026-11-16", "2026-11-16", "2026-11-17"];

    expect(calculateLongestStreak(dailyHabit, completed, "2026-11-17")).toBe(2);
  });

  it("returns the same result when completedDates are not sorted", () => {
    const completed = ["2026-11-17", "2026-11-15", "2026-11-16"];

    expect(calculateLongestStreak(dailyHabit, completed, "2026-11-17")).toBe(3);
  });

  it("ignores completions before createdAt", () => {
    const habit = { repeatDays: ALL_DAYS, createdAt: "2026-11-16" };
    const completed = ["2026-11-13", "2026-11-14", "2026-11-15", "2026-11-16"];

    expect(calculateLongestStreak(habit, completed, "2026-11-17")).toBe(1);
  });

  it("counts a completion on the createdAt day", () => {
    const habit = { repeatDays: ALL_DAYS, createdAt: "2026-11-15" };
    const completed = ["2026-11-15", "2026-11-16", "2026-11-17"];

    expect(calculateLongestStreak(habit, completed, "2026-11-17")).toBe(3);
  });

  it("ignores completions after today", () => {
    const completed = ["2026-11-17", "2026-11-18", "2026-11-19"];

    expect(calculateLongestStreak(dailyHabit, completed, "2026-11-17")).toBe(1);
  });

  it("counts a run crossing a month boundary", () => {
    const completed = ["2026-11-30", "2026-12-01", "2026-12-02"];

    expect(calculateLongestStreak(dailyHabit, completed, "2026-12-05")).toBe(3);
  });

  it("counts a run crossing a year boundary", () => {
    const completed = ["2026-12-31", "2027-01-01", "2027-01-02"];

    expect(calculateLongestStreak(dailyHabit, completed, "2027-01-05")).toBe(3);
  });

  it("returns 0 for a habit with empty repeatDays", () => {
    const habit = { repeatDays: [] as Weekday[], createdAt: "2026-01-01" };
    const completed = ["2026-11-16", "2026-11-17"];

    expect(calculateLongestStreak(habit, completed, "2026-11-17")).toBe(0);
  });
});
