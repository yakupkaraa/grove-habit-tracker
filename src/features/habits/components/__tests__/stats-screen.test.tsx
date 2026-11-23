import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useHabitStore } from "../../store/habit-store";
import { makeHabit } from "../../test-utils";
import type { Completion, Habit } from "../../types";
import { addDays } from "../../utils/dates";
import { StatsScreen } from "../stats-screen";

// expo-router is a navigation boundary; we only check where we navigate.
jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

const TODAY = "2026-11-18"; // Wednesday
const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function seedStore(habits: Habit[], completions: Completion[] = []) {
  useHabitStore.setState({ habits, completions, hydrated: true });
}

// Completions for every day from `from` to `to` (inclusive).
function doneEveryDay(habitId: string, from: string, to: string = TODAY): Completion[] {
  const completions: Completion[] = [];
  for (let date = from; date <= to; date = addDays(date, 1)) {
    completions.push({ habitId, date });
  }
  return completions;
}

async function renderScreen(today = TODAY) {
  return render(
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <StatsScreen today={today} />
    </SafeAreaProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  useHabitStore.setState({ habits: [], completions: [], hydrated: true });
});

describe("StatsScreen", () => {
  it("shows the overall rate and the done and planned counts for the selected range", async () => {
    seedStore(
      [makeHabit("a"), makeHabit("b")],
      [...doneEveryDay("a", "2026-11-12"), ...doneEveryDay("b", "2026-11-16")],
    );

    await renderScreen();

    expect(screen.getByRole("progressbar", { name: "Başarı oranı", value: { now: 71 } })).toBeTruthy();
    expect(screen.getByText("10/14 tamamlandı")).toBeTruthy();
  });

  it("switches the range with the chips", async () => {
    seedStore([makeHabit("a")], doneEveryDay("a", "2026-11-12"));
    await renderScreen();
    expect(screen.getByRole("button", { name: "7 gün", selected: true })).toBeTruthy();
    expect(screen.getByText("7/7 tamamlandı")).toBeTruthy();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "30 gün" }));

    expect(screen.getByRole("button", { name: "30 gün", selected: true })).toBeTruthy();
    expect(screen.getByText("7/30 tamamlandı")).toBeTruthy();
  });

  it("shows each habit's rate and no rate for one without planned days", async () => {
    seedStore(
      [makeHabit("Su iç"), makeHabit("Yeni", { createdAt: TODAY })],
      doneEveryDay("Su iç", "2026-11-14"),
    );

    await renderScreen();

    expect(screen.getByRole("button", { name: "Su iç: %71, ayrıntıları aç" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Yeni: oran yok, ayrıntıları aç" })).toBeTruthy();
  });

  it("opens a habit's detail from its row", async () => {
    seedStore([makeHabit("a")], doneEveryDay("a", "2026-11-14"));
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "a: %71, ayrıntıları aç" }));

    expect(router.push).toHaveBeenCalledWith({ pathname: "/habit/[id]", params: { id: "a" } });
  });

  it("shows the empty state instead of the stats when there are no habits, and its button opens the new habit screen", async () => {
    await renderScreen();

    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByRole("button", { name: "7 gün" })).toBeNull();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "İlk alışkanlığını ekle" }));

    expect(router.push).toHaveBeenCalledWith("/habit/new");
  });

  it("describes the daily chart with its data as one element for the selected range", async () => {
    seedStore([makeHabit("a")], doneEveryDay("a", "2026-11-14"));
    await renderScreen();
    expect(
      screen.getByRole("image", {
        name: "Perşembe 0/1, Cuma 0/1, Cumartesi 1/1, Pazar 1/1, Pazartesi 1/1, Salı 1/1, Çarşamba 1/1",
      }),
    ).toBeTruthy();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "30 gün" }));

    expect(
      screen.getByRole("image", { name: "Son 30 gün: 30 planlı gün, 5 tamamlandı." }),
    ).toBeTruthy();
  });

  it("shows a message instead of the chart when no day has been planned in the range", async () => {
    seedStore([makeHabit("Yeni", { createdAt: TODAY })]);

    await renderScreen();

    expect(screen.getByText("Bu aralıkta henüz planlı gün yok")).toBeTruthy();
    expect(screen.queryByRole("image")).toBeNull();
    expect(screen.getByRole("progressbar", { name: "Başarı oranı", value: { now: 0 } })).toBeTruthy();
  });

  it("shows the all-time longest streak with its habit, even when it is outside the range", async () => {
    seedStore([makeHabit("Yürüyüş")], doneEveryDay("Yürüyüş", "2026-10-01", "2026-10-04"));

    await renderScreen();

    expect(screen.getByText("Tüm zamanların en uzun serisi")).toBeTruthy();
    expect(screen.getByText("4 gün · Yürüyüş")).toBeTruthy();
  });

  it("hides the longest streak until a habit has a streak", async () => {
    seedStore([makeHabit("Yürüyüş")]);

    await renderScreen();

    expect(screen.queryByText("Tüm zamanların en uzun serisi")).toBeNull();
  });

  it("shows only a blank before hydration finishes, not the empty state", async () => {
    useHabitStore.setState({ habits: [], completions: [], hydrated: false });

    await renderScreen();

    expect(screen.queryByText("Henüz alışkanlık yok")).toBeNull();
    expect(screen.queryByRole("header")).toBeNull();
  });
});
