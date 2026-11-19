import type { Weekday } from "../types";

export type HabitInputErrors = { name?: string; days?: string };

const NAME_ERROR = "Bir ad girin";
const DAYS_ERROR = "En az bir gün seçin";

export function validateHabitInput(input: {
  name: string;
  repeatDays: readonly Weekday[];
}): HabitInputErrors {
  const errors: HabitInputErrors = {};

  if (input.name.trim() === "") errors.name = NAME_ERROR;
  if (input.repeatDays.length === 0) errors.days = DAYS_ERROR;

  return errors;
}
