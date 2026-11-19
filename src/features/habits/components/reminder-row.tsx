import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import type { Weekday } from "../types";
import { formatRepeatDays } from "../utils/repeat-label";

type ReminderRowProps = {
  enabled: boolean;
  time: string; // "HH:mm"
  repeatDays: readonly Weekday[];
  onToggle: (enabled: boolean) => void;
  onPressTime: () => void;
};

export function ReminderRow({
  enabled,
  time,
  repeatDays,
  onToggle,
  onPressTime,
}: ReminderRowProps) {
  const repeatLabel = formatRepeatDays(repeatDays);

  return (
    <View style={styles.card}>
      <View style={styles.bell}>
        <Ionicons name="notifications-outline" size={20} color={colors.lime} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>Hatırlatma</Text>
        {enabled ? (
          <View style={styles.subtitleRow}>
            {repeatLabel !== "" && <Text style={styles.subtitle}>{repeatLabel}</Text>}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Hatırlatma saati ${time}`}
              onPress={onPressTime}
            >
              <Text style={styles.time}>{time}</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={styles.subtitle}>Kapalı</Text>
        )}
      </View>
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel="Hatırlatma"
        accessibilityState={{ checked: enabled }}
        onPress={() => onToggle(!enabled)}
        style={[styles.track, enabled && styles.trackOn]}
      >
        <View style={[styles.knob, enabled && styles.knobOn]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 22,
    borderRadius: 36,
    backgroundColor: colors.deep,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.deep2,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", color: colors.card },
  subtitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  subtitle: { fontSize: 13, color: colors.deepMuted },
  time: { fontSize: 13, fontWeight: "700", color: colors.lime },
  track: {
    width: 54,
    height: 32,
    borderRadius: 16,
    padding: 4,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.track,
  },
  trackOn: { alignItems: "flex-end", backgroundColor: colors.lime },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.ring },
  knobOn: { backgroundColor: colors.deep },
});
