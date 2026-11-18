import type { Ionicons } from "@expo/vector-icons";

export type HabitIcon = React.ComponentProps<typeof Ionicons>["name"];

// 0 = Pazar ... 6 = Cumartesi (Date.getDay() ile aynı)
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Habit = {
  id: string;
  name: string;
  icon: HabitIcon;
  color: string;
  repeatDays: Weekday[];
  reminderTime?: string; // "HH:mm"
  createdAt: string; // ISO string
};

export type Completion = {
  habitId: string;
  date: string; // "YYYY-MM-DD"
};
