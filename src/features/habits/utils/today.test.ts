import type { Completion, Habit, Weekday } from "../types";
import {
  filterByTimeOfDay,
  getTimeOfDay,
  getTodayItems,
  type TodayItem,
} from "./today";

const TODAY = "2026-11-18"; // Wednesday
const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

function makeHabit(id: string, overrides: Partial<Habit> = {}): Habit {
  return {
    id,
    name: `Habit ${id}`,
    icon: "water",
    color: "#2F6B45",
    repeatDays: ALL_DAYS,
    createdAt: "2026-01-01",
    ...overrides,
  };
}

function completion(habitId: string, date: string): Completion {
  return { habitId, date };
}

describe("getTodayItems", () => {
  it("returns an empty list when there are no habits", () => {
    expect(getTodayItems([], [], TODAY)).toEqual([]);
  });

  it("returns an empty list when no habit is scheduled today", () => {
    const thursdayOnly = makeHabit("a", { repeatDays: [4] });

    expect(getTodayItems([thursdayOnly], [], TODAY)).toEqual([]);
  });

  it("includes a habit scheduled today", () => {
    const habit = makeHabit("a", { repeatDays: [3] });

    const items = getTodayItems([habit], [], TODAY);

    expect(items.map((item) => item.habit.id)).toEqual(["a"]);
  });

  it("excludes a habit created after today", () => {
    const habit = makeHabit("a", { createdAt: "2026-11-19" });

    expect(getTodayItems([habit], [], TODAY)).toEqual([]);
  });

  it("includes a habit created today", () => {
    const habit = makeHabit("a", { createdAt: TODAY });

    expect(getTodayItems([habit], [], TODAY)).toHaveLength(1);
  });

  it("marks done as false when there is no completion", () => {
    const [item] = getTodayItems([makeHabit("a")], [], TODAY);

    expect(item.done).toBe(false);
  });

  it("marks done as true when the habit is completed today", () => {
    const [item] = getTodayItems(
      [makeHabit("a")],
      [completion("a", TODAY)],
      TODAY,
    );

    expect(item.done).toBe(true);
  });

  it("ignores completions on other days when computing done", () => {
    const [item] = getTodayItems(
      [makeHabit("a")],
      [completion("a", "2026-11-17"), completion("a", "2026-11-19")],
      TODAY,
    );

    expect(item.done).toBe(false);
  });

  it("ignores completions of other habits when computing done", () => {
    const items = getTodayItems(
      [makeHabit("a"), makeHabit("b")],
      [completion("b", TODAY)],
      TODAY,
    );

    expect(items.map((item) => item.done)).toEqual([false, true]);
  });

  it("includes the current streak of the habit", () => {
    const completions = [
      completion("a", "2026-11-16"),
      completion("a", "2026-11-17"),
      completion("a", TODAY),
    ];

    const [item] = getTodayItems([makeHabit("a")], completions, TODAY);

    expect(item.streak).toBe(3);
  });

  it("keeps the streak when today is not completed yet", () => {
    const completions = [completion("a", "2026-11-16"), completion("a", "2026-11-17")];

    const [item] = getTodayItems([makeHabit("a")], completions, TODAY);

    expect(item).toMatchObject({ done: false, streak: 2 });
  });

  it("returns the habit object unchanged", () => {
    const habit = makeHabit("a", { reminderTime: "08:00" });

    const [item] = getTodayItems([habit], [], TODAY);

    expect(item.habit).toBe(habit);
  });

  it("keeps the order of the habits", () => {
    const habits = [makeHabit("c"), makeHabit("a"), makeHabit("b")];

    const items = getTodayItems(habits, [completion("a", TODAY)], TODAY);

    expect(items.map((item) => item.habit.id)).toEqual(["c", "a", "b"]);
  });

  it("returns only planned habits when planned and unplanned habits are mixed", () => {
    const habits = [
      makeHabit("planned"),
      makeHabit("other-weekday", { repeatDays: [4] }),
      makeHabit("future", { createdAt: "2026-11-19" }),
    ];

    const items = getTodayItems(habits, [], TODAY);

    expect(items.map((item) => item.habit.id)).toEqual(["planned"]);
  });
});

