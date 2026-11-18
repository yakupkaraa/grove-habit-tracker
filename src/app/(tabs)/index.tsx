import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

export default function Today() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Bugün</Text>
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
