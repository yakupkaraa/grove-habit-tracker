import type { Weekday } from "../../types";
import { toggleWeekday, WEEKDAY_NAMES } from "../weekdays";

describe("toggleWeekday", () => {
  it("adds a day that is not selected", () => {
    expect(toggleWeekday([1, 2], 3)).toEqual([1, 2, 3]);
  });

  it("removes a day that is selected", () => {
    expect(toggleWeekday([1, 2, 3], 2)).toEqual([1, 3]);
  });

  it("keeps days in Monday-first order with Sunday last", () => {
    expect(toggleWeekday([5, 0], 1)).toEqual([1, 5, 0]);
    expect(toggleWeekday([1, 6], 0)).toEqual([1, 6, 0]);
  });

  it("does not mutate the input array", () => {
    const days: Weekday[] = [1, 2];

    toggleWeekday(days, 3);

    expect(days).toEqual([1, 2]);
  });

  it("never returns duplicates, even if the input has some", () => {
    expect(toggleWeekday([1, 1, 2], 3)).toEqual([1, 2, 3]);
  });
});

describe("WEEKDAY_NAMES", () => {
  it("has seven full names indexed by weekday, Sunday first", () => {
    expect(WEEKDAY_NAMES).toHaveLength(7);
    expect(WEEKDAY_NAMES[0]).toBe("Pazar");
    expect(WEEKDAY_NAMES[1]).toBe("Pazartesi");
  });
});
