import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { act, render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useHabitStore } from "../../store/habit-store";
import { makeHabit } from "../../test-utils";
import type { Habit } from "../../types";
import { formatTime } from "../../utils/time";
import { HabitFormScreen } from "../habit-form-screen";

// expo-router is a navigation boundary; we only check where we navigate.
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), canGoBack: jest.fn(), replace: jest.fn() },
}));

// The native time picker is a boundary too: Android opens an imperative dialog,
// iOS renders a component whose props the tests read back.
jest.mock("@react-native-community/datetimepicker", () => {
  const { createElement } = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: jest.fn(() => createElement(View, { accessibilityLabel: "Saat seçici" })),
    DateTimePickerAndroid: { open: jest.fn() },
  };
});

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

async function renderScreen(habit?: Habit) {
  return render(
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <HabitFormScreen habit={habit} />
    </SafeAreaProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  (router.canGoBack as jest.Mock).mockReturnValue(true);
  useHabitStore.setState({ habits: [], completions: [], hydrated: true });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("HabitFormScreen", () => {
  it("starts with the defaults (Mon-Fri selected, reminder on at 07:30)", async () => {
    await renderScreen();

    for (const day of ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"]) {
      expect(screen.getByRole("button", { name: day, selected: true })).toBeTruthy();
    }
    expect(screen.getByRole("button", { name: "Cumartesi", selected: false })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Pazar", selected: false })).toBeTruthy();
    expect(screen.getByText("Hafta içi")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Hatırlatma saati 07:30" })).toBeTruthy();
  });

  it("toggles a day and updates the reminder label", async () => {
    await renderScreen();
    const user = userEvent.setup();

    await user.press(screen.getByRole("button", { name: "Cumartesi" }));
    await user.press(screen.getByRole("button", { name: "Pazar" }));

    expect(screen.getByRole("button", { name: "Pazar", selected: true })).toBeTruthy();
    expect(screen.getByText("Her gün")).toBeTruthy();
  });

  it("shows the name error, does not save and does not navigate when the name is empty", async () => {
    await renderScreen();
    const user = userEvent.setup();

    await user.press(screen.getByRole("button", { name: "Kaydet" }));

    expect(screen.getByText("Bir ad girin")).toBeTruthy();
    expect(useHabitStore.getState().habits).toEqual([]);
    expect(router.back).not.toHaveBeenCalled();
  });

  it("shows the days error and does not save when no day is selected", async () => {
    await renderScreen();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Sabah yürüyüşü"), "Su iç");
    for (const day of ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"]) {
      await user.press(screen.getByRole("button", { name: day }));
    }

    await user.press(screen.getByRole("button", { name: "Kaydet" }));

    expect(screen.getByText("En az bir gün seçin")).toBeTruthy();
    expect(useHabitStore.getState().habits).toEqual([]);
  });

  it("clears the errors as the fields are fixed", async () => {
    await renderScreen();
    const user = userEvent.setup();
    for (const day of ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"]) {
      await user.press(screen.getByRole("button", { name: day }));
    }
    await user.press(screen.getByRole("button", { name: "Kaydet" }));
    expect(screen.getByText("Bir ad girin")).toBeTruthy();
    expect(screen.getByText("En az bir gün seçin")).toBeTruthy();

    await user.type(screen.getByPlaceholderText("Sabah yürüyüşü"), "Su iç");
    await user.press(screen.getByRole("button", { name: "Pazartesi" }));

    expect(screen.queryByText("Bir ad girin")).toBeNull();
    expect(screen.queryByText("En az bir gün seçin")).toBeNull();
  });

  it("saves the habit with the typed name, chosen icon, days and the default reminder time", async () => {
    await renderScreen();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Sabah yürüyüşü"), "Su iç");
    await user.press(screen.getByRole("button", { name: "Su" }));

    await user.press(screen.getByRole("button", { name: "Kaydet" }));

    expect(useHabitStore.getState().habits).toHaveLength(1);
    expect(useHabitStore.getState().habits[0]).toMatchObject({
      name: "Su iç",
      icon: "water-outline",
      repeatDays: [1, 2, 3, 4, 5],
      reminderTime: "07:30",
    });
  });

  it("leaves out reminderTime when the reminder is off", async () => {
    await renderScreen();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Sabah yürüyüşü"), "Su iç");
    await user.press(screen.getByRole("switch", { name: "Hatırlatma" }));

    await user.press(screen.getByRole("button", { name: "Kaydet" }));

    expect(useHabitStore.getState().habits[0]).not.toHaveProperty("reminderTime");
  });

  it("goes back after saving", async () => {
    await renderScreen();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Sabah yürüyüşü"), "Su iç");

    await user.press(screen.getByRole("button", { name: "Kaydet" }));

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("replaces the route with the Today screen when there is nothing to go back to", async () => {
    (router.canGoBack as jest.Mock).mockReturnValue(false);
    await renderScreen();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Sabah yürüyüşü"), "Su iç");

    await user.press(screen.getByRole("button", { name: "Kaydet" }));

    expect(router.replace).toHaveBeenCalledWith("/");
    expect(router.back).not.toHaveBeenCalled();
  });

  it("goes back from both the back and close buttons", async () => {
    await renderScreen();
    const user = userEvent.setup();

    await user.press(screen.getByRole("button", { name: "Geri" }));
    expect(router.back).toHaveBeenCalledTimes(1);

    await user.press(screen.getByRole("button", { name: "Kapat" }));
    expect(router.back).toHaveBeenCalledTimes(2);
  });

  it("Android: opens the native dialog with the current time in 24-hour mode and saves the chosen time", async () => {
    jest.replaceProperty(Platform, "OS", "android");
    await renderScreen();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Sabah yürüyüşü"), "Su iç");

    await user.press(screen.getByRole("button", { name: "Hatırlatma saati 07:30" }));

    const options = (DateTimePickerAndroid.open as jest.Mock).mock.calls[0][0];
    expect(options).toMatchObject({ mode: "time", is24Hour: true });
    expect(formatTime(options.value)).toBe("07:30");

    await act(async () => options.onChange({ type: "set" }, new Date(2026, 10, 18, 21, 15)));
    await user.press(screen.getByRole("button", { name: "Kaydet" }));

    expect(useHabitStore.getState().habits[0].reminderTime).toBe("21:15");
  });

  it("Android: keeps the current time when the dialog is dismissed", async () => {
    jest.replaceProperty(Platform, "OS", "android");
    await renderScreen();
    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Hatırlatma saati 07:30" }));
    const options = (DateTimePickerAndroid.open as jest.Mock).mock.calls[0][0];

    await act(async () => options.onChange({ type: "dismissed" }, undefined));

    expect(screen.getByRole("button", { name: "Hatırlatma saati 07:30" })).toBeTruthy();
  });

  it("iOS: shows the spinner when the time is pressed", async () => {
    jest.replaceProperty(Platform, "OS", "ios");
    await renderScreen();
    expect(screen.queryByLabelText("Saat seçici")).toBeNull();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Hatırlatma saati 07:30" }));

    expect(screen.getByLabelText("Saat seçici")).toBeTruthy();
    expect(DateTimePickerAndroid.open).not.toHaveBeenCalled();
  });

  it('iOS: updates the reminder time live and hides the spinner on "Tamam"', async () => {
    jest.replaceProperty(Platform, "OS", "ios");
    await renderScreen();
    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Hatırlatma saati 07:30" }));
    const { onChange } = (DateTimePicker as unknown as jest.Mock).mock.lastCall[0];

    await act(async () => onChange({ type: "set" }, new Date(2026, 10, 18, 21, 15)));
    expect(screen.getByRole("button", { name: "Hatırlatma saati 21:15" })).toBeTruthy();
    expect(screen.getByLabelText("Saat seçici")).toBeTruthy();

    await user.press(screen.getByRole("button", { name: "Tamam" }));

    expect(screen.queryByLabelText("Saat seçici")).toBeNull();
    expect(screen.getByRole("button", { name: "Hatırlatma saati 21:15" })).toBeTruthy();
  });
});

describe("HabitFormScreen in edit mode", () => {
  const habit = makeHabit("h1", {
    name: "Su iç",
    icon: "water-outline",
    repeatDays: [1, 3],
    reminderTime: "21:15",
  });

  beforeEach(() => {
    useHabitStore.setState({ habits: [habit], completions: [] });
  });

  it("shows the edit title and prefills the form from the habit", async () => {
    await renderScreen(habit);

    expect(screen.getByText("Alışkanlığı düzenle")).toBeTruthy();
    expect(screen.getByPlaceholderText("Sabah yürüyüşü")).toHaveDisplayValue("Su iç");
    expect(screen.getByRole("button", { name: "Su", selected: true })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Pazartesi", selected: true })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Salı", selected: false })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Hatırlatma saati 21:15" })).toBeTruthy();
  });

  it("saves the edited habit and goes back", async () => {
    await renderScreen(habit);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("Sabah yürüyüşü");
    await user.clear(input);
    await user.type(input, "Çay iç");

    await user.press(screen.getByRole("button", { name: "Kaydet" }));

    expect(useHabitStore.getState().habits).toHaveLength(1);
    expect(useHabitStore.getState().habits[0]).toMatchObject({ id: "h1", name: "Çay iç" });
    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
