import { makeHabit } from "../../test-utils";
import type { Completion } from "../../types";
import { addDays } from "../dates";
import { getStatsOverview } from "../stats-overview";

const TODAY = "2026-11-18";

// Completions for every day from `from` to `to` (inclusive).
function doneEveryDay(habitId: string, from: string, to: string): Completion[] {
  const completions: Completion[] = [];
  for (let date = from; date <= to; date = addDays(date, 1)) {
    completions.push({ habitId, date });
  }
  return completions;
}

describe("getStatsOverview", () => {
  it("aggregates the planned and done days of all habits into one rate", () => {
    const habits = [makeHabit("a"), makeHabit("b")];
    const completions = [
      ...doneEveryDay("a", "2026-11-12", TODAY), // 7 of 7
      ...doneEveryDay("b", "2026-11-16", TODAY), // 3 of 7
    ];

    const overview = getStatsOverview(habits, completions, TODAY, 7);

    expect(overview.plannedDays).toBe(14);
    expect(overview.doneDays).toBe(10);
    expect(overview.rate).toBeCloseTo(10 / 14);
  });

  it("does not count a pending today as a miss", () => {
    const completions = doneEveryDay("a", "2026-11-12", "2026-11-17");

    const overview = getStatsOverview([makeHabit("a")], completions, TODAY, 7);

    expect(overview.rate).toBe(1);
    expect(overview.plannedDays).toBe(6);
  });

  it("counts today when it is completed", () => {
    // Created yesterday: one missed day plus today done.
    const habit = makeHabit("a", { createdAt: "2026-11-17" });

    const overview = getStatsOverview([habit], [{ habitId: "a", date: TODAY }], TODAY, 7);

    expect(overview.rate).toBe(0.5);
  });

  it("returns a null rate when no day has been planned in the range", () => {
    const habit = makeHabit("a", { createdAt: TODAY });

    const overview = getStatsOverview([habit], [], TODAY, 7);

    expect(overview.rate).toBeNull();
    expect(overview.plannedDays).toBe(0);
  });

  it("only looks at the selected range", () => {
    // Done in the week before the last 7 days, missed in the last 7.
    const completions = doneEveryDay("a", "2026-11-05", "2026-11-11");

    const week = getStatsOverview([makeHabit("a")], completions, TODAY, 7);
    const twoWeeks = getStatsOverview([makeHabit("a")], completions, TODAY, 14);

    expect(week.doneDays).toBe(0);
    expect(twoWeeks.doneDays).toBe(7);
  });

  it("returns one day entry per day of the range, oldest first, ending today", () => {
    const overview = getStatsOverview([makeHabit("a")], [], TODAY, 3);

    expect(overview.days.map((day) => day.date)).toEqual([
      "2026-11-16",
      "2026-11-17",
      "2026-11-18",
    ]);
  });

  it("gives each day its planned and done counts and a done ratio, 0 when nothing was planned", () => {
    const habits = [makeHabit("a", { createdAt: "2026-11-17" }), makeHabit("b", { createdAt: "2026-11-17" })];
    const completions = [
      { habitId: "a", date: "2026-11-17" },
      { habitId: "a", date: TODAY },
      { habitId: "b", date: TODAY },
    ];

    const { days } = getStatsOverview(habits, completions, TODAY, 3);

    expect(days).toEqual([
      { date: "2026-11-16", planned: 0, done: 0, ratio: 0 },
      { date: "2026-11-17", planned: 2, done: 1, ratio: 0.5 },
      { date: TODAY, planned: 2, done: 2, ratio: 1 },
    ]);
  });

  it("returns the rate of each habit in the store order, null for a habit without planned days", () => {
    const habits = [makeHabit("b"), makeHabit("a"), makeHabit("new", { createdAt: TODAY })];
    const completions = [
      ...doneEveryDay("a", "2026-11-12", TODAY), // 7 of 7
      ...doneEveryDay("b", "2026-11-16", TODAY), // 3 of 7
    ];

    const overview = getStatsOverview(habits, completions, TODAY, 7);

    expect(overview.habits.map(({ habit }) => habit.id)).toEqual(["b", "a", "new"]);
    expect(overview.habits[0].rate).toBeCloseTo(3 / 7);
    expect(overview.habits[1].rate).toBe(1);
    expect(overview.habits[2].rate).toBeNull();
  });

  it("returns the all-time longest streak with its habit, whatever the selected range", () => {
    const habits = [makeHabit("a"), makeHabit("b")];
    const completions = [
      ...doneEveryDay("a", "2026-10-01", "2026-10-04"), // 4 days, outside the range
      ...doneEveryDay("b", "2026-11-16", TODAY), // 3 days
    ];

    const { longestStreak } = getStatsOverview(habits, completions, TODAY, 7);

    expect(longestStreak?.habit.id).toBe("a");
    expect(longestStreak?.days).toBe(4);
  });

  it("picks the first habit in store order when the longest streaks tie", () => {
    const habits = [makeHabit("second-in-id-order"), makeHabit("a")];
    const completions = [
      ...doneEveryDay("a", "2026-11-16", TODAY),
      ...doneEveryDay("second-in-id-order", "2026-11-16", TODAY),
    ];

    const { longestStreak } = getStatsOverview(habits, completions, TODAY, 7);

    expect(longestStreak?.habit.id).toBe("second-in-id-order");
  });

  it("returns no longest streak when there are no habits or nothing was ever completed", () => {
    expect(getStatsOverview([], [], TODAY, 7).longestStreak).toBeNull();
    expect(getStatsOverview([makeHabit("a")], [], TODAY, 7).longestStreak).toBeNull();
  });
});
