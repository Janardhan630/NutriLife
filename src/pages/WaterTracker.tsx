import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Droplets, Minus, Plus } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ProgressRing from '@/components/ProgressRing';
import WeeklyBars from '@/components/charts/WeeklyBars';
import { useChartTheme } from '@/components/charts/chartTheme';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { GLASS_ML } from '@/constants';
import { clampRatio } from '@/utils/calculations';
import { fromDateKey, lastNDays, todayKey } from '@/utils/date';
import { cn } from '@/utils/cn';

const HYDRATION_TIPS = [
  'Start every morning with a full glass of water.',
  'Keep a bottle on your desk — visibility drives sips.',
  'Drink a glass before each meal to aid digestion.',
  'Herbal tea and sparkling water count too!',
];

export default function WaterTracker() {
  const { profile, water, addWater, updateProfile } = useApp();
  const { addToast } = useToast();
  const { colors } = useChartTheme();

  const today = todayKey();
  const glasses = water[today] ?? 0;
  const goal = profile.waterGoal;
  const ratio = clampRatio(glasses, goal);

  const weekData = useMemo(
    () =>
      lastNDays(7).map((key) => ({
        label: fromDateKey(key).toLocaleDateString(undefined, { weekday: 'short' }),
        value: water[key] ?? 0,
      })),
    [water],
  );

  function drink(amount: number) {
    addWater(today, amount);
    if (amount > 0 && glasses + amount === goal) {
      addToast('Hydration goal reached — great job! 💧');
    }
  }

  function toggleReminders() {
    updateProfile({ notifications: !profile.notifications });
    addToast(
      profile.notifications
        ? 'Hydration reminders turned off.'
        : 'Hydration reminders on — we’ll nudge you to sip regularly.',
      'info',
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Water Tracker</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Stay hydrated — aim for {goal} glasses ({(goal * GLASS_ML) / 1000} L) a day.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Main tracker */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card flex flex-col items-center gap-6 p-8"
            aria-labelledby="water-today"
          >
            <h3 id="water-today" className="text-sm font-semibold">
              Today's hydration
            </h3>

            <ProgressRing
              progress={ratio}
              size={200}
              strokeWidth={14}
              color={colors.water}
              label={
                <span className="text-center">
                  <motion.span
                    key={glasses}
                    initial={{ scale: 1.25, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-numeric block text-5xl font-bold text-sky-500"
                  >
                    {glasses}
                  </motion.span>
                  <span className="text-sm text-gray-500 dark:text-slate-400">of {goal} glasses</span>
                  <span className="text-numeric block text-xs text-gray-400 dark:text-slate-500">
                    {glasses * GLASS_ML} ml
                  </span>
                </span>
              }
            />

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => drink(-1)}
                disabled={glasses === 0}
                aria-label="Remove one glass"
                className="btn-ghost !h-12 !w-12 !rounded-full !p-0"
              >
                <Minus size={18} />
              </button>
              <button
                type="button"
                onClick={() => drink(1)}
                aria-label="Add one glass"
                className="btn-primary !h-16 !w-16 !rounded-full !p-0 !text-white"
              >
                <Plus size={26} />
              </button>
              <button
                type="button"
                onClick={() => drink(2)}
                aria-label="Add two glasses"
                className="btn-ghost !h-12 !rounded-full"
              >
                +2
              </button>
            </div>

            {/* Glass row visual */}
            <div className="flex flex-wrap justify-center gap-1.5" aria-hidden="true">
              {Array.from({ length: goal }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={false}
                  animate={{ scale: i < glasses ? 1 : 0.85, opacity: i < glasses ? 1 : 0.35 }}
                  className="text-2xl"
                >
                  🥤
                </motion.span>
              ))}
            </div>
          </motion.section>

          <div className="space-y-6">
            {/* Weekly chart */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="card p-6"
              aria-labelledby="water-week"
            >
              <h3 id="water-week" className="mb-4 text-sm font-semibold">
                Glasses — last 7 days
              </h3>
              <WeeklyBars data={weekData} color={colors.water} name="Water" unit="glasses" target={goal} height={210} />
            </motion.section>

            {/* Reminders + tips */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="card p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Droplets size={16} className="text-sky-500" aria-hidden="true" />
                  Hydration reminders
                </h3>
                <button
                  type="button"
                  onClick={toggleReminders}
                  aria-pressed={profile.notifications}
                  className={cn(
                    'btn !py-2 text-xs',
                    profile.notifications
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400',
                  )}
                >
                  {profile.notifications ? <Bell size={14} /> : <BellOff size={14} />}
                  {profile.notifications ? 'On' : 'Off'}
                </button>
              </div>
              <ul className="space-y-2.5">
                {HYDRATION_TIPS.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
