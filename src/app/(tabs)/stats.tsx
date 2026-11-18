import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

export default function Stats() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>İlerleme</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  text: { fontSize: 24, fontWeight: "600", color: colors.ink },
});
