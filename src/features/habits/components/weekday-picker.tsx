import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import type { Weekday } from "../types";
import { MONDAY_FIRST, SHORT_WEEKDAY_NAMES, WEEKDAY_NAMES } from "../utils/weekdays";

type WeekdayPickerProps = {
  selectedDays: readonly Weekday[];
  onToggle: (day: Weekday) => void;
};

export function WeekdayPicker({ selectedDays, onToggle }: WeekdayPickerProps) {
  return (
    <View style={styles.row}>
      {MONDAY_FIRST.map((day) => {
        const selected = selectedDays.includes(day);

        return (
          <Pressable
            key={day}
            accessibilityRole="button"
            accessibilityLabel={WEEKDAY_NAMES[day]}
            accessibilityState={{ selected }}
            onPress={() => onToggle(day)}
            style={[styles.day, selected && styles.daySelected]}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>
              {SHORT_WEEKDAY_NAMES[day]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between" },
  day: {
    width: 42,
    height: 56,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  daySelected: { backgroundColor: colors.deep },
  text: { fontSize: 12, fontWeight: "700", color: colors.ink },
  textSelected: { color: colors.lime },
});
