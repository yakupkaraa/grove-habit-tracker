import { StyleSheet, Text, View } from "react-native";
import type { Palette } from "@/theme/colors";
import { useThemedStyles } from "@/theme/use-themed-styles";
import { getWeekday } from "../utils/dates";
import { SHORT_WEEKDAY_NAMES } from "../utils/weekdays";

const CHART_HEIGHT = 110;
const WEEK_LENGTH = 7;
const MIN_FILL_HEIGHT = 4; // a done day with a tiny ratio stays visible
const WEEK_BAR_GAP = 8;
const MONTH_BAR_GAP = 3;

type Bar = { date: string; ratio: number };

type CompletionBarsProps = {
  days: readonly Bar[];
  label: string;
};

export function CompletionBars({ days, label }: CompletionBarsProps) {
  const styles = useThemedStyles(createStyles);
  // Thirty bars have no room for names: only a week gets weekday labels.
  const showWeekdays = days.length <= WEEK_LENGTH;
  const gap = showWeekdays ? WEEK_BAR_GAP : MONTH_BAR_GAP;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={[styles.row, { gap }]}
    >
      {days.map(({ date, ratio }) => (
        <View key={date} style={styles.column}>
          <View style={styles.track}>
            {ratio > 0 && (
              <View
                style={[styles.fill, { height: Math.max(MIN_FILL_HEIGHT, ratio * CHART_HEIGHT) }]}
              />
            )}
          </View>
          {showWeekdays && (
            <Text style={styles.weekday}>{SHORT_WEEKDAY_NAMES[getWeekday(date)]}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    row: { flexDirection: "row" },
    column: { flex: 1, alignItems: "center", gap: 6 },
    track: {
      width: "100%",
      height: CHART_HEIGHT,
      justifyContent: "flex-end",
      borderRadius: 8,
      backgroundColor: colors.track,
      overflow: "hidden",
    },
    fill: { width: "100%", backgroundColor: colors.fill },
    weekday: { fontSize: 11, fontWeight: "600", color: colors.muted },
  });
