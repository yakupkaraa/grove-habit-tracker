import { formatRepeatDays } from "./repeat-label";

describe("formatRepeatDays", () => {
  it('returns "Her gün" when all seven days are selected', () => {
    expect(formatRepeatDays([0, 1, 2, 3, 4, 5, 6])).toBe("Her gün");
  });

  it('returns "Hafta içi" for Monday to Friday', () => {
    expect(formatRepeatDays([1, 2, 3, 4, 5])).toBe("Hafta içi");
  });

  it('returns "Hafta sonu" for Saturday and Sunday', () => {
    expect(formatRepeatDays([6, 0])).toBe("Hafta sonu");
  });

  it("returns short day names in Monday-first order for other combinations", () => {
    expect(formatRepeatDays([0, 5, 1, 3])).toBe("Pzt, Çar, Cum, Paz");
  });

  it("returns a single short name for one day", () => {
    expect(formatRepeatDays([3])).toBe("Çar");
  });

  it("returns the same result regardless of input order", () => {
    expect(formatRepeatDays([5, 3, 1, 4, 2])).toBe("Hafta içi");
    expect(formatRepeatDays([3, 1])).toBe(formatRepeatDays([1, 3]));
  });

  it("ignores duplicate days", () => {
    expect(formatRepeatDays([1, 1, 2, 3, 4, 5, 5])).toBe("Hafta içi");
    expect(formatRepeatDays([3, 3])).toBe("Çar");
  });

  it("returns an empty string when no day is selected", () => {
    expect(formatRepeatDays([])).toBe("");
  });
});
