import { TodayScreen } from "@/features/habits";
import { useToday } from "@/hooks/use-today";

export default function Today() {
  return <TodayScreen today={useToday()} />;
}
