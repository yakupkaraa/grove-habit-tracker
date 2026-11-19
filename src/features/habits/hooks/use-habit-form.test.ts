import { act, renderHook } from "@testing-library/react-native";
import { useHabitStore } from "../store/habit-store";
import { useHabitForm } from "./use-habit-form";

beforeEach(() => {
  useHabitStore.setState({ habits: [], completions: [], hydrated: true });
});

describe("useHabitForm", () => {
  it("starts with the default values", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));

    expect(result.current).toMatchObject({
      name: "",
      icon: "walk-outline",
      repeatDays: [1, 2, 3, 4, 5],
      reminderEnabled: true,
      reminderTime: "07:30",
      errors: {},
    });
  });

  it("updates the name", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));

    await act(async () => result.current.setName("Su iç"));

    expect(result.current.name).toBe("Su iç");
  });

  it("selects an icon", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));

    await act(async () => result.current.setIcon("book-outline"));

    expect(result.current.icon).toBe("book-outline");
  });

  it("toggles a weekday on and off", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));

    await act(async () => result.current.toggleDay(6));
    expect(result.current.repeatDays).toEqual([1, 2, 3, 4, 5, 6]);

    await act(async () => result.current.toggleDay(1));
    expect(result.current.repeatDays).toEqual([2, 3, 4, 5, 6]);
  });

  it("toggles the reminder and changes its time", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));

    await act(async () => result.current.setReminderEnabled(false));
    await act(async () => result.current.setReminderTime("21:15"));

    expect(result.current.reminderEnabled).toBe(false);
    expect(result.current.reminderTime).toBe("21:15");
  });

  it("keeps the chosen time when the reminder is turned off and on again", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));
    await act(async () => result.current.setReminderTime("21:15"));

    await act(async () => result.current.setReminderEnabled(false));
    await act(async () => result.current.setReminderEnabled(true));

    expect(result.current.reminderTime).toBe("21:15");
  });

  it("does not save and shows the name error when the name is empty", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));

    await act(async () => result.current.submit());

    expect(result.current.errors).toEqual({ name: "Bir ad girin" });
    expect(useHabitStore.getState().habits).toEqual([]);
  });

  it("does not save and shows the days error when no day is selected", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));
    await act(async () => result.current.setName("Su iç"));
    for (const day of [1, 2, 3, 4, 5] as const) {
      await act(async () => result.current.toggleDay(day));
    }

    await act(async () => result.current.submit());

    expect(result.current.errors).toEqual({ days: "En az bir gün seçin" });
    expect(useHabitStore.getState().habits).toEqual([]);
  });

  it("shows both errors at once", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));
    for (const day of [1, 2, 3, 4, 5] as const) {
      await act(async () => result.current.toggleDay(day));
    }

    await act(async () => result.current.submit());

    expect(result.current.errors).toEqual({
      name: "Bir ad girin",
      days: "En az bir gün seçin",
    });
  });

  it("clears the name error as soon as a name is typed", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));
    await act(async () => result.current.submit());
    expect(result.current.errors.name).toBeDefined();

    await act(async () => result.current.setName("S"));

    expect(result.current.errors.name).toBeUndefined();
  });

  it("clears the days error as soon as a day is selected", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));
    await act(async () => result.current.setName("Su iç"));
    for (const day of [1, 2, 3, 4, 5] as const) {
      await act(async () => result.current.toggleDay(day));
    }
    await act(async () => result.current.submit());
    expect(result.current.errors.days).toBeDefined();

    await act(async () => result.current.toggleDay(6));

    expect(result.current.errors.days).toBeUndefined();
  });

  it("saves a valid habit with name, icon, repeatDays and reminderTime", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));
    await act(async () => result.current.setName("Su iç"));
    await act(async () => result.current.setIcon("water-outline"));
    await act(async () => result.current.toggleDay(6));
    await act(async () => result.current.setReminderTime("21:15"));

    await act(async () => result.current.submit());

    expect(useHabitStore.getState().habits).toHaveLength(1);
    expect(useHabitStore.getState().habits[0]).toMatchObject({
      name: "Su iç",
      icon: "water-outline",
      repeatDays: [1, 2, 3, 4, 5, 6],
      reminderTime: "21:15",
    });
  });

  it("trims the name when saving", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));
    await act(async () => result.current.setName("  Su iç  "));

    await act(async () => result.current.submit());

    expect(useHabitStore.getState().habits[0].name).toBe("Su iç");
  });

  it("leaves out reminderTime when the reminder is off", async () => {
    const { result } = await renderHook(() => useHabitForm({ onSaved: () => {} }));
    await act(async () => result.current.setName("Su iç"));
    await act(async () => result.current.setReminderEnabled(false));

    await act(async () => result.current.submit());

    expect(useHabitStore.getState().habits[0]).not.toHaveProperty("reminderTime");
  });

  it("calls onSaved after a successful save", async () => {
    const onSaved = jest.fn();
    const { result } = await renderHook(() => useHabitForm({ onSaved }));
    await act(async () => result.current.setName("Su iç"));

    await act(async () => result.current.submit());

    expect(onSaved).toHaveBeenCalledTimes(1);
  });

  it("does not call onSaved when validation fails", async () => {
    const onSaved = jest.fn();
    const { result } = await renderHook(() => useHabitForm({ onSaved }));

    await act(async () => result.current.submit());

    expect(onSaved).not.toHaveBeenCalled();
  });

  it("ignores a second submit after a successful save", async () => {
    const onSaved = jest.fn();
    const { result } = await renderHook(() => useHabitForm({ onSaved }));
    await act(async () => result.current.setName("Su iç"));

    await act(async () => {
      result.current.submit();
      result.current.submit();
    });

    expect(useHabitStore.getState().habits).toHaveLength(1);
    expect(onSaved).toHaveBeenCalledTimes(1);
  });
});
