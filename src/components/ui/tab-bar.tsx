import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ICONS: Record<string, IconName> = {
  index: "today",
  stats: "stats-chart-outline",
};

export function TabBar({ state, descriptors, navigateToTab }:BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // [Bugün] [FAB] [İstatistik]: FAB absolute olduğu için sadece 2 tab render edilir
  return (
    <View style={[styles.bar, { bottom: Math.max(insets.bottom, 16) }]}>
      {state.routes.map((route, i) => {
        const active = state.index === i;
        const color = active ? colors.lime : colors.deepMuted;
        const label = descriptors[route.key].options.title ?? route.name;

        return (
          <Pressable
            key={route.key}
            style={styles.tab}
            onPress={() => navigateToTab(route.key)}
          >
            <Ionicons name={TAB_ICONS[route.name]} size={22} color={color} />
            <Text
              style={[styles.label, { color, fontWeight: active ? "700" : "500" }]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}

      <Pressable style={styles.fab} onPress={() => router.push("/habit/new")}>
        <Ionicons name="add" size={32} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.deep,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
  },
  tab: {
    width: 72,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: { fontSize: 11 },
  fab: {
    position: "absolute",
    left: "50%",
    top: -26,
    marginLeft: -35,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.lime,
    borderWidth: 6,
    borderColor: colors.bg, // FAB'ı bar'dan "oyulmuş" gösterir
    alignItems: "center",
    justifyContent: "center",
  },
});
