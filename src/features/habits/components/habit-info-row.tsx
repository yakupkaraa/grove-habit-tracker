import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type HabitInfoRowProps = {
  label: string;
  value: string;
};

export function HabitInfoRow({ label, value }: HabitInfoRowProps) {
  return (
    <View accessible accessibilityLabel={`${label}: ${value}`} style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 14, color: colors.muted },
  value: { fontSize: 16, fontWeight: "600", color: colors.ink },
});
