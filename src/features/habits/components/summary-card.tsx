import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { ProgressRingScene } from "./progress-ring-scene";

const RING_SIZE = 140;

type SummaryCardProps = {
  done: number;
  total: number;
  streak: number;
};

export function SummaryCard({ done, total, streak }: SummaryCardProps) {
  const allDone = total > 0 && done === total;

  return (
    <View style={styles.card}>
      <ProgressRingScene progress={total > 0 ? done / total : 0} size={RING_SIZE} />
      <View style={styles.texts}>
        <Text style={styles.count}>{`${done}/${total}`}</Text>
        <Text style={styles.label}>{allDone ? "Hepsi tamamlandı" : "tamamlandı"}</Text>
        {allDone ? (
          <View style={[styles.pill, styles.pillDone]}>
            <Ionicons name="flame" size={14} color={colors.ink} />
            <Text style={[styles.pillText, styles.pillTextDone]}>
              {`${streak} günlük seri`}
            </Text>
          </View>
        ) : (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{`${total - done} alışkanlık kaldı`}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 160,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    padding: 10,
    paddingRight: 24,
    borderRadius: 40,
    backgroundColor: colors.card,
  },
  texts: { flex: 1 },
  count: { fontSize: 44, lineHeight: 46, fontWeight: "600", color: colors.ink },
  label: { fontSize: 15, color: colors.muted, marginTop: 2 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.deep,
  },
  pillDone: { backgroundColor: colors.lime },
  pillText: { fontSize: 13, fontWeight: "600", color: colors.lime },
  pillTextDone: { color: colors.ink },
});
