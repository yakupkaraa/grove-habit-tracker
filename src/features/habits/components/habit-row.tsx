import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { formatRepeatDays } from "../utils/repeat-label";
import type { TodayItem } from "../utils/today";

type HabitRowProps = {
  item: TodayItem;
  onToggle: (habitId: string) => void;
};

const SUBTITLE_SEPARATOR = " · ";

function buildSubtitle({ habit, streak }: TodayItem): string {
  const streakPart = streak > 0 ? `${streak} gün` : undefined;

  return [formatRepeatDays(habit.repeatDays), habit.reminderTime, streakPart]
    .filter(Boolean)
    .join(SUBTITLE_SEPARATOR);
}

export const HabitRow = memo(function HabitRow({ item, onToggle }: HabitRowProps) {
  const { habit } = item;

  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Ionicons name={habit.icon} size={20} color={colors.ink} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.name}>{habit.name}</Text>
        <Text style={styles.subtitle}>{buildSubtitle(item)}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          item.done ? `${habit.name} tamamlandı, geri al` : `${habit.name} tamamla`
        }
        onPress={() => onToggle(habit.id)}
        style={[styles.check, item.done && styles.checkDone]}
      >
        {item.done && <Ionicons name="checkmark" size={18} color={colors.lime} />}
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingLeft: 8,
    paddingRight: 10,
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
  texts: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: colors.ink },
  subtitle: { fontSize: 12, color: colors.muted },
  check: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.ring,
    alignItems: "center",
    justifyContent: "center",
  },
  checkDone: { backgroundColor: colors.deep, borderColor: colors.deep },
});
