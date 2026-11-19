import { useMemo } from "react";
import { useHabitStore } from "../store/habit-store";
import { getTodayItems, type TodayItem } from "../utils/today";

export function useTodayHabits(today: string): TodayItem[] {
  const habits = useHabitStore((state) => state.habits);
  const completions = useHabitStore((state) => state.completions);

  return useMemo(
    () => getTodayItems(habits, completions, today),
    [habits, completions, today],
  );
}
