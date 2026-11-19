import { Stack } from "expo-router";
import { useEffect } from "react";

import { seedWhenHydrated } from "@/dev/seed"; // DEV ONLY: yayından önce sil
import { toDateKey } from "@/features/habits";

export default function RootLayout() {
  // DEV ONLY: yayından önce sil (örnek alışkanlıklar, store boşsa bir kez eklenir)
  useEffect(() => seedWhenHydrated(toDateKey(new Date())), []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="habit/new" options={{ presentation: "modal" }} />
      <Stack.Screen name="habit/[id]" />
      <Stack.Screen name="habit/edit/[id]" options={{ presentation: "modal" }} />
    </Stack>
  );
}
