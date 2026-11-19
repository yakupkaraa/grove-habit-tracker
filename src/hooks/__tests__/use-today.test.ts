import { act, renderHook } from "@testing-library/react-native";
import { AppState, type AppStateStatus } from "react-native";
import { useToday } from "./use-today";

// AppState is a native boundary: jest-expo mocks addEventListener, so we grab the
// handler the hook registered and call it ourselves.
const addEventListener = AppState.addEventListener as jest.Mock;

async function emitAppState(state: AppStateStatus) {
  const [, handler] = addEventListener.mock.calls.at(-1);
  await act(async () => handler(state));
}

function clock(initial: Date) {
  let current = initial;
  return {
    now: () => current,
    setTime: (next: Date) => {
      current = next;
    },
  };
}

beforeEach(() => addEventListener.mockClear());

describe("useToday", () => {
  it("returns today's local date key from the injected clock", async () => {
    const now = () => new Date(2026, 10, 18, 23, 30);

    const { result } = await renderHook(() => useToday(now));

    expect(result.current).toBe("2026-11-18");
  });

  it("keeps the same date when the app returns to the foreground on the same day", async () => {
    const { now, setTime } = clock(new Date(2026, 10, 18, 9, 0));
    const { result } = await renderHook(() => useToday(now));

    setTime(new Date(2026, 10, 18, 21, 0));
    await emitAppState("active");

    expect(result.current).toBe("2026-11-18");
  });

  it("updates to the new date when the app returns to the foreground on a new day", async () => {
    const { now, setTime } = clock(new Date(2026, 10, 18, 23, 0));
    const { result } = await renderHook(() => useToday(now));

    setTime(new Date(2026, 10, 19, 7, 0));
    await emitAppState("active");

    expect(result.current).toBe("2026-11-19");
  });

  it("does not update when the app goes to the background, even if the day changed", async () => {
    const { now, setTime } = clock(new Date(2026, 10, 18, 23, 0));
    const { result } = await renderHook(() => useToday(now));

    setTime(new Date(2026, 10, 19, 0, 5));
    await emitAppState("background");

    expect(result.current).toBe("2026-11-18");
  });

  it("stops listening to app state changes on unmount", async () => {
    const remove = jest.fn();
    addEventListener.mockReturnValueOnce({ remove });
    const { unmount } = await renderHook(() => useToday(() => new Date(2026, 10, 18)));

    await unmount();

    expect(remove).toHaveBeenCalledTimes(1);
  });
});
