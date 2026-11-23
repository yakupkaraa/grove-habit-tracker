import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import type { Habit } from "../types";
import { formatPercent } from "../utils/format-percent";

type HabitRateRowProps = {
  habit: Habit;
  rate: number | null;
  onOpen: (habitId: string) => void;
};

export const HabitRateRow = memo(function HabitRateRow({ habit, rate, onOpen }: HabitRateRowProps) {
  const spokenRate = rate === null ? "oran yok" : formatPercent(rate);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${habit.name}: ${spokenRate}, ayrıntıları aç`}
      onPress={() => onOpen(habit.id)}
      style={styles.row}
    >
      <View style={styles.icon}>
        <Ionicons name={habit.icon} size={20} color={colors.ink} />
      </View>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {habit.name}
      </Text>
      <Text style={styles.rate}>{formatPercent(rate)}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingLeft: 8,
    paddingRight: 20,
    borderRadius: 28,
    backgroundColor: colors.card,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.iconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  // flex: 1 + flexShrink: 1 lets a long name shrink so the icon and the rate keep their size.
  name: { flex: 1, flexShrink: 1, fontSize: 16, fontWeight: "600", color: colors.ink },
  rate: { fontSize: 16, fontWeight: "600", color: colors.ink },
});
