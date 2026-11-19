import { useHabitStore } from "../store/habit-store";
import { HabitFormScreen } from "./habit-form-screen";

type EditHabitScreenProps = {
  id: string;
};

export function EditHabitScreen({ id }: EditHabitScreenProps) {
  const habit = useHabitStore((state) => state.habits.find((h) => h.id === id));

  if (!habit) return null;

  return <HabitFormScreen habit={habit} />;
}
