import { render, screen, userEvent } from "@testing-library/react-native";
import { Button } from "../button";

describe("Button", () => {
  it("shows its label as a button", async () => {
    await render(<Button label="Kaydet" onPress={() => {}} />);

    expect(screen.getByRole("button", { name: "Kaydet" })).toBeTruthy();
  });

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    await render(<Button label="Kaydet" onPress={onPress} />);

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Kaydet" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
