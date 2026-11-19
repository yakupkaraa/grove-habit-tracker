import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { colors } from "@/theme/colors";
import { formatTime, parseTime } from "../utils/time";

type UseTimePickerOptions = {
  time: string; // "HH:mm"
  onChange: (time: string) => void;
};

// Only the picker boundary deals with Date objects; everything else keeps "HH:mm".
// Android: system dialog (imperative). iOS: an inline spinner rendered by the caller.
export function useTimePicker({ time, onChange }: UseTimePickerOptions) {
  const [iosOpen, setIosOpen] = useState(false);

  const openPicker = () => {
    if (Platform.OS !== "android") {
      setIosOpen(true);
      return;
    }

    DateTimePickerAndroid.open({
      value: parseTime(time, new Date()),
      mode: "time",
      is24Hour: true,
      onChange: (event, date) => {
        if (event.type === "set" && date) onChange(formatTime(date));
      },
    });
  };

  const iosPicker = iosOpen ? (
    <View style={styles.spinner}>
      <DateTimePicker
        value={parseTime(time, new Date())}
        mode="time"
        display="spinner"
        // The app only has a light palette, but the native picker follows the device
        // theme and would draw light text on our light card in dark mode (iOS only).
        themeVariant="light"
        textColor={colors.ink}
        onChange={(_event, date) => {
          if (date) onChange(formatTime(date));
        }}
      />
      <Button label="Tamam" onPress={() => setIosOpen(false)} />
    </View>
  ) : null;

  return { openPicker, iosPicker };
}

const styles = StyleSheet.create({
  spinner: {
    gap: 8,
    padding: 12,
    alignItems: "center",
    borderRadius: 28,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
});
