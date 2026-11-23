import AsyncStorage from "@react-native-async-storage/async-storage";
import { createThemeStore, THEME_STORAGE_KEY } from "../theme-store";

const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => AsyncStorage.clear());

describe("theme store", () => {
  it("starts with the system preference", () => {
    const store = createThemeStore({ storage: AsyncStorage });

    expect(store.getState().preference).toBe("system");
  });

  it("saves the chosen preference", () => {
    const store = createThemeStore({ storage: AsyncStorage });

    store.getState().setPreference("dark");

    expect(store.getState().preference).toBe("dark");
  });

  it("restores a saved preference after a restart", async () => {
    createThemeStore({ storage: AsyncStorage }).getState().setPreference("dark");
    await nextTick();

    const restarted = createThemeStore({ storage: AsyncStorage });
    await nextTick();

    expect(restarted.getState().preference).toBe("dark");
  });

  it("falls back to system when the stored preference is unknown or corrupt", async () => {
    const store = createThemeStore({ storage: AsyncStorage });
    const unknown = { state: { preference: "purple" }, version: 1 };
    await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(unknown));
    await store.persist.rehydrate();
    expect(store.getState().preference).toBe("system");

    store.getState().setPreference("dark");
    await AsyncStorage.setItem(THEME_STORAGE_KEY, "{not json");
    await store.persist.rehydrate();
    expect(store.getState().preference).toBe("system");
  });
});
