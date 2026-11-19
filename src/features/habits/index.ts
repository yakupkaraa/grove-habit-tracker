// Feature'ın public API'si: dışarıdan sadece buradan import edilir.
export type { Completion, Habit, HabitIcon, Weekday } from "./types";
export { addDays, toDateKey } from "./utils/dates";

export { FilterChip } from "./components/filter-chip";
export { HabitRow } from "./components/habit-row";
export { SummaryCard } from "./components/summary-card";
export { EditHabitScreen } from "./components/edit-habit-screen";
export { HabitDetailScreen } from "./components/habit-detail-screen";
export { HabitFormScreen } from "./components/habit-form-screen";
export { TodayEmptyState } from "./components/today-empty-state";
export { TodayHeader } from "./components/today-header";
export { TodayScreen } from "./components/today-screen";

export { useHydrated } from "./hooks/use-hydrated";
export { useTodayHabits } from "./hooks/use-today-habits";
export { useHabitStore } from "./store/habit-store";
export {
  filterByTimeOfDay,
  getHighestStreak,
  getTodayItems,
  type TimeOfDayFilter,
  type TodayItem,
} from "./utils/today";
