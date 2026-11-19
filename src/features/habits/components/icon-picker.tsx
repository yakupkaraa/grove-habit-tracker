import { StyleSheet, View } from "react-native";
import { RoundIconButton } from "@/components/ui/round-icon-button";
import { HABIT_ICONS } from "../constants";
import type { HabitIcon } from "../types";

const ICON_BUTTON_SIZE = 52;

type IconPickerProps = {
  selected: HabitIcon;
  onSelect: (icon: HabitIcon) => void;
};

export function IconPicker({ selected, onSelect }: IconPickerProps) {
  return (
    <View style={styles.row}>
      {HABIT_ICONS.map(({ name, label }) => (
        <RoundIconButton
          key={name}
          icon={name}
          accessibilityLabel={label}
          size={ICON_BUTTON_SIZE}
          selected={name === selected}
          onPress={() => onSelect(name)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between" },
});
