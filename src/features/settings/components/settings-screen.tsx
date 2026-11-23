import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FilterChip } from "@/components/ui/filter-chip";
import { useHabitStore } from "@/features/habits";
import { RoundIconButton } from "@/components/ui/round-icon-button";
import type { Palette } from "@/theme/colors";
import type { ThemePreference } from "@/theme/resolve-scheme";
import { useThemeStore } from "@/theme/theme-store";
import { useColors } from "@/theme/use-colors";
import { useThemedStyles } from "@/theme/use-themed-styles";
import { SettingsRow } from "./settings-row";

const REPOSITORY_URL = "https://github.com/yakupkaraa/grove-habit-tracker";
const SCREEN_PADDING = 20;
const TOP_GAP = 8;
const SECTION_GAP = 14;

const THEME_CHOICES: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Açık" },
  { value: "dark", label: "Koyu" },
  { value: "system", label: "Sistem" },
];

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const colors = useColors();
  const clearAllData = useHabitStore((state) => state.clearAllData);

  const confirmClearData = () =>
    Alert.alert("Tüm veriler silinsin mi?", "Tüm alışkanlıklar ve kayıtlar silinecek. Bu geri alınamaz.", [
      { text: "Vazgeç", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: clearAllData },
    ]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + TOP_GAP,
          paddingBottom: insets.bottom + SECTION_GAP,
          paddingHorizontal: SCREEN_PADDING,
          gap: SECTION_GAP,
        }}
      >
        <View style={styles.header}>
          <RoundIconButton icon="chevron-back" accessibilityLabel="Geri" onPress={() => router.back()} />
        </View>
        <Text accessibilityRole="header" style={styles.title}>
          Ayarlar
        </Text>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tema</Text>
          <View style={styles.chips}>
            {THEME_CHOICES.map(({ value, label }) => (
              <FilterChip
                key={value}
                label={label}
                selected={preference === value}
                onPress={() => setPreference(value)}
              />
            ))}
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Veriler</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tüm verileri sil"
            onPress={confirmClearData}
            style={styles.dangerRow}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <Text style={styles.dangerText}>Tüm verileri sil</Text>
          </Pressable>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Hakkında</Text>
          <SettingsRow label="Uygulama" value="Grove" />
          <SettingsRow label="Sürüm" value={Constants.expoConfig?.version ?? "—"} />
          <SettingsRow label="Lisans" value="MIT" />
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="GitHub deposu"
            onPress={() => Linking.openURL(REPOSITORY_URL)}
            style={styles.linkRow}
          >
            <Ionicons name="logo-github" size={20} color={colors.ink} />
            <Text style={styles.linkText}>GitHub deposu</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    header: { flexDirection: "row" },
    title: {
      fontSize: 42,
      lineHeight: 46,
      fontWeight: "500",
      letterSpacing: -0.8,
      color: colors.ink,
    },
    card: { gap: 12, padding: 20, borderRadius: 28, backgroundColor: colors.card },
    sectionTitle: { fontSize: 14, fontWeight: "600", color: colors.muted },
    chips: { flexDirection: "row", gap: 8 },
    linkRow: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 44 },
    linkText: { fontSize: 16, fontWeight: "600", color: colors.ink },
    dangerRow: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 44 },
    dangerText: { fontSize: 16, fontWeight: "600", color: colors.danger },
  });