describe("getTimeOfDay", () => {
  it("returns undefined when there is no reminderTime", () => {
    expect(getTimeOfDay(undefined)).toBeUndefined();
  });

  it("returns morning at midnight (00:00)", () => {
    expect(getTimeOfDay("00:00")).toBe("morning");
  });

  it("returns morning at 11:59", () => {
    expect(getTimeOfDay("11:59")).toBe("morning");
  });

  it("returns afternoon at 12:00", () => {
    expect(getTimeOfDay("12:00")).toBe("afternoon");
  });

  it("returns afternoon at 17:59", () => {
    expect(getTimeOfDay("17:59")).toBe("afternoon");
  });

  it("returns evening at 18:00", () => {
    expect(getTimeOfDay("18:00")).toBe("evening");
  });

  it("returns evening at 23:59", () => {
    expect(getTimeOfDay("23:59")).toBe("evening");
  });

  it("returns morning for an early time like 06:30", () => {
    expect(getTimeOfDay("06:30")).toBe("morning");
  });

  it.each(["abc", "25:99", ""])(
    "returns undefined when reminderTime is malformed (%p)",
    (reminderTime) => {
      expect(getTimeOfDay(reminderTime)).toBeUndefined();
    },
  );

  it("returns undefined when the hour is not zero-padded (9:30)", () => {
    expect(getTimeOfDay("9:30")).toBeUndefined();
  });

  it("returns undefined when the minutes are invalid (12:60)", () => {
    expect(getTimeOfDay("12:60")).toBeUndefined();
  });
});

function item(id: string, reminderTime?: string): TodayItem {
  return { habit: makeHabit(id, { reminderTime }), done: false, streak: 0 };
}

describe("filterByTimeOfDay", () => {
  it('returns every item for "all", including items without reminderTime', () => {
    const items = [item("a", "08:00"), item("b"), item("c", "20:00")];

    expect(filterByTimeOfDay(items, "all")).toEqual(items);
  });

  it('returns only morning items for "morning"', () => {
    const morning = item("a", "08:00");
    const items = [morning, item("b", "13:00"), item("c", "20:00")];

    expect(filterByTimeOfDay(items, "morning")).toEqual([morning]);
  });

  it('returns only afternoon items for "afternoon"', () => {
    const afternoon = item("b", "13:00");
    const items = [item("a", "08:00"), afternoon, item("c", "20:00")];

    expect(filterByTimeOfDay(items, "afternoon")).toEqual([afternoon]);
  });

  it('returns only evening items for "evening"', () => {
    const evening = item("c", "20:00");
    const items = [item("a", "08:00"), item("b", "13:00"), evening];

    expect(filterByTimeOfDay(items, "evening")).toEqual([evening]);
  });

  it("leaves out items without reminderTime for any specific time of day", () => {
    const items = [item("a"), item("b", "bozuk")];

    expect(filterByTimeOfDay(items, "morning")).toEqual([]);
    expect(filterByTimeOfDay(items, "afternoon")).toEqual([]);
    expect(filterByTimeOfDay(items, "evening")).toEqual([]);
  });

  it("keeps the order of the items", () => {
    const items = [item("c", "10:00"), item("a", "07:00"), item("b", "09:30")];

    const ids = filterByTimeOfDay(items, "morning").map((i) => i.habit.id);

    expect(ids).toEqual(["c", "a", "b"]);
  });

  it("returns an empty list when nothing matches", () => {
    const items = [item("a", "08:00"), item("b")];

    expect(filterByTimeOfDay(items, "evening")).toEqual([]);
  });
});
