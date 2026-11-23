import { useEffect } from "react";
import { Appearance } from "react-native";
import { useThemeStore } from "./theme-store";

// Native UI we do not draw (keyboard, alerts, the time picker, the status bar) follows the
// system. Telling the OS the chosen scheme makes it follow the app's choice;
// "unspecified" hands control back to the device.
export function useApplyTheme() {
  const preference = useThemeStore((state) => state.preference);

  useEffect(() => {
    Appearance.setColorScheme(preference === "system" ? "unspecified" : preference);
  }, [preference]);
}
