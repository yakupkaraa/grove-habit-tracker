import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { ThemePreference } from "./resolve-scheme";

export const THEME_STORAGE_KEY = "grove-theme";
const STORAGE_VERSION = 1;

type ThemeState = { preference: ThemePreference };
type ThemeActions = { setPreference: (preference: ThemePreference) => void };
type ThemeDeps = { storage: StateStorage };

const DEFAULT_DEPS: ThemeDeps = { storage: AsyncStorage };
const PREFERENCES: readonly ThemePreference[] = ["light", "dark", "system"];

function sanitize(persisted: unknown): ThemePreference {
  if (typeof persisted !== "object" || persisted === null) return "system";
  const { preference } = persisted as { preference?: unknown };

  return PREFERENCES.find((known) => known === preference) ?? "system";
}

export function createThemeStore(deps: Partial<ThemeDeps> = {}) {
  const { storage } = { ...DEFAULT_DEPS, ...deps };

  const store = create<ThemeState & ThemeActions>()(
    persist(
      (set) => ({
        preference: "system",
        setPreference: (preference) => set({ preference }),
      }),
      {
        name: THEME_STORAGE_KEY,
        version: STORAGE_VERSION,
        storage: createJSONStorage(() => storage),
        // Only the data is persisted; the action is rebuilt on every launch.
        partialize: ({ preference }) => ({ preference }),
        // Data from disk is validated by hand: an unknown value means "system".
        merge: (persisted, current) => ({ ...current, preference: sanitize(persisted) }),
        onRehydrateStorage: () => (_state, error) => {
          if (error) store.setState({ preference: "system" });
        },
      },
    ),
  );

  return store;
}

export const useThemeStore = createThemeStore();
