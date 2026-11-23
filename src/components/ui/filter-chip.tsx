import { Pressable, StyleSheet, Text } from "react-native";
import type { Palette } from "@/theme/colors";
import { useThemedStyles } from "@/theme/use-themed-styles";

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    chip: {
      height: 40,
      paddingHorizontal: 18,
      borderRadius: 20,
      backgroundColor: colors.card,
      justifyContent: "center",
    },
    chipSelected: { backgroundColor: colors.deep },
    text: { fontSize: 14, fontWeight: "600", color: colors.ink },
    textSelected: { color: colors.lime },
  });
