import { StyleSheet, Text, View } from "react-native";
import type { Palette } from "@/theme/colors";
import { useThemedStyles } from "@/theme/use-themed-styles";

type SettingsRowProps = {
  label: string;
  value: string;
};

export function SettingsRow({ label, value }: SettingsRowProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    label: { fontSize: 15, color: colors.muted },
    value: { fontSize: 15, fontWeight: "600", color: colors.ink },
  });
