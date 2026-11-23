import { Pressable, StyleSheet, Text } from "react-native";
import type { Palette } from "@/theme/colors";
import { useThemedStyles } from "@/theme/use-themed-styles";

type ButtonProps = {
  label: string;
  onPress: () => void;
  size?: "md" | "lg";
  fullWidth?: boolean;
};

export function Button({ label, onPress, size = "md", fullWidth = false }: ButtonProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, styles[size], fullWidth && styles.fullWidth]}
    >
      <Text style={[styles.text, styles[`${size}Text`]]}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    button: {
      backgroundColor: colors.deep,
      alignItems: "center",
      justifyContent: "center",
    },
    md: { height: 44, paddingHorizontal: 20, borderRadius: 22 },
    lg: { height: 60, paddingHorizontal: 20, borderRadius: 30 },
    fullWidth: { alignSelf: "stretch" },
    text: { color: colors.lime, fontWeight: "600" },
    mdText: { fontSize: 14 },
    lgText: { fontSize: 17 },
  });
