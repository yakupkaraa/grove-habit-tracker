import { useLocalSearchParams } from "expo-router";

import { EditHabitScreen } from "@/features/habits";

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <EditHabitScreen id={id} />;
}
