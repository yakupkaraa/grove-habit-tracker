import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { Completion, Habit, Weekday } from "../types";
import { toDateKey } from "../utils/dates";

export const HABIT_STORAGE_KEY = "grove-habits";
const STORAGE_VERSION = 1;
const LAST_WEEKDAY = 6;
const RANDOM_ID_RADIX = 36;

type HabitInput = Omit<Habit, "id" | "createdAt">;
type HabitPatch = Partial<HabitInput>;

type HabitState = { habits: Habit[]; completions: Completion[] };
// `hydrated` is runtime-only: it is never persisted (see partialize).
type HabitMeta = { hydrated: boolean };
type HabitActions = {
  addHabit: (input: HabitInput) => void;
  removeHabit: (id: string) => void;
  updateHabit: (id: string, patch: HabitPatch) => void;
  toggleCompletion: (habitId: string, date: string) => void;
};

type StoreDeps = {
  now: () => Date;
  generateId: () => string;
  storage: StateStorage;
};

const EMPTY_STATE: HabitState = { habits: [], completions: [] };

function defaultGenerateId(): string {
  const random = Math.random().toString(RANDOM_ID_RADIX).slice(2);
  return `${Date.now().toString(RANDOM_ID_RADIX)}${random}`;
}

const DEFAULT_DEPS: StoreDeps = {
  now: () => new Date(),
  generateId: defaultGenerateId,
  storage: AsyncStorage,
};

function trimName(patch: HabitPatch): Pick<HabitPatch, "name"> {
  return patch.name === undefined ? {} : { name: patch.name.trim() };
}

function isSameCompletion(a: Completion, b: Completion): boolean {
  return a.habitId === b.habitId && a.date === b.date;
}

// Persisted data comes from disk, so it is validated by hand before it is trusted.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWeekday(value: unknown): value is Weekday {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= LAST_WEEKDAY;
}

function isHabit(value: unknown): value is Habit {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.icon === "string" &&
    typeof value.color === "string" &&
    typeof value.createdAt === "string" &&
    Array.isArray(value.repeatDays) &&
    value.repeatDays.every(isWeekday) &&
    (value.reminderTime === undefined || typeof value.reminderTime === "string")
  );
}

function isCompletion(value: unknown): value is Completion {
  return (
    isRecord(value) &&
    typeof value.habitId === "string" &&
    typeof value.date === "string"
  );
}

function sanitize(persisted: unknown): HabitState {
  if (!isRecord(persisted)) return EMPTY_STATE;
  const { habits, completions } = persisted;
  if (!Array.isArray(habits) || !Array.isArray(completions)) return EMPTY_STATE;

  const validHabits = habits.filter(isHabit);
  const ownerIds = new Set(validHabits.map((h) => h.id));
  const validCompletions = completions
    .filter(isCompletion)
    .filter((c) => ownerIds.has(c.habitId));

  return { habits: validHabits, completions: validCompletions };
}

export function createHabitStore(deps: Partial<StoreDeps> = {}) {
  const { now, generateId, storage } = { ...DEFAULT_DEPS, ...deps };

  const store = create<HabitState & HabitMeta & HabitActions>()(
    persist(
      (set) => ({
        ...EMPTY_STATE,
        hydrated: false,

        addHabit: (input) =>
          set((state) => ({
            habits: [
              ...state.habits,
              {
                ...input,
                name: input.name.trim(),
                id: generateId(),
                createdAt: toDateKey(now()),
              },
            ],
          })),

        removeHabit: (id) =>
          set((state) => ({
            habits: state.habits.filter((h) => h.id !== id),
            completions: state.completions.filter((c) => c.habitId !== id),
          })),

        updateHabit: (id, patch) =>
          set((state) => ({
            habits: state.habits.map((h) =>
              h.id === id
                ? { ...h, ...patch, ...trimName(patch), id: h.id, createdAt: h.createdAt }
                : h,
            ),
          })),

        toggleCompletion: (habitId, date) =>
          set((state) => {
            if (!state.habits.some((h) => h.id === habitId)) return state;

            const target = { habitId, date };
            const isDone = state.completions.some((c) => isSameCompletion(c, target));

            return {
              completions: isDone
                ? state.completions.filter((c) => !isSameCompletion(c, target))
                : [...state.completions, target],
            };
          }),
      }),
      {
        name: HABIT_STORAGE_KEY,
        version: STORAGE_VERSION,
        storage: createJSONStorage(() => storage),
        // Only data is persisted; actions are rebuilt by the store on every launch.
        partialize: ({ habits, completions }) => ({ habits, completions }),
        migrate: () => EMPTY_STATE,
        merge: (persisted, current) =>
          persisted === undefined ? current : { ...current, ...sanitize(persisted) },
        onRehydrateStorage: () => (_state, error) => {
          if (error) store.setState(EMPTY_STATE);
          // zustand's own hasHydrated() never turns true after an error, so we track it.
          store.setState({ hydrated: true });
        },
      },
    ),
  );

  return store;
}

export const useHabitStore = createHabitStore();
