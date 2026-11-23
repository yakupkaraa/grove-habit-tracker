import { StyleSheet, Text, View } from "react-native";
import type { Palette } from "@/theme/colors";
import { useThemedStyles } from "@/theme/use-themed-styles";

type FieldLabelProps = {
  children: string;
  error?: string;
};

export function FieldLabel({ children, error }: FieldLabelProps) {
  const styles = useThemedStyles(createStyles);

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

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: 20,
    },
    label: { fontSize: 13, fontWeight: "600", color: colors.muted },
    error: { fontSize: 13, fontWeight: "600", color: colors.danger, paddingRight: 20 },
  });
