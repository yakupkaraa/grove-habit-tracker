export type Palette = {
  bg: string;
  card: string;
  ink: string;
  muted: string;
  track: string;
  iconBg: string;
  ring: string;
  lime: string;
  onLime: string; // text and icons drawn on `lime` (stays dark in both themes)
  deep: string; // dark surface that carries lime text (tab bar, selected chip, button)
  deep2: string;
  deepMuted: string;
  fill: string; // progress ring and bar fill (a stroke, not a surface)
  treeA: string;
  treeB: string;
  danger: string; // error text only
};

export const lightColors: Palette = {
  bg: "#D9E8D9",
  card: "#F3F5EA",
  ink: "#123221",
  muted: "#3F5E4C",
  track: "#BCD8BF",
  iconBg: "#E4EFDF",
  ring: "#5E7F6B",
  lime: "#D4E94A",
  onLime: "#123221",
  deep: "#123221",
  deep2: "#1C4430",
  deepMuted: "#9DB8A3",
  fill: "#123221",
  treeA: "#2F6B45",
  treeB: "#1F5233",
  danger: "#9B3422",
};

// Same organic feel in the dark: deep green ground, dark cards, lime accent.
// Contrast ratios of the text pairs were calculated (WCAG 4.5:1), see the dark mode phase notes.
export const darkColors: Palette = {
  bg: "#09130D",
  card: "#14251A",
  ink: "#E8F0E5",
  muted: "#A6BCAB",
  track: "#223A2B",
  iconBg: "#20372A",
  ring: "#7FA68E",
  lime: "#D4E94A",
  onLime: "#123221",
  deep: "#2E6044",
  deep2: "#3A7050",
  deepMuted: "#C4D9C9",
  fill: "#D4E94A",
  treeA: "#47965F",
  treeB: "#5DB07C",
  danger: "#F2A08F",
};

export const palettes = { light: lightColors, dark: darkColors };

// Kept until every component reads the active palette (useColors); then it is deleted.
export const colors = lightColors;
