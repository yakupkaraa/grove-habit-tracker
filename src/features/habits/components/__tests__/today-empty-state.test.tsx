import { render, screen, userEvent } from "@testing-library/react-native";
import { TodayEmptyState } from "../today-empty-state";

describe("TodayEmptyState", () => {
  it("calls onAddHabit when the add button is pressed", async () => {
    const onAddHabit = jest.fn();
    await render(<TodayEmptyState onAddHabit={onAddHabit} />);

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "İlk alışkanlığını ekle" }));

    expect(onAddHabit).toHaveBeenCalledTimes(1);
  });
});
