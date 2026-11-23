import { router } from "expo-router";
import { useRef } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { RoundIconButton } from "@/components/ui/round-icon-button";
import type { Palette } from "@/theme/colors";
import { useColors } from "@/theme/use-colors";
import { useThemedStyles } from "@/theme/use-themed-styles";
import { HABIT_NAME_MAX_LENGTH } from "../constants";
import type { Habit } from "../types";
import { useHabitForm } from "../hooks/use-habit-form";
import { useTimePicker } from "../hooks/use-time-picker";
import { FieldLabel } from "./field-label";
import { IconPicker } from "./icon-picker";
import { ReminderRow } from "./reminder-row";
import { WeekdayPicker } from "./weekday-picker";

const SCREEN_PADDING = 20;
const TOP_GAP = 8;
const FIELD_GAP = 14;
const FOOTER_GAP = 12;
const LABEL_GAP = 8;
const SCROLL_BOTTOM_GAP = 24;

// Opened by a deep link there is no stack to pop, so fall back to the Today screen.
function leaveScreen() {
  if (router.canGoBack()) router.back();
  else router.replace("/");
}

type HabitFormScreenProps = {
  habit?: Habit; // edit mode when given, "new habit" otherwise
};

export function HabitFormScreen({ habit }: HabitFormScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const form = useHabitForm({ onSaved: leaveScreen, habit });
  const { openPicker, iosPicker } = useTimePicker({
    time: form.reminderTime,
    onChange: form.setReminderTime,
  });

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        // When the iOS spinner opens the content grows below the fold: bring it into view.
        onContentSizeChange={() => {
          if (iosPicker) scrollRef.current?.scrollToEnd({ animated: true });
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + TOP_GAP,
          paddingBottom: SCROLL_BOTTOM_GAP,
          paddingHorizontal: SCREEN_PADDING,
          gap: FIELD_GAP,
        }}
      >
        <View style={styles.header}>
          <RoundIconButton icon="chevron-back" accessibilityLabel="Geri" onPress={leaveScreen} />
          <RoundIconButton icon="close" accessibilityLabel="Kapat" onPress={leaveScreen} />
        </View>
        <Text style={styles.title}>{habit ? "Alışkanlığı düzenle" : "Yeni alışkanlık"}</Text>
        <View style={styles.field}>
          <FieldLabel error={form.errors.name}>Ad</FieldLabel>
          <TextInput
            accessibilityLabel="Ad"
            value={form.name}
            onChangeText={form.setName}
            placeholder="Sabah yürüyüşü"
            placeholderTextColor={colors.muted}
            maxLength={HABIT_NAME_MAX_LENGTH}
            returnKeyType="done"
            style={styles.input}
          />
        </View>
        <View style={styles.field}>
          <FieldLabel>İkon</FieldLabel>
          <IconPicker selected={form.icon} onSelect={form.setIcon} />
        </View>
        <View style={styles.field}>
          <FieldLabel error={form.errors.days}>Tekrar</FieldLabel>
          <WeekdayPicker selectedDays={form.repeatDays} onToggle={form.toggleDay} />
        </View>
        <ReminderRow
          enabled={form.reminderEnabled}
          time={form.reminderTime}
          repeatDays={form.repeatDays}
          onToggle={form.setReminderEnabled}
          onPressTime={openPicker}
        />
        {iosPicker}
      </ScrollView>
      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + FOOTER_GAP },
        ]}
      >
        <Button label="Kaydet" size="lg" fullWidth onPress={form.submit} />
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    footer: { paddingHorizontal: SCREEN_PADDING, paddingTop: FOOTER_GAP },
    header: { flexDirection: "row", justifyContent: "space-between" },
    title: {
      fontSize: 42,
      lineHeight: 46,
      fontWeight: "500",
      letterSpacing: -0.8,
      color: colors.ink,
    },
    field: { gap: LABEL_GAP },
    input: {
      height: 60,
      borderRadius: 30,
      paddingHorizontal: 24,
      backgroundColor: colors.card,
      fontSize: 20,
      fontWeight: "600",
      color: colors.ink,
    },
  });
