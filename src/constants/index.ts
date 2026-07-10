import type {
  ActivityLevel,
  GoalType,
  MealType,
  RecipeCategory,
  UserProfile,
} from '@/types';

/** Prefix for every localStorage key so the app never collides with other apps. */
export const STORAGE_PREFIX = 'nutrilife:';

export const APP_NAME = 'NutriLife';

/** ml of water per glass. */
export const GLASS_ML = 250;

export const RECIPES_PER_PAGE = 9;

export const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'light', label: 'Lightly active', description: 'Exercise 1–3 days/week' },
  { value: 'moderate', label: 'Moderately active', description: 'Exercise 3–5 days/week' },
  { value: 'active', label: 'Very active', description: 'Exercise 6–7 days/week' },
  { value: 'veryActive', label: 'Extra active', description: 'Hard exercise & physical job' },
];

export const GOALS: { value: GoalType; label: string; emoji: string }[] = [
  { value: 'lose', label: 'Lose weight', emoji: '📉' },
  { value: 'maintain', label: 'Maintain weight', emoji: '⚖️' },
  { value: 'gain', label: 'Gain muscle', emoji: '💪' },
];

export const MEAL_TYPES: { value: MealType; label: string; emoji: string }[] = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snacks', label: 'Snacks', emoji: '🍎' },
];

export const RECIPE_CATEGORIES: RecipeCategory[] = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Vegan',
  'Keto',
  'High Protein',
  'Low Carb',
  'Mediterranean',
];

export const DIET_PREFERENCES = [
  'No preference',
  'Vegetarian',
  'Vegan',
  'Keto',
  'Mediterranean',
  'High Protein',
  'Low Carb',
];

export const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Hindi'];

/**
 * Chart series colors, validated for colorblind separation and surface
 * contrast on both themes (dataviz six-checks validator).
 * Macro trio is used together in one chart; water/weight are single-series.
 */
export const CHART_COLORS = {
  light: {
    protein: '#22C55E',
    carbs: '#F59E0B',
    fat: '#8B5CF6',
    water: '#3B82F6',
    weight: '#22C55E',
    calories: '#F59E0B',
    grid: '#E5E7EB',
    text: '#6B7280',
    surface: '#FFFFFF',
  },
  dark: {
    protein: '#16A34A',
    carbs: '#D97706',
    fat: '#8B5CF6',
    water: '#3B82F6',
    weight: '#22C55E',
    calories: '#F59E0B',
    grid: '#334155',
    text: '#94A3B8',
    surface: '#1E293B',
  },
} as const;

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  avatar: '🧑‍🍳',
  age: 28,
  gender: 'female',
  heightCm: 168,
  weightKg: 68,
  goalWeightKg: 62,
  activityLevel: 'moderate',
  goal: 'lose',
  dietPreference: 'Mediterranean',
  units: 'metric',
  language: 'English',
  notifications: true,
  waterGoal: 8,
  calorieGoal: 1900,
};
