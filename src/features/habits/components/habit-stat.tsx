import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type HabitStatProps = {
  label: string;
  value: string;
};

// One accessible element ("Mevcut seri: 2 gün"), so a screen reader never reads a value without its label.
export function HabitStat({ label, value }: HabitStatProps) {
  return (
    <View accessible accessibilityLabel={`${label}: ${value}`} style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: 4,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 28,
    backgroundColor: colors.card,
  },
  value: { fontSize: 22, fontWeight: "700", color: colors.ink },
  label: { fontSize: 12, color: colors.muted },
});
