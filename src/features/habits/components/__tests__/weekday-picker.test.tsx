import { render, screen, userEvent } from "@testing-library/react-native";
import { WeekdayPicker } from "../weekday-picker";

describe("WeekdayPicker", () => {
  it("shows the seven days in Monday-first order", async () => {
    await render(<WeekdayPicker selectedDays={[1]} onToggle={() => {}} />);

    const labels = screen.getAllByRole("button").map((b) => b.props.accessibilityLabel);

    expect(labels).toEqual([
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
      "Pazar",
    ]);
    expect(screen.getByText("Pzt")).toBeTruthy();
    expect(screen.getByText("Paz")).toBeTruthy();
  });

  it("marks only the selected days as selected", async () => {
    await render(<WeekdayPicker selectedDays={[1, 3, 0]} onToggle={() => {}} />);

    const selected = screen
      .getAllByRole("button", { selected: true })
      .map((b) => b.props.accessibilityLabel);

    expect(selected).toEqual(["Pazartesi", "Çarşamba", "Pazar"]);
  });

  it("calls onToggle with the pressed day", async () => {
    const onToggle = jest.fn();
    await render(<WeekdayPicker selectedDays={[1]} onToggle={onToggle} />);

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Pazar" }));

    expect(onToggle).toHaveBeenCalledWith(0);
  });
});
