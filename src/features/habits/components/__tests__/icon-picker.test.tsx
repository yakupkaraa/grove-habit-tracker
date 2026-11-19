import { render, screen, userEvent } from "@testing-library/react-native";
import { IconPicker } from "../icon-picker";

describe("IconPicker", () => {
  it("marks only the selected icon as selected", async () => {
    await render(<IconPicker selected="book-outline" onSelect={() => {}} />);

    expect(screen.getByRole("button", { name: "Kitap", selected: true })).toBeTruthy();
    expect(screen.getAllByRole("button", { selected: true })).toHaveLength(1);
  });

  it("calls onSelect with the pressed icon", async () => {
    const onSelect = jest.fn();
    await render(<IconPicker selected="walk-outline" onSelect={onSelect} />);

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Su" }));

    expect(onSelect).toHaveBeenCalledWith("water-outline");
  });
});
