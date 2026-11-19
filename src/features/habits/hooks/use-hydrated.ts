import { useHabitStore } from "../store/habit-store";

export function useHydrated(): boolean {
  return useHabitStore((state) => state.hydrated);
}
