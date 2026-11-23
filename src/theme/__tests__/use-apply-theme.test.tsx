import { act, renderHook } from "@testing-library/react-native";
import { Appearance } from "react-native";
import { useThemeStore } from "../theme-store";
import { useApplyTheme } from "../use-apply-theme";

// The native appearance is the boundary: we only check what we tell it.
const setColorScheme = jest.spyOn(Appearance, "setColorScheme").mockImplementation(() => {});

beforeEach(() => {
  setColorScheme.mockClear();
  useThemeStore.setState({ preference: "system" });
});

describe("useApplyTheme", () => {
  it("tells the native layer the chosen scheme, and 'unspecified' (follow the device) for system", async () => {
    await renderHook(() => useApplyTheme());
    expect(setColorScheme).toHaveBeenLastCalledWith("unspecified");

    await act(async () => useThemeStore.setState({ preference: "dark" }));
    expect(setColorScheme).toHaveBeenLastCalledWith("dark");

    await act(async () => useThemeStore.setState({ preference: "system" }));
    expect(setColorScheme).toHaveBeenLastCalledWith("unspecified");
  });
});
