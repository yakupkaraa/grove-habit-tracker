import { makeHabit } from "../../test-utils";
import type { Completion } from "../../types";
import { addDays } from "../dates";
import { getHabitDetail } from "../habit-detail";

const TODAY = "2026-11-18";

// Completions for every day from `from` to `to` (inclusive).
function doneEveryDay(habitId: string, from: string, to: string): Completion[] {
  const completions: Completion[] = [];
  for (let date = from; date <= to; date = addDays(date, 1)) {
    completions.push({ habitId, date });
  }
  return completions;
}

describe("getHabitDetail", () => {
  it("returns the current and the longest streak separately", () => {
    const habit = makeHabit("a");
    const completions = [
      ...doneEveryDay("a", "2026-11-01", "2026-11-04"),
      ...doneEveryDay("a", "2026-11-16", "2026-11-17"),
    ];

    const detail = getHabitDetail(habit, completions, TODAY);

    expect(detail.currentStreak).toBe(2);
    expect(detail.longestStreak).toBe(4);
  });

  it("ignores completions of other habits", () => {
    const completions = doneEveryDay("other", "2026-11-10", "2026-11-18");

    const detail = getHabitDetail(makeHabit("a"), completions, TODAY);

    expect(detail.currentStreak).toBe(0);
    expect(detail.longestStreak).toBe(0);
  });

  it("computes the rate over the last 30 days only", () => {
    // Created long ago, so older days would count as misses if the window were not limited.
    const habit = makeHabit("a", { createdAt: "2026-01-01" });
    const completions = doneEveryDay("a", "2026-10-20", TODAY).filter(
      (c) => !["2026-10-25", "2026-11-02", "2026-11-09"].includes(c.date),
    );

    const detail = getHabitDetail(habit, completions, TODAY);

    expect(detail.rate).toBeCloseTo(27 / 30);
  });

  it("uses the given window length instead of 30 days", () => {
    const habit = makeHabit("a", { createdAt: "2026-01-01" });
    const completions = doneEveryDay("a", "2026-11-12", TODAY);

    const detail = getHabitDetail(habit, completions, TODAY, 7);

    expect(detail.rate).toBe(1);
  });

  it("returns the planned and done day counts of the window", () => {
    const habit = makeHabit("a", { createdAt: "2026-01-01" });
    const completions = doneEveryDay("a", "2026-11-14", TODAY);

    const detail = getHabitDetail(habit, completions, TODAY, 7);

    expect(detail.plannedDays).toBe(7);
    expect(detail.doneDays).toBe(5);
  });

  it("does not count a pending today as a miss", () => {
    const completions = doneEveryDay("a", "2026-10-20", "2026-11-17");

    const detail = getHabitDetail(makeHabit("a"), completions, TODAY);

    expect(detail.rate).toBe(1);
  });

  it("counts today when it is completed", () => {
    // Created yesterday: one missed day plus today done.
    const habit = makeHabit("a", { createdAt: "2026-11-17" });

    const detail = getHabitDetail(habit, [{ habitId: "a", date: TODAY }], TODAY);

    expect(detail.rate).toBe(0.5);
  });

  it("returns a null rate when no day has been planned in the window", () => {
    const habit = makeHabit("a", { createdAt: TODAY });

    const detail = getHabitDetail(habit, [], TODAY);

    expect(detail.rate).toBeNull();
  });
});
