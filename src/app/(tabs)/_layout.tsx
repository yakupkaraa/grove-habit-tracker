import { Tabs } from "expo-router/js-tabs";

import { TabBar } from "@/components/ui/tab-bar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Bugün" }} />
      <Tabs.Screen name="stats" options={{ title: "İstatistik" }} />
    </Tabs>
  );
}
