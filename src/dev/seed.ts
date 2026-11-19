// DEV ONLY: yayından önce silinecek (src/dev/ klasörü + src/app/_layout.tsx'teki çağrı).
import {
  addDays,
  type Completion,
  type Habit,
  useHabitStore,
  type Weekday,
} from "@/features/habits";

const SEED_HISTORY_DAYS = 30;
const EVERY_DAY: Weekday[] = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5];
const WEEKEND: Weekday[] = [6, 0];
const MON_WED_FRI: Weekday[] = [1, 3, 5];

type SeedHabit = {
  habit: Omit<Habit, "createdAt">;
  streakDays: number; // consecutive days before today that are marked done
  doneToday: boolean;
};

const SAMPLE_HABITS: SeedHabit[] = [
  {
    habit: {
      id: "seed-water",
      name: "Su iç",
      icon: "water-outline",
      repeatDays: EVERY_DAY,
      reminderTime: "08:00",
    },
    streakDays: 12,
    doneToday: false,
  },
  {
    habit: {
      id: "seed-book",
      name: "Kitap oku",
      icon: "book-outline",
      repeatDays: EVERY_DAY,
      reminderTime: "21:30",
    },
    streakDays: 5,
    doneToday: false,
  },
  {
    habit: {
      id: "seed-walk",
      name: "Yürüyüş",
      icon: "walk-outline",
      repeatDays: EVERY_DAY,
      reminderTime: "07:30",
    },
    streakDays: 21,
    doneToday: true,
  },
  {
    habit: {
      id: "seed-meditate",
      name: "Meditasyon",
      icon: "leaf-outline",
      repeatDays: WEEKDAYS,
      reminderTime: "13:00",
    },
    streakDays: 3,
    doneToday: false,
  },
  {
    habit: {
      id: "seed-english",
      name: "İngilizce çalış",
      icon: "chatbubble-outline",
      repeatDays: MON_WED_FRI,
      reminderTime: "19:00",
    },
    streakDays: 8,
    doneToday: false,
  },
  {
    habit: {
      id: "seed-journal",
      name: "Günlük yaz",
      icon: "create-outline",
      repeatDays: WEEKEND,
    },
    streakDays: 0,
    doneToday: false,
  },
];

function buildSample(today: string): { habits: Habit[]; completions: Completion[] } {
  const createdAt = addDays(today, -SEED_HISTORY_DAYS);
  const habits = SAMPLE_HABITS.map(({ habit }) => ({ ...habit, createdAt }));

  const completions = SAMPLE_HABITS.flatMap(({ habit, streakDays, doneToday }) => {
    const days = Array.from({ length: streakDays }, (_, index) =>
      addDays(today, -(index + 1)),
    );
    if (doneToday) days.push(today);
    return days.map((date) => ({ habitId: habit.id, date }));
  });

  return { habits, completions };
}

// Returns true once the store has hydrated and the seed decision has been made.
function seedIfEmpty(today: string): boolean {
  const { hydrated, habits } = useHabitStore.getState();
  if (!hydrated) return false;

  if (habits.length === 0) useHabitStore.setState(buildSample(today));
  return true;
}

export function seedWhenHydrated(today: string): () => void {
  if (!__DEV__ || seedIfEmpty(today)) return () => {};

  const unsubscribe = useHabitStore.subscribe(() => {
    if (seedIfEmpty(today)) unsubscribe();
  });
  return unsubscribe;
}
