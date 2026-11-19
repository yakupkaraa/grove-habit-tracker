import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StateStorage } from "zustand/middleware";
import { createHabitStore, HABIT_STORAGE_KEY } from "./habit-store";

const NOW = new Date(2026, 10, 18, 9, 30);

function setup() {
  let counter = 0;
  return createHabitStore({
    now: () => NOW,
    generateId: () => `id-${++counter}`,
    storage: AsyncStorage,
  });
}

beforeEach(() => AsyncStorage.clear());

const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

const input = {
  name: "Su iç",
  icon: "water" as const,
  repeatDays: [1, 2, 3] as (0 | 1 | 2 | 3 | 4 | 5 | 6)[],
};

const storedHabit = {
  id: "h1",
  name: "Su iç",
  icon: "water",
  repeatDays: [1, 2],
  createdAt: "2026-11-01",
};

async function storeRaw(state: unknown) {
  await AsyncStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify({ state, version: 1 }));
}

describe("addHabit", () => {
  it("adds a habit to the list", () => {
    const store = setup();

    store.getState().addHabit(input);

    expect(store.getState().habits).toHaveLength(1);
  });

  it("sets createdAt to today's local date key", () => {
    const store = setup();

    store.getState().addHabit(input);

    expect(store.getState().habits[0].createdAt).toBe("2026-11-18");
  });

  it("sets the generated id on the habit", () => {
    const store = setup();

    store.getState().addHabit(input);

    expect(store.getState().habits[0].id).toBe("id-1");
  });

  it("gives each added habit a unique id", () => {
    const store = setup();

    store.getState().addHabit(input);
    store.getState().addHabit(input);

    const [first, second] = store.getState().habits;
    expect(first.id).not.toBe(second.id);
  });

  it("trims the habit name", () => {
    const store = setup();

    store.getState().addHabit({ ...input, name: "  Su iç  " });

    expect(store.getState().habits[0].name).toBe("Su iç");
  });

  it("keeps the input fields unchanged", () => {
    const store = setup();
    const full = { ...input, reminderTime: "08:00" };

    store.getState().addHabit(full);

    expect(store.getState().habits[0]).toMatchObject(full);
  });
});

describe("removeHabit", () => {
  it("removes the habit with the given id", () => {
    const store = setup();
    store.getState().addHabit(input);

    store.getState().removeHabit("id-1");

    expect(store.getState().habits).toEqual([]);
  });

  it("removes all completions of that habit", () => {
    const store = setup();
    store.getState().addHabit(input);
    store.setState({
      completions: [
        { habitId: "id-1", date: "2026-11-17" },
        { habitId: "id-1", date: "2026-11-18" },
      ],
    });

    store.getState().removeHabit("id-1");

    expect(store.getState().completions).toEqual([]);
  });

  it("keeps the other habits and their completions", () => {
    const store = setup();
    store.getState().addHabit(input);
    store.getState().addHabit({ ...input, name: "Koş" });
    store.setState({
      completions: [
        { habitId: "id-1", date: "2026-11-18" },
        { habitId: "id-2", date: "2026-11-18" },
      ],
    });

    store.getState().removeHabit("id-1");

    expect(store.getState().habits.map((h) => h.id)).toEqual(["id-2"]);
    expect(store.getState().completions).toEqual([
      { habitId: "id-2", date: "2026-11-18" },
    ]);
  });

  it("does nothing when the id is unknown", () => {
    const store = setup();
    store.getState().addHabit(input);
    store.setState({ completions: [{ habitId: "id-1", date: "2026-11-18" }] });
    const before = store.getState();

    store.getState().removeHabit("unknown");

    expect(store.getState().habits).toEqual(before.habits);
    expect(store.getState().completions).toEqual(before.completions);
  });
});

describe("updateHabit", () => {
  it("updates the given fields and keeps the rest", () => {
    const store = setup();
    store.getState().addHabit(input);

    store.getState().updateHabit("id-1", { name: "Koş", icon: "walk" });

    expect(store.getState().habits[0]).toMatchObject({
      name: "Koş",
      icon: "walk",
      repeatDays: input.repeatDays,
    });
  });

  it("trims the name when the patch changes it", () => {
    const store = setup();
    store.getState().addHabit(input);

    store.getState().updateHabit("id-1", { name: "  Koş  " });

    expect(store.getState().habits[0].name).toBe("Koş");
  });

  it("does not change id or createdAt even if the patch contains them", () => {
    const store = setup();
    store.getState().addHabit(input);
    const patch = { id: "hacked", createdAt: "1999-01-01", name: "Koş" };

    store.getState().updateHabit("id-1", patch);

    expect(store.getState().habits[0]).toMatchObject({
      id: "id-1",
      createdAt: "2026-11-18",
      name: "Koş",
    });
  });

  it("does nothing when the id is unknown", () => {
    const store = setup();
    store.getState().addHabit(input);
    const before = store.getState().habits;

    store.getState().updateHabit("unknown", { name: "Koş" });

    expect(store.getState().habits).toEqual(before);
  });

  it("does not touch other habits", () => {
    const store = setup();
    store.getState().addHabit(input);
    store.getState().addHabit({ ...input, name: "Koş" });
    const [, second] = store.getState().habits;

    store.getState().updateHabit("id-1", { name: "Oku" });

    expect(store.getState().habits[1]).toEqual(second);
  });
});

