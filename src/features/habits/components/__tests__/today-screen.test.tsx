import { act, render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useHabitStore } from "../../store/habit-store";
import { makeHabit } from "../../test-utils";
import type { Completion, Habit } from "../../types";
import { TodayScreen } from "../today-screen";

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

async function renderScreen(today = TODAY) {
  return render(
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <TodayScreen today={today} />
    </SafeAreaProvider>,
  );
}

beforeEach(() => {
  useHabitStore.setState({ habits: [], completions: [], hydrated: true });
});

describe("TodayScreen", () => {
  it("shows only the habits planned today", async () => {
    seedStore([
      makeHabit("Su iç"),
      makeHabit("Perşembe işi", { repeatDays: [4] }),
      makeHabit("Gelecek işi", { createdAt: "2026-11-19" }),
    ]);

    await renderScreen();

    expect(screen.getByText("Su iç")).toBeTruthy();
    expect(screen.queryByText("Perşembe işi")).toBeNull();
    expect(screen.queryByText("Gelecek işi")).toBeNull();
  });

  it("shows the done and total counts in the summary card", async () => {
    seedStore(
      [makeHabit("a"), makeHabit("b"), makeHabit("c")],
      [{ habitId: "a", date: TODAY }],
    );

    await renderScreen();

    expect(screen.getByText("1/3")).toBeTruthy();
    expect(screen.getByText("2 alışkanlık kaldı")).toBeTruthy();
  });

  it("shows the repeat label, reminder and streak on each row", async () => {
    seedStore(
      [makeHabit("Su iç", { reminderTime: "08:00" })],
      [
        { habitId: "Su iç", date: "2026-11-17" },
        { habitId: "Su iç", date: "2026-11-16" },
      ],
    );

    await renderScreen();

    expect(screen.getByText("Her gün · 08:00 · 2 gün")).toBeTruthy();
  });

  it("updates the summary from 0/2 to 1/2 when a check is pressed", async () => {
    seedStore([makeHabit("Su iç"), makeHabit("Kitap oku")]);
    await renderScreen();
    expect(screen.getByText("0/2")).toBeTruthy();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Su iç tamamla" }));

    expect(screen.getByText("1/2")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Su iç tamamlandı, geri al" })).toBeTruthy();
  });

  it("undoes a completion when a completed check is pressed", async () => {
    seedStore(
      [makeHabit("Su iç"), makeHabit("Kitap oku")],
      [{ habitId: "Su iç", date: TODAY }],
    );
    await renderScreen();
    expect(screen.getByText("1/2")).toBeTruthy();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Su iç tamamlandı, geri al" }));

    expect(screen.getByText("0/2")).toBeTruthy();
  });

  it("stores the completion with the date it was given", async () => {
    seedStore([makeHabit("Su iç")]);
    await renderScreen("2026-11-18");

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Su iç tamamla" }));

    expect(useHabitStore.getState().completions).toEqual([
      { habitId: "Su iç", date: "2026-11-18" },
    ]);
  });

  it('shows "Küçük adımlar" while habits remain', async () => {
    seedStore(
      [makeHabit("Su iç"), makeHabit("Kitap oku")],
      [{ habitId: "Su iç", date: TODAY }],
    );

    await renderScreen();

    expect(screen.getByText("Küçük\nadımlar")).toBeTruthy();
    expect(screen.queryByText("Harika iş!")).toBeNull();
  });

  it('shows "Harika iş!" and "Hepsi tamamlandı" when everything is done', async () => {
    seedStore(
      [makeHabit("Su iç"), makeHabit("Kitap oku")],
      [
        { habitId: "Su iç", date: TODAY },
        { habitId: "Kitap oku", date: TODAY },
      ],
    );

    await renderScreen();

    expect(screen.getByText("Harika iş!")).toBeTruthy();
    expect(screen.getByText("Hepsi tamamlandı")).toBeTruthy();
    expect(screen.queryByText("Küçük\nadımlar")).toBeNull();
  });

  it("shows the highest current streak in the header", async () => {
    seedStore(
      [makeHabit("Su iç"), makeHabit("Kitap oku")],
      [
        { habitId: "Su iç", date: "2026-11-17" },
        { habitId: "Kitap oku", date: "2026-11-17" },
        { habitId: "Kitap oku", date: "2026-11-16" },
        { habitId: "Kitap oku", date: "2026-11-15" },
      ],
    );

    await renderScreen();

    expect(screen.getByText("3 gün")).toBeTruthy();
  });

  it('shows "Tümü" as selected by default', async () => {
    seedStore([makeHabit("Su iç")]);

    await renderScreen();

    expect(screen.getByRole("button", { name: "Tümü", selected: true })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sabah", selected: false })).toBeTruthy();
  });

  it('narrows the list to morning habits when "Sabah" is pressed', async () => {
    seedStore([
      makeHabit("Sabah işi", { reminderTime: "08:00" }),
      makeHabit("Akşam işi", { reminderTime: "20:00" }),
      makeHabit("Saatsiz iş"),
    ]);
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Sabah" }));

    expect(screen.getByText("Sabah işi")).toBeTruthy();
    expect(screen.queryByText("Akşam işi")).toBeNull();
    expect(screen.queryByText("Saatsiz iş")).toBeNull();
    expect(screen.getByRole("button", { name: "Sabah", selected: true })).toBeTruthy();
  });

  it('narrows the list to evening habits when "Akşam" is pressed', async () => {
    seedStore([
      makeHabit("Sabah işi", { reminderTime: "08:00" }),
      makeHabit("Öğle işi", { reminderTime: "13:00" }),
      makeHabit("Akşam işi", { reminderTime: "20:00" }),
    ]);
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Akşam" }));

    expect(screen.getByText("Akşam işi")).toBeTruthy();
    expect(screen.queryByText("Sabah işi")).toBeNull();
    expect(screen.queryByText("Öğle işi")).toBeNull();
  });

  it('shows all habits again when "Tümü" is pressed', async () => {
    seedStore([
      makeHabit("Sabah işi", { reminderTime: "08:00" }),
      makeHabit("Akşam işi", { reminderTime: "20:00" }),
      makeHabit("Saatsiz iş"),
    ]);
    await renderScreen();
    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Sabah" }));

    await user.press(screen.getByRole("button", { name: "Tümü" }));

    expect(screen.getByText("Sabah işi")).toBeTruthy();
    expect(screen.getByText("Akşam işi")).toBeTruthy();
    expect(screen.getByText("Saatsiz iş")).toBeTruthy();
  });

  it("does not change the summary counts when a filter is selected", async () => {
    seedStore(
      [
        makeHabit("Sabah işi", { reminderTime: "08:00" }),
        makeHabit("Akşam işi", { reminderTime: "20:00" }),
        makeHabit("Saatsiz iş"),
      ],
      [{ habitId: "Sabah işi", date: TODAY }],
    );
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Akşam" }));

    expect(screen.getByText("1/3")).toBeTruthy();
  });

  it("shows a message when the selected time of day has no habits", async () => {
    seedStore([makeHabit("Sabah işi", { reminderTime: "08:00" })]);
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Akşam" }));

    expect(screen.getByText("Bu zaman diliminde alışkanlık yok")).toBeTruthy();
  });

  it("shows the empty state when no habit is planned today", async () => {
    seedStore([makeHabit("Perşembe işi", { repeatDays: [4] })]);

    await renderScreen();

    expect(screen.getByText("Henüz alışkanlık yok")).toBeTruthy();
  });

  it("hides the filters, the summary and the filter message in the empty state", async () => {
    await renderScreen();

    expect(screen.getByText("Küçük\nadımlar")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Sabah" })).toBeNull();
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByText("Bu zaman diliminde alışkanlık yok")).toBeNull();
  });

  it("opens the new habit screen when the empty state button is pressed", async () => {
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "İlk alışkanlığını ekle" }));

    expect(router.push).toHaveBeenCalledWith("/habit/new");
  });

  it("shows only a neutral blank before hydration finishes", async () => {
    seedStore([makeHabit("Su iç")]);
    useHabitStore.setState({ hydrated: false });

    await renderScreen();

    expect(screen.queryByText("Su iç")).toBeNull();
    expect(screen.queryByText("Henüz alışkanlık yok")).toBeNull();
    expect(screen.queryByText("Günaydın")).toBeNull();
  });

  it("shows the habits once hydration finishes", async () => {
    seedStore([makeHabit("Su iç")]);
    useHabitStore.setState({ hydrated: false });
    await renderScreen();

    await act(async () => {
      useHabitStore.setState({ hydrated: true });
    });

    expect(screen.getByText("Su iç")).toBeTruthy();
  });

  it("opens the habit detail when a row is pressed", async () => {
    seedStore([makeHabit("water", { name: "Su iç" })]);
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Su iç, ayrıntıları aç" }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/habit/[id]",
      params: { id: "water" },
    });
  });

  it("opens the settings screen from the gear button", async () => {
    await renderScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Ayarlar" }));

    expect(router.push).toHaveBeenCalledWith("/settings");
  });
});
