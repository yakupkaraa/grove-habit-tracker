import { validateHabitInput } from "../habit-input";

describe("validateHabitInput", () => {
  it("returns no errors for a valid name and at least one day", () => {
    expect(validateHabitInput({ name: "Su iç", repeatDays: [1] })).toEqual({});
  });

  it("returns the name error when the name is empty", () => {
    expect(validateHabitInput({ name: "", repeatDays: [1] })).toEqual({
      name: "Bir ad girin",
    });
  });

  it("returns the name error when the name is only whitespace", () => {
    expect(validateHabitInput({ name: "   ", repeatDays: [1] })).toEqual({
      name: "Bir ad girin",
    });
  });

  it("returns the days error when no day is selected", () => {
    expect(validateHabitInput({ name: "Su iç", repeatDays: [] })).toEqual({
      days: "En az bir gün seçin",
    });
  });

  it("returns both errors when both are invalid", () => {
    expect(validateHabitInput({ name: "", repeatDays: [] })).toEqual({
      name: "Bir ad girin",
      days: "En az bir gün seçin",
    });
  });

  it("accepts a valid name with surrounding whitespace", () => {
    expect(validateHabitInput({ name: "  Su iç  ", repeatDays: [1] })).toEqual({});
  });
});
