import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RoundIconButton } from "@/components/ui/round-icon-button";
import { colors } from "@/theme/colors";
import { useHabitStore } from "../store/habit-store";
import { getHabitDetail } from "../utils/habit-detail";
import { formatRepeatDays } from "../utils/repeat-label";
import { HabitInfoRow } from "./habit-info-row";
import { HabitStat } from "./habit-stat";

const SCREEN_PADDING = 20;
const TOP_GAP = 8;
const SECTION_GAP = 14;
const PERCENT = 100;

type HabitDetailScreenProps = {
  id: string;
  today: string;
};

export function HabitDetailScreen({ id, today }: HabitDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const habit = useHabitStore((state) => state.habits.find((h) => h.id === id));
  const completions = useHabitStore((state) => state.completions);
  const removeHabit = useHabitStore((state) => state.removeHabit);
  const detail = useMemo(
    () => (habit ? getHabitDetail(habit, completions, today) : undefined),
    [habit, completions, today],
  );

  if (!habit || !detail) return null;

  const rate = detail.rate === null ? "—" : `%${Math.round(detail.rate * PERCENT)}`;

  // removeHabit also drops the habit's completions, so nothing is left orphaned.
  const deleteHabit = () => {
    removeHabit(habit.id);
    router.back();
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + TOP_GAP,
          paddingBottom: insets.bottom + SECTION_GAP,
          paddingHorizontal: SCREEN_PADDING,
          gap: SECTION_GAP,
        }}
      >
        <View style={styles.header}>
          <RoundIconButton
            icon="chevron-back"
            accessibilityLabel="Geri"
            onPress={() => router.back()}
          />
          <View style={styles.actions}>
            <RoundIconButton
              icon="create-outline"
              accessibilityLabel="Düzenle"
              onPress={() =>
                router.push({ pathname: "/habit/edit/[id]", params: { id: habit.id } })
              }
            />
            <RoundIconButton
              icon="trash-outline"
              accessibilityLabel="Sil"
              onPress={() =>
                Alert.alert(
                  "Alışkanlığı sil",
                  `"${habit.name}" ve tüm kayıtları silinecek.`,
                  [
                    { text: "Vazgeç", style: "cancel" },
                    { text: "Sil", style: "destructive", onPress: deleteHabit },
                  ],
                )
              }
            />
          </View>
        </View>
        <View style={styles.title}>
          <View style={styles.iconCircle}>
            <Ionicons name={habit.icon} size={30} color={colors.ink} />
          </View>
          <Text
            accessibilityRole="header"
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.name}
          >
            {habit.name}
          </Text>
        </View>
        <View style={styles.stats}>
          <HabitStat label="Mevcut seri" value={`${detail.currentStreak} gün`} />
          <HabitStat label="En uzun seri" value={`${detail.longestStreak} gün`} />
          <HabitStat label="Başarı (30 gün)" value={rate} />
        </View>
        <View style={styles.info}>
          <HabitInfoRow label="Tekrar" value={formatRepeatDays(habit.repeatDays)} />
          <HabitInfoRow label="Hatırlatma" value={habit.reminderTime ?? "Kapalı"} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", justifyContent: "space-between" },
  actions: { flexDirection: "row", gap: 8 },
  title: { gap: 12 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.iconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "500",
    letterSpacing: -0.6,
    color: colors.ink,
  },
  stats: { flexDirection: "row", gap: 10 },
  info: {
    gap: 14,
    padding: 20,
    borderRadius: 28,
    backgroundColor: colors.card,
  },
});
