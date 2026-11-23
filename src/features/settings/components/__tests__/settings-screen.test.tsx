import { act, render, screen, userEvent } from "@testing-library/react-native";
import { Alert, Linking } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useHabitStore } from "@/features/habits";
import { useThemeStore } from "@/theme/theme-store";
import { SettingsScreen } from "../settings-screen";

// Navigation is a boundary; we only need the screen to render.
jest.mock("expo-router", () => ({ router: { back: jest.fn(), push: jest.fn() } }));

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const HABIT = {
  id: "h1",
  name: "Su iç",
  icon: "water" as const,
  repeatDays: [1, 2, 3] as (0 | 1 | 2 | 3 | 4 | 5 | 6)[],
  createdAt: "2026-11-01",
};

async function renderScreen() {
  return render(
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <SettingsScreen />
    </SafeAreaProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  useThemeStore.setState({ preference: "system" });
  useHabitStore.setState({ habits: [], completions: [], hydrated: true });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("SettingsScreen", () => {
  it("shows the saved theme preference as selected", async () => {
    useThemeStore.setState({ preference: "dark" });

    await renderScreen();

    expect(screen.getByRole("button", { name: "Koyu", selected: true })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Açık", selected: false })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sistem", selected: false })).toBeTruthy();
  });

  it("changes the theme preference when a choice is pressed", async () => {
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Koyu" }));

    expect(useThemeStore.getState().preference).toBe("dark");
    expect(screen.getByRole("button", { name: "Koyu", selected: true })).toBeTruthy();
  });

  it("asks for confirmation before deleting and keeps the data until confirmed", async () => {
    const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    useHabitStore.setState({
      habits: [{ ...HABIT }],
      completions: [{ habitId: "h1", date: "2026-11-18" }],
    });
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Tüm verileri sil" }));

    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert.mock.calls[0][2]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: "Vazgeç", style: "cancel" }),
        expect.objectContaining({ text: "Sil", style: "destructive" }),
      ]),
    );
    expect(useHabitStore.getState().habits).toHaveLength(1);
    expect(useHabitStore.getState().completions).toHaveLength(1);
  });

  it("deletes every habit and completion when the destructive button is confirmed", async () => {
    const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    useHabitStore.setState({
      habits: [HABIT, { ...HABIT, id: "h2" }],
      completions: [
        { habitId: "h1", date: "2026-11-18" },
        { habitId: "h2", date: "2026-11-17" },
      ],
    });
    await renderScreen();
    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Tüm verileri sil" }));
    const confirm = alert.mock.calls[0][2]?.find((button) => button.text === "Sil");

    await act(async () => confirm?.onPress?.());

    expect(useHabitStore.getState().habits).toEqual([]);
    expect(useHabitStore.getState().completions).toEqual([]);
    expect(useHabitStore.getState().hydrated).toBe(true);
  });

  it("keeps the data when the confirmation is cancelled", async () => {
    const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    useHabitStore.setState({
      habits: [HABIT],
      completions: [{ habitId: "h1", date: "2026-11-18" }],
    });
    await renderScreen();
    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Tüm verileri sil" }));
    const cancel = alert.mock.calls[0][2]?.find((button) => button.text === "Vazgeç");

    await act(async () => cancel?.onPress?.());

    expect(useHabitStore.getState().habits).toHaveLength(1);
    expect(useHabitStore.getState().completions).toHaveLength(1);
  });

  it("opens the GitHub repository from its link", async () => {
    const openURL = jest.spyOn(Linking, "openURL").mockResolvedValue();
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("link", { name: "GitHub deposu" }));

    expect(openURL).toHaveBeenCalledWith("https://github.com/yakupkaraa/grove-habit-tracker");
  });
});
