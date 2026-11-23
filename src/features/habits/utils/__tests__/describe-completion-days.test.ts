import { addDays } from "../dates";
import { describeCompletionDays } from "../describe-completion-days";

describe("describeCompletionDays", () => {
  it("names each day of a week with its done and planned counts", () => {
    const days = [
      { date: "2026-11-16", planned: 3, done: 2 }, // Monday
      { date: "2026-11-17", planned: 2, done: 0 }, // Tuesday
    ];

    expect(describeCompletionDays(days)).toBe("Pazartesi 2/3, Salı 0/2");
  });

  it("says there is no planned day instead of 0/0", () => {
    const days = [
      { date: "2026-11-16", planned: 3, done: 2 }, // Monday
      { date: "2026-11-17", planned: 0, done: 0 }, // Tuesday
    ];

    expect(describeCompletionDays(days)).toBe("Pazartesi 2/3, Salı planlı gün yok");
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

    expect(describeCompletionDays(days)).toBe("Son 30 gün, 18 planlı günden 14'ü tamamlandı");
  });

  it("follows the tens word for the suffix of round counts", () => {
    const doneOnly = (done: number) =>
      Array.from({ length: 30 }, (_, index) => ({
        date: addDays("2026-10-20", index),
        planned: index < done ? 1 : 0,
        done: index < done ? 1 : 0,
      }));

    expect(describeCompletionDays(doneOnly(10))).toContain("10'u tamamlandı");
    expect(describeCompletionDays(doneOnly(20))).toContain("20'si tamamlandı");
  });
});
