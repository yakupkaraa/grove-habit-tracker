import { render, screen, userEvent } from "@testing-library/react-native";
import { ReminderRow } from "../reminder-row";

const WEEKDAYS = [1, 2, 3, 4, 5] as const;

describe("ReminderRow", () => {
  it("shows the title and the reminder with its time when enabled", async () => {
    await render(
      <ReminderRow
        enabled
        time="07:30"
        repeatDays={WEEKDAYS}
        onToggle={() => {}}
        onPressTime={() => {}}
      />,
    );

    expect(screen.getByText("Hatırlatma")).toBeTruthy();
    expect(screen.getByText("Hafta içi")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Hatırlatma saati 07:30" })).toBeTruthy();
    expect(screen.getByText("07:30")).toBeTruthy();
  });

  it('shows "Kapalı" and no time button when disabled', async () => {
    await render(
      <ReminderRow
        enabled={false}
        time="07:30"
        repeatDays={WEEKDAYS}
        onToggle={() => {}}
        onPressTime={() => {}}
      />,
    );

    expect(screen.getByText("Kapalı")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Hatırlatma saati 07:30" })).toBeNull();
    expect(screen.queryByText("07:30")).toBeNull();
  });

  it("exposes the switch state", async () => {
    const props = { time: "07:30", repeatDays: WEEKDAYS, onToggle: () => {}, onPressTime: () => {} };
    const { rerender } = await render(<ReminderRow enabled {...props} />);
    expect(screen.getByRole("switch", { name: "Hatırlatma", checked: true })).toBeTruthy();

    await rerender(<ReminderRow enabled={false} {...props} />);
    expect(screen.getByRole("switch", { name: "Hatırlatma", checked: false })).toBeTruthy();
  });

  it("calls onToggle with the opposite value when the switch is pressed", async () => {
    const onToggle = jest.fn();
    const props = { time: "07:30", repeatDays: WEEKDAYS, onPressTime: () => {} };
    const { rerender } = await render(<ReminderRow enabled onToggle={onToggle} {...props} />);
    const user = userEvent.setup();

    await user.press(screen.getByRole("switch", { name: "Hatırlatma" }));
    expect(onToggle).toHaveBeenLastCalledWith(false);

    await rerender(<ReminderRow enabled={false} onToggle={onToggle} {...props} />);
    await user.press(screen.getByRole("switch", { name: "Hatırlatma" }));
    expect(onToggle).toHaveBeenLastCalledWith(true);
  });

  it("calls onPressTime when the time is pressed", async () => {
    const onPressTime = jest.fn();
    await render(
      <ReminderRow
        enabled
        time="07:30"
        repeatDays={WEEKDAYS}
        onToggle={() => {}}
        onPressTime={onPressTime}
      />,
    );

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Hatırlatma saati 07:30" }));

    expect(onPressTime).toHaveBeenCalledTimes(1);
  });

  it("shows only the time when no repeat day is selected", async () => {
    await render(
      <ReminderRow
        enabled
        time="07:30"
        repeatDays={[]}
        onToggle={() => {}}
        onPressTime={() => {}}
      />,
    );

    // /\p{L}|\d/u skips the icon glyph, which is also rendered as a Text node.
    const texts = screen.getAllByText(/\p{L}|\d/u).map((node) => node.props.children);

    expect(texts).toEqual(["Hatırlatma", "07:30"]);
  });

  it("does not call onPressTime when the reminder is off", async () => {
    const onPressTime = jest.fn();
    await render(
      <ReminderRow
        enabled={false}
        time="07:30"
        repeatDays={WEEKDAYS}
        onToggle={() => {}}
        onPressTime={onPressTime}
      />,
    );

    const user = userEvent.setup();
    await user.press(screen.getByText("Kapalı"));

    expect(onPressTime).not.toHaveBeenCalled();
  });
});
