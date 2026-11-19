import { useLocalSearchParams } from "expo-router";

import { HabitDetailScreen } from "@/features/habits";
import { useToday } from "@/hooks/use-today";

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const today = useToday();

  return <HabitDetailScreen id={id} today={today} />;
}
