import type { ActivityLevel, Gender, GoalType, NutritionResult } from '@/types';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

/** Calorie adjustment applied to TDEE per goal (kcal/day). */
const GOAL_ADJUSTMENT: Record<GoalType, number> = {
  lose: -500,
  maintain: 0,
  gain: 350,
};

export function calcBMI(weightKg: number, heightCm: number): number {
  const meters = heightCm / 100;
  if (meters <= 0) return 0;
  return round1(weightKg / (meters * meters));
}

export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Healthy';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/** Mifflin–St Jeor basal metabolic rate. */
export function calcBMR(weightKg: number, heightCm: number, age: number, gender: Gender): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender === 'male' ? base + 5 : base - 161);
}

export function calcTDEE(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activity]);
}

/**
 * Full calculator output: BMI, BMR, TDEE, goal-adjusted calories and a
 * 30/40/30 protein/carbs/fat macro split (protein-forward for satiety).
 */
export function calcNutrition(input: {
  age: number;
  heightCm: number;
  weightKg: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: GoalType;
}): NutritionResult {
  const bmi = calcBMI(input.weightKg, input.heightCm);
  const bmr = calcBMR(input.weightKg, input.heightCm, input.age, input.gender);
  const tdee = calcTDEE(bmr, input.activityLevel);
  const targetCalories = Math.max(1200, tdee + GOAL_ADJUSTMENT[input.goal]);

  return {
    bmi,
    bmiCategory: bmiCategory(bmi),
    bmr,
    tdee,
    targetCalories,
    protein: Math.round((targetCalories * 0.3) / 4), // 4 kcal per gram
    carbs: Math.round((targetCalories * 0.4) / 4),
    fat: Math.round((targetCalories * 0.3) / 9), // 9 kcal per gram
  };
}

export function kgToLb(kg: number): number {
  return round1(kg * 2.20462);
}

export function cmToFtIn(cm: number): string {
  const totalIn = cm / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inch = Math.round(totalIn % 12);
  return `${ft}'${inch}"`;
}

/** Format weight respecting the user's unit preference. */
export function formatWeight(kg: number, units: 'metric' | 'imperial'): string {
  return units === 'metric' ? `${round1(kg)} kg` : `${kgToLb(kg)} lb`;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Clamp a ratio to [0, 1] for progress bars/rings. */
export function clampRatio(value: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(1, Math.max(0, value / target));
}
