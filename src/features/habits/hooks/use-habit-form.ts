import { useRef, useState } from "react";
import {
  DEFAULT_ICON,
  DEFAULT_REMINDER_TIME,
  DEFAULT_REPEAT_DAYS,
} from "../constants";
import { useHabitStore } from "../store/habit-store";
import type { Habit, HabitIcon, Weekday } from "../types";
import { validateHabitInput } from "../utils/habit-input";
import { toggleWeekday } from "../utils/weekdays";

type UseHabitFormOptions = {
  onSaved: () => void;
  habit?: Habit; // edit mode: start from this habit and update it on submit
};

export function useHabitForm({ onSaved, habit }: UseHabitFormOptions) {
  const addHabit = useHabitStore((state) => state.addHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);
  const [name, setName] = useState(habit?.name ?? "");
  const [icon, setIcon] = useState<HabitIcon>(habit?.icon ?? DEFAULT_ICON);
  const [repeatDays, setRepeatDays] = useState<Weekday[]>(
    habit ? [...habit.repeatDays] : [...DEFAULT_REPEAT_DAYS],
  );

  // New habits start with the reminder on; an existing one keeps whatever it had.
  const [reminderEnabled, setReminderEnabled] = useState(
    habit ? habit.reminderTime !== undefined : true,
  );
  const [reminderTime, setReminderTime] = useState(
    habit?.reminderTime ?? DEFAULT_REMINDER_TIME,
  );
  const [submitted, setSubmitted] = useState(false);
  // A ref, not state: a fast double tap runs submit twice before React re-renders.
  const saved = useRef(false);

  const validation = validateHabitInput({ name, repeatDays });
  // Derived from the current fields, so an error disappears the moment it is fixed.
  const errors = submitted ? validation : {};

  const toggleDay = (day: Weekday) => setRepeatDays((days) => toggleWeekday(days, day));

  const submit = () => {
    if (saved.current) return;
    setSubmitted(true);
    if (Object.keys(validation).length > 0) return;

    saved.current = true;
    if (habit) {
      // `reminderTime: undefined` tells the store to drop the reminder.
      updateHabit(habit.id, {
        name,
        icon,
        repeatDays,
        reminderTime: reminderEnabled ? reminderTime : undefined,
      });
    } else {
      addHabit({
        name,
        icon,
        repeatDays,
        ...(reminderEnabled && { reminderTime }),
      });
    }
    onSaved();
  };

  return {
    name,
    setName,
    icon,
    setIcon,
    repeatDays,
    toggleDay,
    reminderEnabled,
    setReminderEnabled,
    reminderTime,
    setReminderTime,
    errors,
    submit,
  };
}
