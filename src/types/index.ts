/**
 * Shared domain types for NutriLife.
 * These mirror the shape a future backend API is expected to return,
 * so swapping mock services for real endpoints requires no UI changes.
 */

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type RecipeCategory =
  | 'Breakfast'
  | 'Lunch'
  | 'Dinner'
  | 'Snacks'
  | 'Vegan'
  | 'Keto'
  | 'High Protein'
  | 'Low Carb'
  | 'Mediterranean';

/** Macro + calorie breakdown, grams for macros, kcal for calories. */
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  /** Emoji used as the recipe illustration (keeps the app fully offline). */
  emoji: string;
  /** Tailwind gradient classes for the card header tile. */
  gradient: string;
  categories: RecipeCategory[];
  nutrition: NutritionInfo;
  /** Total cooking time in minutes. */
  cookTime: number;
  difficulty: Difficulty;
  servings: number;
  rating: number;
  ingredients: string[];
  instructions: string[];
}

export interface DietPlanMeal {
  name: string;
  items: string[];
}

export interface DietPlan {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  gradient: string;
  /** Daily calorie target for the plan. */
  calories: number;
  /** Recommended duration, e.g. "8 weeks". */
  duration: string;
  /** Macro split in percent — should sum to 100. */
  macros: { protein: number; carbs: number; fat: number };
  meals: DietPlanMeal[];
  benefits: string[];
  avoid: string[];
}

/** A meal the user logged in the tracker. Date is a `yyyy-MM-dd` key. */
export interface LoggedMeal extends NutritionInfo {
  id: string;
  date: string;
  type: MealType;
  name: string;
  /** Set when the meal was added from a recipe. */
  recipeId?: string;
}

export type Gender = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export type GoalType = 'lose' | 'maintain' | 'gain';

export type Units = 'metric' | 'imperial';

export interface UserProfile {
  name: string;
  email: string;
  /** Emoji avatar. */
  avatar: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goalWeightKg: number;
  activityLevel: ActivityLevel;
  goal: GoalType;
  dietPreference: string;
  units: Units;
  language: string;
  notifications: boolean;
  /** Daily water goal in glasses (1 glass = 250 ml). */
  waterGoal: number;
  /** Daily calorie target in kcal. */
  calorieGoal: number;
}

export interface WeightEntry {
  /** `yyyy-MM-dd` */
  date: string;
  weightKg: number;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

/** Result of the nutrition calculator. */
export interface NutritionResult {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}
