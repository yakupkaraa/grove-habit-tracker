import { renderHook } from "@testing-library/react-native";
import { useColorScheme } from "react-native";
import { darkColors, lightColors } from "../colors";
import { useThemeStore } from "../theme-store";
import { useColors } from "../use-colors";

// The device scheme is the boundary: RN's jest preset already mocks this hook.
const setDeviceScheme = (scheme: "light" | "dark") =>
  jest.mocked(useColorScheme).mockReturnValue(scheme);

beforeEach(() => {
  useThemeStore.setState({ preference: "system" });
  setDeviceScheme("light");
});

describe("useColors", () => {
  it("returns the palette of the effective scheme: the preference wins, system follows the device", async () => {
    setDeviceScheme("dark");
    const { result, rerender } = await renderHook(() => useColors());
    expect(result.current).toBe(darkColors);

    useThemeStore.setState({ preference: "light" });
    await rerender({});
    expect(result.current).toBe(lightColors);
  });
});
