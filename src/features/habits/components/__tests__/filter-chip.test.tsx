import { render, screen, userEvent } from "@testing-library/react-native";
import { FilterChip } from "./filter-chip";

describe("FilterChip", () => {
  it("shows its label", async () => {
    await render(<FilterChip label="Sabah" selected={false} onPress={() => {}} />);

    expect(screen.getByText("Sabah")).toBeTruthy();
  });

  it("reports its selected state", async () => {
    await render(<FilterChip label="Sabah" selected onPress={() => {}} />);

    expect(screen.getByRole("button", { name: "Sabah", selected: true })).toBeTruthy();
  });

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    await render(<FilterChip label="Sabah" selected={false} onPress={onPress} />);

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Sabah" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
