import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import type { Palette } from "@/theme/colors";
import { useColors } from "@/theme/use-colors";
import { useThemedStyles } from "@/theme/use-themed-styles";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const DEFAULT_SIZE = 44;
const ICON_RATIO = 0.45;

type RoundIconButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress: () => void;
  size?: number;
  selected?: boolean; // leave undefined for a plain (non-toggle) button
};

export function RoundIconButton({
  icon,
  accessibilityLabel,
  onPress,
  size = DEFAULT_SIZE,
  selected,
}: RoundIconButtonProps) {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        selected && styles.buttonSelected,
      ]}
    >
      <Ionicons
        name={icon}
        size={Math.round(size * ICON_RATIO)}
        color={selected ? colors.lime : colors.ink}
      />
    </Pressable>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    button: {
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonSelected: { backgroundColor: colors.deep },
  });
