import { useColorScheme } from "react-native";
import { type ColorScheme, resolveScheme } from "./resolve-scheme";
import { useThemeStore } from "./theme-store";

export function useResolvedScheme(): ColorScheme {
  const preference = useThemeStore((state) => state.preference);
  const systemScheme = useColorScheme();

  return resolveScheme(preference, systemScheme);
}
