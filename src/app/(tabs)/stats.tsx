import { StatsScreen } from "@/features/habits";
import { useToday } from "@/hooks/use-today";

export default function Stats() {
  return <StatsScreen today={useToday()} />;
}
