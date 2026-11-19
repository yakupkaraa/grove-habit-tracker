import type { HabitIcon, Weekday } from "./types";

export const HABIT_ICONS: readonly { name: HabitIcon; label: string }[] = [
  { name: "water-outline", label: "Su" },
  { name: "book-outline", label: "Kitap" },
  { name: "walk-outline", label: "Yürüyüş" },
  { name: "leaf-outline", label: "Yaprak" },
  { name: "chatbubble-outline", label: "Sohbet" },
  { name: "sunny-outline", label: "Güneş" },
];

export const DEFAULT_ICON: HabitIcon = "walk-outline";
export const DEFAULT_REPEAT_DAYS: readonly Weekday[] = [1, 2, 3, 4, 5];
export const DEFAULT_REMINDER_TIME = "07:30";
