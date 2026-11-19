import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { toDateKey } from "@/features/habits";

const defaultNow = () => new Date();

export function useToday(now: () => Date = defaultNow): string {
  const [today, setToday] = useState(() => toDateKey(now()));

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") setToday(toDateKey(now()));
    });
    return () => subscription.remove();
  }, [now]);

  return today;
}
