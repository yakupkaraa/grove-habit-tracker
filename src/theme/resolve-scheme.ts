export type ThemePreference = "light" | "dark" | "system";
export type ColorScheme = "light" | "dark";

export function resolveScheme(
  preference: ThemePreference,
  systemScheme: string | null | undefined,
): ColorScheme {
  if (preference === "system") return systemScheme === "dark" ? "dark" : "light";
  return preference;
}
