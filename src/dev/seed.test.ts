import { act } from "@testing-library/react-native";
import { getTodayItems, useHabitStore } from "@/features/habits";
import { seedWhenHydrated } from "./seed";

const TODAY = "2026-11-18";

beforeEach(() => {
  useHabitStore.setState({ habits: [], completions: [], hydrated: true });
});

describe("seedWhenHydrated", () => {
  it("seeds sample habits with past completions when the store is empty", () => {
    seedWhenHydrated(TODAY);

    const { habits, completions } = useHabitStore.getState();
    expect(habits.length).toBeGreaterThanOrEqual(4);
    expect(habits.every((habit) => habit.createdAt <= TODAY)).toBe(true);
    expect(completions.length).toBeGreaterThan(0);
  });

  it("gives several habits a visible streak and leaves some undone today", () => {
    seedWhenHydrated(TODAY);

    const { habits, completions } = useHabitStore.getState();
    const items = getTodayItems(habits, completions, TODAY);
    expect(items.filter((item) => item.streak > 0).length).toBeGreaterThanOrEqual(3);
    expect(items.some((item) => item.done)).toBe(true);
    expect(items.some((item) => !item.done)).toBe(true);
  });

  it("does not seed when the store already has habits", () => {
    useHabitStore.getState().addHabit({
      name: "Benim alışkanlığım",
      icon: "water-outline",
      color: "#2F6B45",
      repeatDays: [1],
    });

    seedWhenHydrated(TODAY);

    const names = useHabitStore.getState().habits.map((habit) => habit.name);
    expect(names).toEqual(["Benim alışkanlığım"]);
  });

  it("is idempotent: calling it twice does not duplicate anything", () => {
    seedWhenHydrated(TODAY);
    const afterFirst = useHabitStore.getState();

    seedWhenHydrated(TODAY);

    const afterSecond = useHabitStore.getState();
    expect(afterSecond.habits).toEqual(afterFirst.habits);
    expect(afterSecond.completions).toEqual(afterFirst.completions);
  });

  it("waits for hydration before seeding", async () => {
    useHabitStore.setState({ hydrated: false });
    seedWhenHydrated(TODAY);
    expect(useHabitStore.getState().habits).toEqual([]);

    await act(async () => {
      useHabitStore.setState({ hydrated: true });
    });

    expect(useHabitStore.getState().habits.length).toBeGreaterThanOrEqual(4);
  });

  it("does not reseed after the user deletes every habit", async () => {
    useHabitStore.setState({ hydrated: false });
    seedWhenHydrated(TODAY);
    await act(async () => {
      useHabitStore.setState({ hydrated: true });
    });

    await act(async () => {
      useHabitStore.setState({ habits: [], completions: [] });
    });

    expect(useHabitStore.getState().habits).toEqual([]);
  });

  it("does nothing outside development", () => {
    const globals = globalThis as { __DEV__?: boolean };
    globals.__DEV__ = false;

    try {
      seedWhenHydrated(TODAY);
    } finally {
      globals.__DEV__ = true;
    }

    expect(useHabitStore.getState().habits).toEqual([]);
  });
});
