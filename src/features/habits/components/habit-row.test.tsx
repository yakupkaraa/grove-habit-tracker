import { render, screen, userEvent } from "@testing-library/react-native";
import type { TodayItem } from "../utils/today";
import { HabitRow } from "./habit-row";

function makeItem(overrides: Partial<TodayItem["habit"]> = {}, rest: Partial<TodayItem> = {}): TodayItem {
  return {
    habit: {
      id: "water",
      name: "Su iç",
      icon: "water-outline",
      repeatDays: [0, 1, 2, 3, 4, 5, 6],
      reminderTime: "08:00",
      createdAt: "2026-01-01",
      ...overrides,
    },
    done: false,
    streak: 12,
    ...rest,
  };
}

describe("HabitRow", () => {
  it("shows the habit name", async () => {
    await render(<HabitRow item={makeItem()} onToggle={() => {}} />);

    expect(screen.getByText("Su iç")).toBeTruthy();
  });

  it("shows the repeat label, reminder and streak", async () => {
    await render(<HabitRow item={makeItem()} onToggle={() => {}} />);

    expect(screen.getByText("Her gün · 08:00 · 12 gün")).toBeTruthy();
  });

  it("omits the reminder when the habit has none", async () => {
    const item = makeItem({ reminderTime: undefined });
    await render(<HabitRow item={item} onToggle={() => {}} />);

    expect(screen.getByText("Her gün · 12 gün")).toBeTruthy();
  });

  it("hides the streak part when the streak is zero", async () => {
    const item = makeItem({}, { streak: 0 });
    await render(<HabitRow item={item} onToggle={() => {}} />);

    expect(screen.getByText("Her gün · 08:00")).toBeTruthy();
  });

  it("labels the check button as completable when the habit is not done", async () => {
    await render(<HabitRow item={makeItem()} onToggle={() => {}} />);

    expect(screen.getByRole("button", { name: "Su iç tamamla" })).toBeTruthy();
  });

  it("labels the check button as undoable when the habit is done", async () => {
    const item = makeItem({}, { done: true });
    await render(<HabitRow item={item} onToggle={() => {}} />);

    expect(screen.getByRole("button", { name: "Su iç tamamlandı, geri al" })).toBeTruthy();
  });

  it("calls onToggle with the habit id when the check button is pressed", async () => {
    const onToggle = jest.fn();
    await render(<HabitRow item={makeItem()} onToggle={onToggle} />);

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Su iç tamamla" }));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith("water");
  });
});
