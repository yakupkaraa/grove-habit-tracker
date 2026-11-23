import { useMemo, useState } from "react";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FilterChip } from "@/components/ui/filter-chip";
import { colors } from "@/theme/colors";
import { useHydrated } from "../hooks/use-hydrated";
import { useHabitStore } from "../store/habit-store";
import { describeCompletionDays } from "../utils/describe-completion-days";
import { formatPercent } from "../utils/format-percent";
import { getStatsOverview } from "../utils/stats-overview";
import { CompletionBars } from "./completion-bars";
import { HabitRateRow } from "./habit-rate-row";
import { ProgressRingScene } from "./progress-ring-scene";
import { TodayEmptyState } from "./today-empty-state";

const SCREEN_PADDING = 20;
const TOP_GAP = 8;
const TAB_BAR_CLEARANCE = 130; // keeps the last block above the floating tab bar
const SECTION_GAP = 14;
const RING_SIZE = 140;
const openNewHabit = () => router.push("/habit/new");
// Module-level, so its identity is stable and the memoized rows never re-render for it.
const openHabit = (habitId: string) =>
  router.push({ pathname: "/habit/[id]", params: { id: habitId } });

const RANGES = [
  { days: 7, label: "7 gün" },
  { days: 30, label: "30 gün" },
] as const;

type StatsScreenProps = {
  today: string;
};

export function StatsScreen({ today }: StatsScreenProps) {
  const insets = useSafeAreaInsets();
  const hydrated = useHydrated();
  const habits = useHabitStore((state) => state.habits);
  const completions = useHabitStore((state) => state.completions);
  const [rangeDays, setRangeDays] = useState<number>(RANGES[0].days);
  const overview = useMemo(
    () => getStatsOverview(habits, completions, today, rangeDays),
    [habits, completions, today, rangeDays],
  );
  const rate = overview.rate ?? 0;

  // Before the stored habits are loaded "no habits" would be a lie: show only the background.
  if (!hydrated) return <View style={styles.screen} />;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: insets.top + TOP_GAP,
        paddingHorizontal: SCREEN_PADDING,
        paddingBottom: insets.bottom + TAB_BAR_CLEARANCE,
        gap: SECTION_GAP,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text accessibilityRole="header" style={styles.title}>
        İlerleme
      </Text>
      {habits.length === 0 ? (
        <TodayEmptyState onAddHabit={openNewHabit} />
      ) : (
        <>
          <View style={styles.chips}>
            {RANGES.map(({ days, label }) => (
              <FilterChip
                key={days}
                label={label}
                selected={rangeDays === days}
                onPress={() => setRangeDays(days)}
              />
            ))}
          </View>
          <View style={styles.card}>
            <ProgressRingScene progress={rate} size={RING_SIZE} label="Başarı oranı" />
            <View style={styles.texts}>
              <Text style={styles.rate}>{formatPercent(overview.rate)}</Text>
              <Text style={styles.label}>
                {`${overview.doneDays}/${overview.plannedDays} tamamlandı`}
              </Text>
            </View>
          </View>
          {overview.longestStreak && (
            <View style={styles.streak}>
              <Text style={styles.streakLabel}>Tüm zamanların en uzun serisi</Text>
              <Text style={styles.streakValue} numberOfLines={1} ellipsizeMode="tail">
                {`${overview.longestStreak.days} gün · ${overview.longestStreak.habit.name}`}
              </Text>
            </View>
          )}
          <View style={styles.chart}>
            {overview.plannedDays === 0 ? (
              <Text style={styles.noDays}>Bu aralıkta henüz planlı gün yok</Text>
            ) : (
              <CompletionBars
                days={overview.days}
                label={describeCompletionDays(overview.days, overview)}
              />
            )}
          </View>
          <View style={styles.rows}>
            {overview.habits.map(({ habit, rate: habitRate }) => (
              <HabitRateRow key={habit.id} habit={habit} rate={habitRate} onOpen={openHabit} />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: {
    fontSize: 42,
    lineHeight: 44,
    fontWeight: "500",
    letterSpacing: -0.8,
    color: colors.ink,
  },
  chips: { flexDirection: "row", gap: 8 },
  streak: {
    gap: 2,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 28,
    backgroundColor: colors.deep,
  },
  streakLabel: { fontSize: 13, color: colors.deepMuted },
  streakValue: { fontSize: 20, fontWeight: "600", color: colors.lime },
  chart: { padding: 16, borderRadius: 32, backgroundColor: colors.card },
  noDays: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    paddingVertical: 24,
  },
  rows: { gap: 6 },
  card: {
    height: 160,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    padding: 10,
    paddingRight: 24,
    borderRadius: 40,
    backgroundColor: colors.card,
  },
  texts: { flex: 1 },
  rate: { fontSize: 44, lineHeight: 46, fontWeight: "600", color: colors.ink },
  label: { fontSize: 15, color: colors.muted, marginTop: 2 },
});
