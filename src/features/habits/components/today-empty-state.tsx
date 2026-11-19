import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type TodayEmptyStateProps = {
  onAddHabit: () => void;
};

export function TodayEmptyState({ onAddHabit }: TodayEmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Henüz alışkanlık yok</Text>
      <Pressable accessibilityRole="button" onPress={onAddHabit} style={styles.button}>
        <Text style={styles.buttonText}>İlk alışkanlığını ekle</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 32,
    backgroundColor: colors.card,
  },
  title: { fontSize: 18, fontWeight: "600", color: colors.ink },
  button: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: colors.deep,
    justifyContent: "center",
  },
  buttonText: { fontSize: 14, fontWeight: "600", color: colors.lime },
});
