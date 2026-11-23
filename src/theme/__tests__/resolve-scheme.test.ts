import { resolveScheme } from "../resolve-scheme";

describe("resolveScheme", () => {
  it("returns the chosen scheme when the preference is light or dark, whatever the system says", () => {
    expect(resolveScheme("light", "dark")).toBe("light");
    expect(resolveScheme("dark", "light")).toBe("dark");
  });

  it("follows the system scheme when the preference is system", () => {
    expect(resolveScheme("system", "dark")).toBe("dark");
    expect(resolveScheme("system", "light")).toBe("light");
  });

  it("falls back to light when the system scheme is unknown", () => {
    expect(resolveScheme("system", null)).toBe("light");
    expect(resolveScheme("system", undefined)).toBe("light");
    expect(resolveScheme("system", "unspecified")).toBe("light");
  });
});