describe("toggleCompletion", () => {
  it("adds a completion when it is missing", () => {
    const store = setup();
    store.getState().addHabit(input);

    store.getState().toggleCompletion("id-1", "2026-11-18");

    expect(store.getState().completions).toEqual([
      { habitId: "id-1", date: "2026-11-18" },
    ]);
  });

  it("removes the completion when it exists", () => {
    const store = setup();
    store.getState().addHabit(input);
    store.getState().toggleCompletion("id-1", "2026-11-18");

    store.getState().toggleCompletion("id-1", "2026-11-18");

    expect(store.getState().completions).toEqual([]);
  });

  it("returns to the original state when toggled twice", () => {
    const store = setup();
    store.getState().addHabit(input);
    store.getState().toggleCompletion("id-1", "2026-11-17");
    const before = store.getState().completions;

    store.getState().toggleCompletion("id-1", "2026-11-18");
    store.getState().toggleCompletion("id-1", "2026-11-18");

    expect(store.getState().completions).toEqual(before);
  });

  it("never creates duplicate completions", () => {
    const store = setup();
    store.getState().addHabit(input);

    store.getState().toggleCompletion("id-1", "2026-11-18");
    store.getState().toggleCompletion("id-1", "2026-11-18");
    store.getState().toggleCompletion("id-1", "2026-11-18");

    expect(store.getState().completions).toHaveLength(1);
  });

  it("ignores an unknown habitId", () => {
    const store = setup();
    store.getState().addHabit(input);

    store.getState().toggleCompletion("unknown", "2026-11-18");

    expect(store.getState().completions).toEqual([]);
  });
});

describe("persist", () => {
  it("writes habits and completions to storage under the persist key", async () => {
    const store = setup();

    store.getState().addHabit(input);
    store.getState().toggleCompletion("id-1", "2026-11-18");
    await nextTick();

    const raw = await AsyncStorage.getItem(HABIT_STORAGE_KEY);
    const saved = JSON.parse(raw ?? "null");
    expect(saved.state.habits).toHaveLength(1);
    expect(saved.state.completions).toEqual([
      { habitId: "id-1", date: "2026-11-18" },
    ]);
  });

  it("does not write actions to storage", async () => {
    const store = setup();

    store.getState().addHabit(input);
    await nextTick();

    const raw = await AsyncStorage.getItem(HABIT_STORAGE_KEY);
    const saved = JSON.parse(raw ?? "null");
    expect(Object.keys(saved.state).sort()).toEqual(["completions", "habits"]);
  });

  it("restores habits and completions from storage on rehydrate", async () => {
    const first = setup();
    first.getState().addHabit(input);
    first.getState().toggleCompletion("id-1", "2026-11-18");
    await nextTick();

    const second = setup();
    await second.persist.rehydrate();

    expect(second.getState().habits).toEqual(first.getState().habits);
    expect(second.getState().completions).toEqual(first.getState().completions);
  });

  it("falls back to empty state when the stored value is not valid JSON", async () => {
    const store = setup();
    store.getState().addHabit(input);
    await nextTick();
    await AsyncStorage.setItem(HABIT_STORAGE_KEY, "{not json");

    await store.persist.rehydrate();

    expect(store.getState().habits).toEqual([]);
    expect(store.getState().completions).toEqual([]);
  });

  it("falls back to empty state when habits or completions are not arrays", async () => {
    const store = setup();
    store.getState().addHabit(input);
    await nextTick();
    const corrupted = { state: { habits: "oops", completions: 5 }, version: 1 };
    await AsyncStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(corrupted));

    await store.persist.rehydrate();

    expect(store.getState().habits).toEqual([]);
    expect(store.getState().completions).toEqual([]);
  });

  it("drops invalid habits and keeps the valid ones", async () => {
    await storeRaw({
      habits: [
        storedHabit,
        { id: "h2", name: "Eksik alanlar" },
        "junk",
        { ...storedHabit, id: "h3", repeatDays: [9] },
      ],
      completions: [],
    });
    const store = setup();

    await store.persist.rehydrate();

    expect(store.getState().habits).toEqual([storedHabit]);
  });

  it("drops invalid and orphaned completions", async () => {
    const valid = { habitId: "h1", date: "2026-11-18" };
    await storeRaw({
      habits: [storedHabit, { id: "h2", name: "Geçersiz" }],
      completions: [
        valid,
        { habitId: "h1", date: 20261118 },
        "junk",
        { habitId: "h2", date: "2026-11-18" },
        { habitId: "gone", date: "2026-11-18" },
      ],
    });
    const store = setup();

    await store.persist.rehydrate();

    expect(store.getState().completions).toEqual([valid]);
  });

  it("falls back to empty state when the stored version is unknown", async () => {
    const store = setup();
    store.getState().addHabit(input);
    await nextTick();
    const future = { state: { habits: [storedHabit], completions: [] }, version: 99 };
    await AsyncStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(future));

    await store.persist.rehydrate();

    expect(store.getState().habits).toEqual([]);
  });
});

function deferredStorage() {
  let release: (value: string | null) => void = () => {};
  const pending = new Promise<string | null>((resolve) => {
    release = resolve;
  });
  const storage: StateStorage = {
    getItem: () => pending,
    setItem: () => undefined,
    removeItem: () => undefined,
  };
  return { storage, release };
}

describe("hydration", () => {
  it("is not hydrated before the persisted state has loaded", () => {
    const { storage } = deferredStorage();

    const store = createHabitStore({ storage });

    expect(store.getState().hydrated).toBe(false);
  });

  it("becomes hydrated when rehydration finishes", async () => {
    const { storage, release } = deferredStorage();
    const store = createHabitStore({ storage });

    release(null);
    await nextTick();

    expect(store.getState().hydrated).toBe(true);
  });

  it("becomes hydrated even when the stored value is corrupted", async () => {
    const { storage, release } = deferredStorage();
    const store = createHabitStore({ storage });

    release("{not json");
    await nextTick();

    expect(store.getState().hydrated).toBe(true);
    expect(store.getState().habits).toEqual([]);
  });
});
