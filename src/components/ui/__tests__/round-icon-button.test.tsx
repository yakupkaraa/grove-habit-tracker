import { render, screen, userEvent } from "@testing-library/react-native";
import { RoundIconButton } from "../round-icon-button";

describe("RoundIconButton", () => {
  it("shows a button with the given accessibility label", async () => {
    await render(
      <RoundIconButton icon="close" accessibilityLabel="Kapat" onPress={() => {}} />,
    );

    expect(screen.getByRole("button", { name: "Kapat" })).toBeTruthy();
  });

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    await render(<RoundIconButton icon="close" accessibilityLabel="Kapat" onPress={onPress} />);

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Kapat" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("reports its selected state when selected is provided", async () => {
    await render(
      <RoundIconButton icon="water-outline" accessibilityLabel="Su" selected onPress={() => {}} />,
    );

    expect(screen.getByRole("button", { name: "Su", selected: true })).toBeTruthy();
  });

  it("does not expose a selected state when selected is not provided", async () => {
    await render(
      <RoundIconButton icon="close" accessibilityLabel="Kapat" onPress={() => {}} />,
    );

    const button = screen.getByRole("button", { name: "Kapat" });

    expect(button.props.accessibilityState.selected).toBeUndefined();
  });
});
