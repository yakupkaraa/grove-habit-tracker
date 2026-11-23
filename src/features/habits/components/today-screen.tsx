import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, type ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FilterChip } from "@/components/ui/filter-chip";
import type { Palette } from "@/theme/colors";
import { useThemedStyles } from "@/theme/use-themed-styles";
import { useHydrated } from "../hooks/use-hydrated";
import { useTodayHabits } from "../hooks/use-today-habits";
import { useHabitStore } from "../store/habit-store";
import {
  filterByTimeOfDay,
  getHighestStreak,
  type TimeOfDayFilter,
  type TodayItem,
} from "../utils/today";
import { HabitRow } from "./habit-row";
import { SummaryCard } from "./summary-card";
import { TodayEmptyState } from "./today-empty-state";
import { TodayHeader } from "./today-header";

const SCREEN_PADDING = 20;
const TOP_GAP = 8;
const TAB_BAR_CLEARANCE = 130; // keeps the last row above the floating tab bar
const ROW_GAP = 6;

const FILTERS: { value: TimeOfDayFilter; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "morning", label: "Sabah" },
  { value: "afternoon", label: "Öğle" },
  { value: "evening", label: "Akşam" },
];

const openSettings = () => router.push("/settings");
const openNewHabit = () => router.push("/habit/new");
// Module-level, so its identity is stable and the memoized rows never re-render for it.
const openHabit = (habitId: string) =>
  router.push({ pathname: "/habit/[id]", params: { id: habitId } });

type TodayScreenProps = {
  today: string;
};

export function TodayScreen({ today }: TodayScreenProps) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const hydrated = useHydrated();
  const items = useTodayHabits(today);
  const [filter, setFilter] = useState<TimeOfDayFilter>("all");
  const visibleItems = useMemo(() => filterByTimeOfDay(items, filter), [items, filter]);
  const toggleCompletion = useHabitStore((state) => state.toggleCompletion);
  const doneCount = items.filter((item) => item.done).length;
  const hasItems = items.length > 0;
  const allDone = hasItems && doneCount === items.length;
  const highestStreak = getHighestStreak(items);

  const handleToggle = useCallback(
    (habitId: string) => toggleCompletion(habitId, today),
    [toggleCompletion, today],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TodayItem>) => (
      <HabitRow item={item} onToggle={handleToggle} onOpen={openHabit} />
    ),
    [handleToggle],
  );


  if (!hydrated) return <View style={styles.screen} />;

  const header = (
    <View style={styles.header}>
      <TodayHeader streak={highestStreak} onPressSettings={openSettings} />
      <Text style={styles.title}>{allDone ? "Harika iş!" : "Küçük\nadımlar"}</Text>
      {hasItems ? (
        <>
          <View style={styles.chips}>
            {FILTERS.map(({ value, label }) => (
              <FilterChip
                key={value}
                label={label}
                selected={filter === value}
                onPress={() => setFilter(value)}
              />
            ))}
          </View>
          <SummaryCard done={doneCount} total={items.length} streak={highestStreak} />
        </>
      ) : (
        <TodayEmptyState onAddHabit={openNewHabit} />
      )}
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: insets.top + TOP_GAP,
        paddingHorizontal: SCREEN_PADDING,
        paddingBottom: insets.bottom + TAB_BAR_CLEARANCE,
        gap: ROW_GAP,
      }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={header}
      ListEmptyComponent={
        hasItems ? (
          <Text style={styles.noMatch}>Bu zaman diliminde alışkanlık yok</Text>
        ) : undefined
      }
      data={visibleItems}
      keyExtractor={(item) => item.habit.id}
      renderItem={renderItem}
    />
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    header: { gap: 10, marginBottom: 4 },
    chips: { flexDirection: "row", gap: 8 },
    noMatch: {
      fontSize: 14,
      color: colors.muted,
      textAlign: "center",
      paddingVertical: 24,
    },
    title: {
      fontSize: 42,
      lineHeight: 44,
      fontWeight: "500",
      letterSpacing: -0.8,
      color: colors.ink,
    },
  });
