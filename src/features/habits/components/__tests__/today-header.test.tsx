import { render, screen, userEvent } from "@testing-library/react-native";
import { TodayHeader } from "../today-header";

describe("TodayHeader", () => {
  it('still shows "0 gün" when the streak is zero', async () => {
    await render(<TodayHeader streak={0} onPressSettings={() => {}} />);

    expect(screen.getByText("0 gün")).toBeTruthy();
  });

  it("calls onPressSettings when the settings button is pressed", async () => {
    const onPressSettings = jest.fn();
    await render(<TodayHeader streak={3} onPressSettings={onPressSettings} />);

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "Ayarlar" }));

    expect(onPressSettings).toHaveBeenCalledTimes(1);
  });
});
