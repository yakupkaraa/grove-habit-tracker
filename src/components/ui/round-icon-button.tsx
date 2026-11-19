import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

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

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSelected: { backgroundColor: colors.deep },
});
