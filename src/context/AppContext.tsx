import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { DEFAULT_PROFILE } from '@/constants';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { addDays, lastNDays, todayKey } from '@/utils/date';
import type { LoggedMeal, NutritionInfo, UserProfile, WeightEntry } from '@/types';

/**
 * Global application state — profile, logged meals, water, weight history
 * and favorite recipes. Everything persists to localStorage so the app is
 * fully usable offline; a future backend can sync the same shapes.
 */
interface AppContextValue {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;

  meals: LoggedMeal[];
  addMeal: (meal: Omit<LoggedMeal, 'id'>) => void;
  updateMeal: (id: string, patch: Partial<Omit<LoggedMeal, 'id'>>) => void;
  deleteMeal: (id: string) => void;
  mealsForDate: (date: string) => LoggedMeal[];
  totalsForDate: (date: string) => NutritionInfo;

  water: Record<string, number>;
  addWater: (date: string, glasses: number) => void;

  weights: WeightEntry[];
  addWeight: (entry: WeightEntry) => void;

  favorites: string[];
  toggleFavorite: (recipeId: string) => void;

  streak: number;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

let idCounter = 0;
function newId(): string {
  idCounter += 1;
  return `${Date.now().toString(36)}-${idCounter}`;
}

/** Seed data so a first-time visitor sees a living dashboard, not an empty shell. */
function seedWeights(startKg: number): WeightEntry[] {
  const entries: WeightEntry[] = [];
  const today = todayKey();
  // ~10 weeks of gently declining weight, one entry per week
  for (let week = 9; week >= 0; week--) {
    const wobble = Math.sin(week * 1.7) * 0.4;
    entries.push({
      date: addDays(today, -week * 7),
      weightKg: Math.round((startKg + week * 0.45 + wobble) * 10) / 10,
    });
  }
  return entries;
}

function seedMeals(): LoggedMeal[] {
  const today = todayKey();
  return [
    {
      id: newId(),
      date: today,
      type: 'breakfast',
      name: 'Greek Yogurt Protein Parfait',
      recipeId: 'greek-yogurt-parfait',
      calories: 280,
      protein: 22,
      carbs: 32,
      fat: 7,
    },
    {
      id: newId(),
      date: today,
      type: 'lunch',
      name: 'Rainbow Quinoa Buddha Bowl',
      recipeId: 'quinoa-buddha-bowl',
      calories: 520,
      protein: 18,
      carbs: 62,
      fat: 22,
    },
  ];
}

function seedWater(): Record<string, number> {
  const water: Record<string, number> = {};
  for (const key of lastNDays(14)) {
    water[key] = 4 + Math.floor(Math.random() * 5);
  }
  water[todayKey()] = 3;
  return water;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<UserProfile>('profile', DEFAULT_PROFILE);
  const [meals, setMeals] = useLocalStorage<LoggedMeal[]>('meals', seedMeals);
  const [water, setWater] = useLocalStorage<Record<string, number>>('water', seedWater);
  const [weights, setWeights] = useLocalStorage<WeightEntry[]>('weights', () =>
    seedWeights(DEFAULT_PROFILE.weightKg),
  );
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [
    'quinoa-buddha-bowl',
    'salmon-teriyaki-bowl',
  ]);

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => setProfile((p) => ({ ...p, ...patch })),
    [setProfile],
  );

  const addMeal = useCallback(
    (meal: Omit<LoggedMeal, 'id'>) => setMeals((prev) => [...prev, { ...meal, id: newId() }]),
    [setMeals],
  );

  const updateMeal = useCallback(
    (id: string, patch: Partial<Omit<LoggedMeal, 'id'>>) =>
      setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m))),
    [setMeals],
  );

  const deleteMeal = useCallback(
    (id: string) => setMeals((prev) => prev.filter((m) => m.id !== id)),
    [setMeals],
  );

  const mealsForDate = useCallback(
    (date: string) => meals.filter((m) => m.date === date),
    [meals],
  );

  const totalsForDate = useCallback(
    (date: string): NutritionInfo =>
      meals
        .filter((m) => m.date === date)
        .reduce(
          (acc, m) => ({
            calories: acc.calories + m.calories,
            protein: acc.protein + m.protein,
            carbs: acc.carbs + m.carbs,
            fat: acc.fat + m.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 },
        ),
    [meals],
  );

  const addWater = useCallback(
    (date: string, glasses: number) =>
      setWater((prev) => ({ ...prev, [date]: Math.max(0, (prev[date] ?? 0) + glasses) })),
    [setWater],
  );

  const addWeight = useCallback(
    (entry: WeightEntry) =>
      setWeights((prev) => {
        // One entry per day — replace if the date already exists
        const rest = prev.filter((w) => w.date !== entry.date);
        return [...rest, entry].sort((a, b) => a.date.localeCompare(b.date));
      }),
    [setWeights],
  );

  const toggleFavorite = useCallback(
    (recipeId: string) =>
      setFavorites((prev) =>
        prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId],
      ),
    [setFavorites],
  );

  /** Consecutive days (ending today) with at least one logged meal or water. */
  const streak = useMemo(() => {
    const activeDates = new Set<string>(meals.map((m) => m.date));
    for (const [date, glasses] of Object.entries(water)) {
      if (glasses > 0) activeDates.add(date);
    }
    let count = 0;
    let cursor = todayKey();
    while (activeDates.has(cursor)) {
      count += 1;
      cursor = addDays(cursor, -1);
    }
    return count;
  }, [meals, water]);

  const resetAllData = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    setMeals([]);
    setWater({});
    setWeights([]);
    setFavorites([]);
  }, [setProfile, setMeals, setWater, setWeights, setFavorites]);

  const value = useMemo<AppContextValue>(
    () => ({
      profile,
      updateProfile,
      meals,
      addMeal,
      updateMeal,
      deleteMeal,
      mealsForDate,
      totalsForDate,
      water,
      addWater,
      weights,
      addWeight,
      favorites,
      toggleFavorite,
      streak,
      resetAllData,
    }),
    [
      profile,
      updateProfile,
      meals,
      addMeal,
      updateMeal,
      deleteMeal,
      mealsForDate,
      totalsForDate,
      water,
      addWater,
      weights,
      addWeight,
      favorites,
      toggleFavorite,
      streak,
      resetAllData,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
