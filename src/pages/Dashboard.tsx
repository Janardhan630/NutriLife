import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Beef, Droplets, Flame, Scale, Target, TrendingUp, Wheat } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import StatCard from '@/components/StatCard';
import ProgressRing from '@/components/ProgressRing';
import NutritionBar from '@/components/NutritionBar';
import WeeklyBars from '@/components/charts/WeeklyBars';
import { useChartTheme } from '@/components/charts/chartTheme';
import { useApp } from '@/context/AppContext';
import { calcBMI, bmiCategory, clampRatio, formatWeight } from '@/utils/calculations';
import { fromDateKey, lastNDays, todayKey } from '@/utils/date';

export default function Dashboard() {
  const { profile, totalsForDate, water, weights, streak } = useApp();
  const { colors } = useChartTheme();

  const today = todayKey();
  const totals = totalsForDate(today);
  const waterToday = water[today] ?? 0;
  const bmi = calcBMI(profile.weightKg, profile.heightCm);

  // Weight-goal progress: distance covered from the starting (earliest) weight
  const startWeight = weights[0]?.weightKg ?? profile.weightKg;
  const currentWeight = weights[weights.length - 1]?.weightKg ?? profile.weightKg;
  const goalSpan = Math.abs(startWeight - profile.goalWeightKg);
  const goalDone = Math.abs(startWeight - currentWeight);
  const goalProgress = goalSpan > 0 ? Math.min(1, goalDone / goalSpan) : 1;

  // Macro targets derived from the calorie goal (30/40/30 split)
  const targets = useMemo(
    () => ({
      protein: Math.round((profile.calorieGoal * 0.3) / 4),
      carbs: Math.round((profile.calorieGoal * 0.4) / 4),
      fat: Math.round((profile.calorieGoal * 0.3) / 9),
    }),
    [profile.calorieGoal],
  );

  // Last 7 days of calories for the weekly summary chart
  const weeklyData = useMemo(
    () =>
      lastNDays(7).map((key) => ({
        label: fromDateKey(key).toLocaleDateString(undefined, { weekday: 'short' }),
        value: totalsForDate(key).calories,
      })),
    [totalsForDate],
  );

  const calorieRatio = clampRatio(totals.calories, profile.calorieGoal);

  return (
    <PageTransition>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold">
            Hello, {profile.name.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Here's your nutrition snapshot for today.
          </p>
        </motion.div>

        {/* Hero calories card + macro bars */}
        <div className="grid gap-5 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card flex flex-col items-center justify-center gap-4 p-6 sm:flex-row sm:gap-8"
          >
            <ProgressRing
              progress={calorieRatio}
              size={150}
              strokeWidth={12}
              color={colors.calories}
              label={
                <span className="text-center">
                  <span className="text-numeric block text-3xl font-bold">{totals.calories}</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    of {profile.calorieGoal} kcal
                  </span>
                </span>
              }
            />
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Calories today
              </p>
              <p className="text-numeric mt-1 text-2xl font-bold">
                {Math.max(0, profile.calorieGoal - totals.calories)} kcal left
              </p>
              <Link to="/meal-tracker" className="btn-primary mt-4 inline-flex">
                Log a meal
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="card space-y-4 p-6 lg:col-span-2"
          >
            <h3 className="text-sm font-semibold">Macros today</h3>
            <NutritionBar label="Protein" value={totals.protein} target={targets.protein} color={colors.protein} />
            <NutritionBar label="Carbs" value={totals.carbs} target={targets.carbs} color={colors.carbs} />
            <NutritionBar label="Fat" value={totals.fat} target={targets.fat} color={colors.fat} />
          </motion.div>
        </div>

        {/* Stat grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            index={0}
            icon={<Droplets size={22} />}
            tone="bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
            label="Water intake"
            value={`${waterToday} / ${profile.waterGoal}`}
            sublabel="glasses today"
          />
          <StatCard
            index={1}
            icon={<Scale size={22} />}
            tone="bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
            label="BMI"
            value={bmi.toFixed(1)}
            sublabel={bmiCategory(bmi)}
          />
          <StatCard
            index={2}
            icon={<Target size={22} />}
            tone="bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400"
            label="Goal progress"
            value={`${Math.round(goalProgress * 100)}%`}
            sublabel={`${formatWeight(currentWeight, profile.units)} → ${formatWeight(profile.goalWeightKg, profile.units)}`}
          />
          <StatCard
            index={3}
            icon={<Flame size={22} />}
            tone="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
            label="Daily streak"
            value={`${streak}`}
            sublabel={streak === 1 ? 'day active' : 'days active'}
          />
        </div>

        {/* Weekly summary + quick nutrition facts */}
        <div className="grid gap-5 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card p-6 lg:col-span-2"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Calories — last 7 days</h3>
              <Link
                to="/progress"
                className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                <TrendingUp size={13} aria-hidden="true" /> Full progress
              </Link>
            </div>
            <WeeklyBars
              data={weeklyData}
              color={colors.calories}
              name="Calories"
              unit="kcal"
              target={profile.calorieGoal}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card space-y-4 p-6"
          >
            <h3 className="text-sm font-semibold">Today at a glance</h3>
            {[
              { icon: Beef, label: 'Protein', value: `${Math.round(totals.protein)} g`, hint: `${targets.protein} g goal` },
              { icon: Wheat, label: 'Carbs', value: `${Math.round(totals.carbs)} g`, hint: `${targets.carbs} g goal` },
              { icon: Flame, label: 'Fat', value: `${Math.round(totals.fat)} g`, hint: `${targets.fat} g goal` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                  <row.icon size={16} className="text-primary-500" aria-hidden="true" />
                  {row.label}
                </span>
                <span>
                  <strong className="text-numeric">{row.value}</strong>{' '}
                  <span className="text-xs text-gray-400 dark:text-slate-500">/ {row.hint}</span>
                </span>
              </div>
            ))}
            <Link to="/water" className="btn-ghost mt-2 w-full">
              <Droplets size={16} aria-hidden="true" /> Log water
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
