import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { seedWhenHydrated } from "@/dev/seed"; // DEV ONLY: yayından önce sil
import { toDateKey } from "@/features/habits";
import { useApplyTheme } from "@/theme/use-apply-theme";
import { useColors } from "@/theme/use-colors";

export default function RootLayout() {
  const colors = useColors();
  useApplyTheme();

  // DEV ONLY: yayından önce sil (örnek alışkanlıklar, store boşsa bir kez eklenir)
  useEffect(() => seedWhenHydrated(toDateKey(new Date())), []);

  return (
    <>
      {/* "auto" follows the effective scheme, which useApplyTheme hands to the OS. */}
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="habit/new" options={{ presentation: "modal" }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="habit/[id]" />
        <Stack.Screen name="habit/edit/[id]" options={{ presentation: "modal" }} />
      </Stack>
    </>
  );
}
