import { useRef, useState } from "react";
import {
  DEFAULT_ICON,
  DEFAULT_REMINDER_TIME,
  DEFAULT_REPEAT_DAYS,
} from "../constants";
import { useHabitStore } from "../store/habit-store";
import type { HabitIcon, Weekday } from "../types";
import { validateHabitInput } from "../utils/habit-input";
import { toggleWeekday } from "../utils/weekdays";

type UseHabitFormOptions = { onSaved: () => void };

export function useHabitForm({ onSaved }: UseHabitFormOptions) {
  const addHabit = useHabitStore((state) => state.addHabit);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<HabitIcon>(DEFAULT_ICON);
  const [repeatDays, setRepeatDays] = useState<Weekday[]>([...DEFAULT_REPEAT_DAYS]);

  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState(DEFAULT_REMINDER_TIME);
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
    addHabit({
      name,
      icon,
      repeatDays,
      ...(reminderEnabled && { reminderTime }),
    });
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
