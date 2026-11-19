import { act, renderHook } from "@testing-library/react-native";
import { useHabitStore } from "../../store/habit-store";
import { makeHabit } from "../../test-utils";
import { useTodayHabits } from "../use-today-habits";

const TODAY = "2026-11-18"; // Wednesday

beforeEach(() => {
  useHabitStore.setState({ habits: [], completions: [] });
});

describe("useTodayHabits", () => {
  it("returns an empty list when the store is empty", async () => {
    const { result } = await renderHook(() => useTodayHabits(TODAY));

    expect(result.current).toEqual([]);
  });

  it("returns today's planned habits with done and streak from the store", async () => {
    const planned = makeHabit("planned");
    const otherWeekday = makeHabit("other", { repeatDays: [4] });
    useHabitStore.setState({
      habits: [planned, otherWeekday],
      completions: [
        { habitId: "planned", date: "2026-11-17" },
        { habitId: "planned", date: TODAY },
      ],
    });

    const { result } = await renderHook(() => useTodayHabits(TODAY));

    expect(result.current).toEqual([{ habit: planned, done: true, streak: 2 }]);
  });

  it("updates the items when a completion is toggled", async () => {
    useHabitStore.setState({ habits: [makeHabit("a")], completions: [] });
    const { result } = await renderHook(() => useTodayHabits(TODAY));

    await act(async () => {
      useHabitStore.getState().toggleCompletion("a", TODAY);
    });

    expect(result.current[0]).toMatchObject({ done: true, streak: 1 });
  });

  it("keeps the same array reference when it re-renders without store changes", async () => {
    useHabitStore.setState({ habits: [makeHabit("a")], completions: [] });
    const { result, rerender } = await renderHook(
      (today: string) => useTodayHabits(today),
      { initialProps: TODAY },
    );
    const before = result.current;

    await rerender(TODAY);

    expect(result.current).toBe(before);
  });

  it("recomputes the items when today changes", async () => {
    const thursdayOnly = makeHabit("thu", { repeatDays: [4] });
    useHabitStore.setState({ habits: [thursdayOnly], completions: [] });
    const { result, rerender } = await renderHook(
      (today: string) => useTodayHabits(today),
      { initialProps: TODAY },
    );
    expect(result.current).toEqual([]);

    await rerender("2026-11-19");

    expect(result.current.map((item) => item.habit.id)).toEqual(["thu"]);
  });
});
