import { formatTime, parseTime } from "./time";

describe("formatTime", () => {
  it("formats a date as zero-padded HH:mm", () => {
    expect(formatTime(new Date(2026, 10, 18, 9, 5))).toBe("09:05");
  });

  it("formats midnight as 00:00", () => {
    expect(formatTime(new Date(2026, 10, 18, 0, 0))).toBe("00:00");
  });

  it("formats 23:59", () => {
    expect(formatTime(new Date(2026, 10, 18, 23, 59))).toBe("23:59");
  });
});

describe("parseTime", () => {
  it("returns a date on the base day with the given hours and minutes", () => {
    const base = new Date(2026, 10, 18, 15, 42, 10);

    const parsed = parseTime("07:30", base);

    expect(parsed).toEqual(new Date(2026, 10, 18, 7, 30, 0, 0));
  });

  it("does not mutate the base date", () => {
    const base = new Date(2026, 10, 18, 15, 42);

    parseTime("07:30", base);

    expect(base).toEqual(new Date(2026, 10, 18, 15, 42));
  });

  it("round-trips with formatTime", () => {
    const base = new Date(2026, 10, 18);

    expect(formatTime(parseTime("07:05", base))).toBe("07:05");
    expect(formatTime(parseTime("23:59", base))).toBe("23:59");
  });
});
