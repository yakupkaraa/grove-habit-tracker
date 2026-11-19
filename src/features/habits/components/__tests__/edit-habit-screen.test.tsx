import { render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useHabitStore } from "../../store/habit-store";
import { makeHabit } from "../../test-utils";
import { EditHabitScreen } from "../edit-habit-screen";

// Navigation and the native time picker are boundaries (see habit-form-screen tests).
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), canGoBack: jest.fn(), replace: jest.fn() },
}));
jest.mock("@react-native-community/datetimepicker", () => ({
  __esModule: true,
  default: jest.fn(() => null),
  DateTimePickerAndroid: { open: jest.fn() },
}));

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

async function renderScreen(id: string) {
  return render(
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <EditHabitScreen id={id} />
    </SafeAreaProvider>,
  );
}

beforeEach(() => {
  useHabitStore.setState({ habits: [], completions: [], hydrated: true });
});

describe("EditHabitScreen", () => {
  it("renders nothing when the habit does not exist", async () => {
    useHabitStore.setState({ habits: [makeHabit("h1")] });

    await renderScreen("missing");

    expect(screen.queryByText("Alışkanlığı düzenle")).toBeNull();
    expect(screen.queryByRole("button", { name: "Kaydet" })).toBeNull();
  });

  it("opens the form with the habit that has the given id", async () => {
    useHabitStore.setState({
      habits: [makeHabit("h1", { name: "Su iç" }), makeHabit("h2", { name: "Kitap oku" })],
    });

    await renderScreen("h2");

    expect(screen.getByPlaceholderText("Sabah yürüyüşü")).toHaveDisplayValue("Kitap oku");
  });
});
