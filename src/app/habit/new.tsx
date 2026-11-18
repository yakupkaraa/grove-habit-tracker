import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

export default function NewHabit() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Yeni alışkanlık</Text>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Kapat</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: colors.bg,
  },
  text: { fontSize: 24, fontWeight: "600", color: colors.ink },
  button: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 22,
    backgroundColor: colors.deep,
    justifyContent: "center",
  },
  buttonText: { fontSize: 15, fontWeight: "600", color: colors.lime },
});
