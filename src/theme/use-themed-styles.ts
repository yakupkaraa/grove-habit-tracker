import { useMemo } from "react";
import type { Palette } from "./colors";
import { useColors } from "./use-colors";

// `createStyles` must be a module-level function: a stable identity keeps the memo effective.
export function useThemedStyles<T extends object>(createStyles: (colors: Palette) => T): T {
  const colors = useColors();

  return useMemo(() => createStyles(colors), [createStyles, colors]);
}
