import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type FieldLabelProps = {
  children: string;
  error?: string;
};

export function FieldLabel({ children, error }: FieldLabelProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{children}</Text>
      {error !== undefined && (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={styles.error}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
  },
  label: { fontSize: 13, fontWeight: "600", color: colors.muted },
  error: { fontSize: 13, fontWeight: "600", color: colors.danger, paddingRight: 20 },
});
