import { StyleSheet, Text, View } from "react-native";
import type { Palette } from "@/theme/colors";
import { useThemedStyles } from "@/theme/use-themed-styles";

type HabitInfoRowProps = {
  label: string;
  value: string;
};

export function HabitInfoRow({ label, value }: HabitInfoRowProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View accessible accessibilityLabel={`${label}: ${value}`} style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    label: { fontSize: 14, color: colors.muted },
    value: { fontSize: 16, fontWeight: "600", color: colors.ink },
  });
