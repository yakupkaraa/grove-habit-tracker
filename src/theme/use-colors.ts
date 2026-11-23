import { type Palette, palettes } from "./colors";
import { useResolvedScheme } from "./use-resolved-scheme";

export function useColors(): Palette {
  return palettes[useResolvedScheme()];
}
