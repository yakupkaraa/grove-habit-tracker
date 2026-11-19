import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { RoundIconButton } from "@/components/ui/round-icon-button";
import { colors } from "@/theme/colors";

type TodayHeaderProps = {
  streak: number;
  onPressSettings: () => void;
};

export function TodayHeader({ streak, onPressSettings }: TodayHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>Günaydın</Text>
      <View style={styles.right}>
        <View style={styles.streakPill}>
          <Ionicons name="flame" size={18} color={colors.ink} />
          <Text style={styles.streakText}>{streak} gün</Text>
        </View>
        <RoundIconButton
          icon="settings-outline"
          accessibilityLabel="Ayarlar"
          onPress={onPressSettings}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: { fontSize: 17, fontWeight: "600", color: colors.ink },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.card,
  },
  streakText: { fontSize: 16, fontWeight: "700", color: colors.ink },
});
