import { act, renderHook } from "@testing-library/react-native";
import { useHabitStore } from "../store/habit-store";
import { useHydrated } from "./use-hydrated";

describe("useHydrated", () => {
  it("returns true when the store has already hydrated", async () => {
    useHabitStore.setState({ hydrated: true });

    const { result } = await renderHook(() => useHydrated());

    expect(result.current).toBe(true);
  });

  it("returns false while the store is not hydrated and becomes true when hydration finishes", async () => {
    useHabitStore.setState({ hydrated: false });
    const { result } = await renderHook(() => useHydrated());
    expect(result.current).toBe(false);

    await act(async () => {
      useHabitStore.setState({ hydrated: true });
    });

    expect(result.current).toBe(true);
  });
});
