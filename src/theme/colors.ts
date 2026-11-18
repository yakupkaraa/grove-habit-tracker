// Açık tema paleti. Dark mode eklenirken yanına `darkColors` konup
// aynı şekle (Palette) sahip olması yeterli olacak.
export const lightColors = {
  bg: "#D9E8D9",
  card: "#F3F5EA",
  ink: "#123221",
  muted: "#3F5E4C",
  track: "#BCD8BF",
  iconBg: "#E4EFDF",
  ring: "#5E7F6B",
  lime: "#D4E94A",
  deep: "#123221",
  deepMuted: "#9DB8A3",
  treeA: "#2F6B45",
  treeB: "#1F5233",
} as const;

export type Palette = { [K in keyof typeof lightColors]: string };

// Şimdilik tek palet var; dark mode gelince burası useColorScheme'e bağlanacak.
export const colors = lightColors;
