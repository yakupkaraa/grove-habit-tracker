import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Palette } from "@/theme/colors";
import { useColors } from "@/theme/use-colors";
import { useThemedStyles } from "@/theme/use-themed-styles";
import { formatRepeatDays } from "../utils/repeat-label";
import type { TodayItem } from "../utils/today";

type HabitRowProps = {
  item: TodayItem;
  onToggle: (habitId: string) => void;
  onOpen: (habitId: string) => void;
};

const SUBTITLE_SEPARATOR = " · ";

function buildSubtitle({ habit, streak }: TodayItem): string {
  const streakPart = streak > 0 ? `${streak} gün` : undefined;

  return [formatRepeatDays(habit.repeatDays), habit.reminderTime, streakPart]
    .filter(Boolean)
    .join(SUBTITLE_SEPARATOR);
}

export const HabitRow = memo(function HabitRow({ item, onToggle, onOpen }: HabitRowProps) {
  const { habit } = item;
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      {/* Two sibling pressables (not nested): the body opens the detail, the circle toggles. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${habit.name}, ayrıntıları aç`}
        onPress={() => onOpen(habit.id)}
        style={styles.body}
      >
        <View style={styles.icon}>
          <Ionicons name={habit.icon} size={20} color={colors.ink} />
        </View>
        <View style={styles.texts}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {habit.name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            {buildSubtitle(item)}
          </Text>
        </View>
      </Pressable>
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

const createStyles = (colors: Palette) =>
  StyleSheet.create({
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
    body: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.iconBg,
      alignItems: "center",
      justifyContent: "center",
    },
    // flex: 1 + flexShrink: 1 lets the text column shrink so the icon and the check circle keep their size.
    texts: { flex: 1, flexShrink: 1 },
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
