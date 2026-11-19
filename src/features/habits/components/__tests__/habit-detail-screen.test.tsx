import { act, render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useHabitStore } from "../../store/habit-store";
import { makeHabit } from "../../test-utils";
import type { Completion } from "../../types";
import { addDays } from "../../utils/dates";
import { HabitDetailScreen } from "../habit-detail-screen";

// Navigation is a boundary; we only check where we navigate.
jest.mock("expo-router", () => ({ router: { back: jest.fn(), push: jest.fn() } }));

const TODAY = "2026-11-18";
const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function doneEveryDay(habitId: string, from: string, to: string): Completion[] {
  const completions: Completion[] = [];
  for (let date = from; date <= to; date = addDays(date, 1)) {
    completions.push({ habitId, date });
  }
  return completions;
}

function seedStore(habits: ReturnType<typeof makeHabit>[], completions: Completion[] = []) {
  useHabitStore.setState({ habits, completions, hydrated: true });
}

function screenFor(id: string) {
  return (
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <HabitDetailScreen id={id} today={TODAY} />
    </SafeAreaProvider>
  );
}

async function renderScreen(id = "h1") {
  return render(screenFor(id));
}

beforeEach(() => {
  jest.clearAllMocks();
  useHabitStore.setState({ habits: [], completions: [], hydrated: true });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("HabitDetailScreen", () => {
  it("shows the current streak, the longest streak and the 30-day rate", async () => {
    seedStore(
      [makeHabit("h1", { createdAt: "2026-10-01" })],
      [
        ...doneEveryDay("h1", "2026-11-01", "2026-11-04"),
        ...doneEveryDay("h1", "2026-11-16", "2026-11-17"),
      ],
    );

    await renderScreen();

    expect(screen.getByLabelText("Mevcut seri: 2 gün")).toBeTruthy();
    expect(screen.getByLabelText("En uzun seri: 4 gün")).toBeTruthy();
    expect(screen.getByLabelText("Başarı (30 gün): %21")).toBeTruthy();
  });

  it("shows a dash instead of a rate for a brand-new habit", async () => {
    seedStore([makeHabit("h1", { createdAt: TODAY })]);

    await renderScreen();

    expect(screen.getByLabelText("Başarı (30 gün): —")).toBeTruthy();
  });

  it('shows the reminder time, or "Kapalı" when the reminder is off', async () => {
    seedStore([makeHabit("h1", { reminderTime: "21:15" }), makeHabit("h2")]);
    const { rerender } = await renderScreen("h1");
    expect(screen.getByLabelText("Hatırlatma: 21:15")).toBeTruthy();

    await rerender(screenFor("h2"));

    expect(screen.getByLabelText("Hatırlatma: Kapalı")).toBeTruthy();
  });

  it("renders nothing when the habit does not exist", async () => {
    seedStore([makeHabit("h1")]);

    await renderScreen("missing");

    expect(screen.queryByLabelText(/Mevcut seri/)).toBeNull();
    expect(screen.queryByRole("button", { name: "Geri" })).toBeNull();
  });

  it("goes back from the back button", async () => {
    seedStore([makeHabit("h1")]);
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Geri" }));

    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("opens the edit screen from the edit button", async () => {
    seedStore([makeHabit("h1")]);
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Düzenle" }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/habit/edit/[id]",
      params: { id: "h1" },
    });
  });

  it('asks for confirmation with a destructive "Sil" and a "Vazgeç" option', async () => {
    const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    seedStore([makeHabit("h1")]);
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Sil" }));

    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert.mock.calls[0][2]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: "Vazgeç", style: "cancel" }),
        expect.objectContaining({ text: "Sil", style: "destructive" }),
      ]),
    );
    expect(useHabitStore.getState().habits).toHaveLength(1);
  });

  it('deletes the habit and all its completions and goes back when "Sil" is confirmed', async () => {
    const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    seedStore(
      [makeHabit("h1"), makeHabit("h2")],
      [
        ...doneEveryDay("h1", "2026-11-10", "2026-11-12"),
        { habitId: "h2", date: "2026-11-12" },
      ],
    );
    await renderScreen("h1");
    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Sil" }));
    const confirm = alert.mock.calls[0][2]?.find((button) => button.text === "Sil");

    await act(async () => confirm?.onPress?.());

    expect(useHabitStore.getState().habits.map((h) => h.id)).toEqual(["h2"]);
    expect(useHabitStore.getState().completions).toEqual([
      { habitId: "h2", date: "2026-11-12" },
    ]);
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("keeps the habit when the confirmation is cancelled", async () => {
    const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    seedStore([makeHabit("h1")], doneEveryDay("h1", "2026-11-10", "2026-11-12"));
    await renderScreen();
    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Sil" }));
    const cancel = alert.mock.calls[0][2]?.find((button) => button.text === "Vazgeç");

    await act(async () => cancel?.onPress?.());

    expect(useHabitStore.getState().habits).toHaveLength(1);
    expect(useHabitStore.getState().completions).toHaveLength(3);
    expect(router.back).not.toHaveBeenCalled();
  });
});
