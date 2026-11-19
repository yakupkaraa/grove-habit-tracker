import { HABIT_NAME_MAX_LENGTH } from "../constants";
import type { Weekday } from "../types";

export type HabitInputErrors = { name?: string; days?: string };

const NAME_ERROR = "Bir ad girin";
const NAME_TOO_LONG_ERROR = `Ad en fazla ${HABIT_NAME_MAX_LENGTH} karakter olabilir`;
const DAYS_ERROR = "En az bir gün seçin";

export function validateHabitInput(input: {
  name: string;
  repeatDays: readonly Weekday[];
}): HabitInputErrors {
  const errors: HabitInputErrors = {};

  const name = input.name.trim();

  if (name === "") errors.name = NAME_ERROR;
  else if (name.length > HABIT_NAME_MAX_LENGTH) errors.name = NAME_TOO_LONG_ERROR;
  if (input.repeatDays.length === 0) errors.days = DAYS_ERROR;

  return errors;
}
