import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import type { Palette } from "@/theme/colors";
import { useThemedStyles } from "@/theme/use-themed-styles";

type TodayEmptyStateProps = {
  onAddHabit: () => void;
};

export function TodayEmptyState({ onAddHabit }: TodayEmptyStateProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Henüz alışkanlık yok</Text>
      <Button label="İlk alışkanlığını ekle" onPress={onAddHabit} />
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
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
