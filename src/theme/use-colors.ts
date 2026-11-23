import { useColorScheme } from "react-native";
import { type Palette, palettes } from "./colors";
import { resolveScheme } from "./resolve-scheme";
import { useThemeStore } from "./theme-store";

export function useColors(): Palette {
  const preference = useThemeStore((state) => state.preference);
  const systemScheme = useColorScheme();

  return palettes[resolveScheme(preference, systemScheme)];
}
