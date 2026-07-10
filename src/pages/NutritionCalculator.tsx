import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Activity, Calculator, Flame, HeartPulse, Save, Scale } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import MacroDonut from '@/components/charts/MacroDonut';
import WeeklyBars from '@/components/charts/WeeklyBars';
import { useChartTheme } from '@/components/charts/chartTheme';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { ACTIVITY_LEVELS, GOALS } from '@/constants';
import { calcNutrition } from '@/utils/calculations';
import { cn } from '@/utils/cn';
import type { NutritionResult } from '@/types';

const calculatorSchema = z.object({
  age: z.coerce.number().min(10, 'Age must be 10–100').max(100, 'Age must be 10–100'),
  heightCm: z.coerce.number().min(100, 'Height must be 100–250 cm').max(250, 'Height must be 100–250 cm'),
  weightKg: z.coerce.number().min(30, 'Weight must be 30–300 kg').max(300, 'Weight must be 30–300 kg'),
  gender: z.enum(['male', 'female']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive']),
  goal: z.enum(['lose', 'maintain', 'gain']),
});

type CalculatorForm = z.infer<typeof calculatorSchema>;

const BMI_TONES: Record<string, string> = {
  Underweight: 'text-sky-600 dark:text-sky-400',
  Healthy: 'text-primary-600 dark:text-primary-400',
  Overweight: 'text-accent dark:text-accent-dark',
  Obese: 'text-danger',
};

export default function NutritionCalculator() {
  const { profile, updateProfile } = useApp();
  const { addToast } = useToast();
  const { colors } = useChartTheme();
  const [result, setResult] = useState<NutritionResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CalculatorForm>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      age: profile.age,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      gender: profile.gender,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
    },
  });

  const onSubmit = handleSubmit((data) => {
    setResult(calcNutrition(data));
  });

  function saveAsGoal() {
    if (!result) return;
    updateProfile({ calorieGoal: result.targetCalories });
    addToast(`Daily calorie goal updated to ${result.targetCalories} kcal.`);
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Nutrition Calculator</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Estimate your BMI, BMR, TDEE and a personalized calorie & macro target.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Input form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={onSubmit}
            noValidate
            className="card space-y-4 p-6 lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="calc-age" className="label">
                  Age
                </label>
                <input id="calc-age" type="number" className="input text-numeric" {...register('age')} />
                {errors.age && <p className="mt-1 text-xs text-danger">{errors.age.message}</p>}
              </div>
              <div>
                <label htmlFor="calc-gender" className="label">
                  Gender
                </label>
                <select id="calc-gender" className="input" {...register('gender')}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
              <div>
                <label htmlFor="calc-height" className="label">
                  Height (cm)
                </label>
                <input id="calc-height" type="number" className="input text-numeric" {...register('heightCm')} />
                {errors.heightCm && <p className="mt-1 text-xs text-danger">{errors.heightCm.message}</p>}
              </div>
              <div>
                <label htmlFor="calc-weight" className="label">
                  Weight (kg)
                </label>
                <input id="calc-weight" type="number" step="0.1" className="input text-numeric" {...register('weightKg')} />
                {errors.weightKg && <p className="mt-1 text-xs text-danger">{errors.weightKg.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="calc-activity" className="label">
                Activity level
              </label>
              <select id="calc-activity" className="input" {...register('activityLevel')}>
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} — {level.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="label">Goal</span>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Goal">
                {GOALS.map((goal) => (
                  <label
                    key={goal.value}
                    className="flex cursor-pointer flex-col items-center gap-1 rounded-2xl border border-gray-200 p-3 text-center text-xs font-medium transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 dark:border-slate-700 dark:has-[:checked]:bg-primary-500/10"
                  >
                    <input type="radio" value={goal.value} className="sr-only" {...register('goal')} />
                    <span className="text-xl" aria-hidden="true">
                      {goal.emoji}
                    </span>
                    {goal.label}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              <Calculator size={16} aria-hidden="true" /> Calculate
            </button>
          </motion.form>

          {/* Results */}
          <div className="lg:col-span-3">
            {!result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card flex h-full min-h-72 flex-col items-center justify-center gap-3 p-8 text-center"
              >
                <span className="text-5xl" aria-hidden="true">
                  🧮
                </span>
                <h3 className="font-semibold">Your results appear here</h3>
                <p className="max-w-xs text-sm text-gray-500 dark:text-slate-400">
                  Fill in your details and hit Calculate to see your BMI, daily energy needs and a
                  personalized macro plan.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={JSON.stringify(result)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Result stat tiles */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    {
                      icon: Scale,
                      label: 'BMI',
                      value: result.bmi.toFixed(1),
                      hint: result.bmiCategory,
                      tone: BMI_TONES[result.bmiCategory],
                    },
                    { icon: HeartPulse, label: 'BMR', value: `${result.bmr}`, hint: 'kcal at rest' },
                    { icon: Activity, label: 'TDEE', value: `${result.tdee}`, hint: 'kcal burned/day' },
                    {
                      icon: Flame,
                      label: 'Target',
                      value: `${result.targetCalories}`,
                      hint: 'kcal to eat/day',
                      tone: 'text-primary-600 dark:text-primary-400',
                    },
                  ].map((tile, i) => (
                    <motion.div
                      key={tile.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="card p-4 text-center"
                    >
                      <tile.icon size={18} className="mx-auto mb-1.5 text-primary-500" aria-hidden="true" />
                      <p className="text-xs text-gray-500 dark:text-slate-400">{tile.label}</p>
                      <p className={cn('text-numeric text-xl font-bold', tile.tone)}>{tile.value}</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">{tile.hint}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Macro donut */}
                <div className="card p-6">
                  <h3 className="mb-4 text-sm font-semibold">Recommended daily macros</h3>
                  <MacroDonut
                    protein={result.protein}
                    carbs={result.carbs}
                    fat={result.fat}
                    centerLabel={{ value: `${result.targetCalories}`, caption: 'kcal/day' }}
                  />
                </div>

                {/* Energy comparison */}
                <div className="card p-6">
                  <h3 className="mb-4 text-sm font-semibold">Your energy numbers (kcal/day)</h3>
                  <WeeklyBars
                    data={[
                      { label: 'BMR', value: result.bmr },
                      { label: 'TDEE', value: result.tdee },
                      { label: 'Target', value: result.targetCalories },
                    ]}
                    color={colors.calories}
                    name="Energy"
                    unit="kcal"
                    height={200}
                  />
                </div>

                <button type="button" onClick={saveAsGoal} className="btn-primary w-full">
                  <Save size={16} aria-hidden="true" /> Set {result.targetCalories} kcal as my daily goal
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
