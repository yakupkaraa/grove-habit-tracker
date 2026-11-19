import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import { colors } from "@/theme/colors";

type TodayEmptyStateProps = {
  onAddHabit: () => void;
};

export function TodayEmptyState({ onAddHabit }: TodayEmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Henüz alışkanlık yok</Text>
      <Button label="İlk alışkanlığını ekle" onPress={onAddHabit} />
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
});
