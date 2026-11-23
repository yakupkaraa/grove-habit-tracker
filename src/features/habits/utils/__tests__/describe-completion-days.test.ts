import { addDays } from "../dates";
import { describeCompletionDays } from "../describe-completion-days";

// Only the long-range sentence reads the totals; the week list ignores them.
const TOTALS = { plannedDays: 0, doneDays: 0 };

describe("describeCompletionDays", () => {
  it("names each day of a week with its done and planned counts", () => {
    const days = [
      { date: "2026-11-16", planned: 3, done: 2 }, // Monday
      { date: "2026-11-17", planned: 2, done: 0 }, // Tuesday
    ];

    expect(describeCompletionDays(days, TOTALS)).toBe("Pazartesi 2/3, Salı 0/2");
  });

  it("says there is no planned day instead of 0/0", () => {
    const days = [
      { date: "2026-11-16", planned: 3, done: 2 }, // Monday
      { date: "2026-11-17", planned: 0, done: 0 }, // Tuesday
    ];

    expect(describeCompletionDays(days, TOTALS)).toBe("Pazartesi 2/3, Salı planlı gün yok");
  });

  it("summarizes a longer range in one sentence instead of listing every day", () => {
    const counts = [
      ...Array.from({ length: 14 }, () => ({ planned: 1, done: 1 })),
      ...Array.from({ length: 4 }, () => ({ planned: 1, done: 0 })),
      ...Array.from({ length: 12 }, () => ({ planned: 0, done: 0 })),
    ];
    const days = counts.map((count, index) => ({
      date: addDays("2026-10-20", index),
      ...count,
    }));

    const sentence = describeCompletionDays(days, { plannedDays: 18, doneDays: 14 });

    expect(sentence).toBe("Son 30 gün: 18 planlı gün, 14 tamamlandı.");
  });

  it("summarizes with the totals it is given instead of summing the days", () => {
    // The last day is a pending today: the bars count it as planned, the totals do not.
    const days = Array.from({ length: 8 }, (_, index) => ({
      date: addDays("2026-11-11", index),
      planned: 1,
      done: index < 5 ? 1 : 0,
    }));

    const sentence = describeCompletionDays(days, { plannedDays: 7, doneDays: 5 });

    expect(sentence).toBe("Son 8 gün: 7 planlı gün, 5 tamamlandı.");
  });

  it("lists every day up to seven days and summarizes from eight", () => {
    const daysOf = (length: number) =>
      Array.from({ length }, (_, index) => ({
        date: addDays("2026-11-11", index),
        planned: 1,
        done: 1,
      }));

    expect(describeCompletionDays(daysOf(7), TOTALS)).toContain("Perşembe 1/1");
    expect(describeCompletionDays(daysOf(8), TOTALS)).toBe("Son 8 gün: 0 planlı gün, 0 tamamlandı.");
  });
});
