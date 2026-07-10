import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Download, Plus } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import Modal from '@/components/Modal';
import TrendChart, { type TrendPoint } from '@/components/charts/TrendChart';
import { useChartTheme } from '@/components/charts/chartTheme';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { calcBMI } from '@/utils/calculations';
import { downloadJson } from '@/utils/storage';
import { lastNDays, shortLabel, todayKey } from '@/utils/date';
import { cn } from '@/utils/cn';

type Range = 'weekly' | 'monthly' | 'yearly';

const RANGES: { value: Range; label: string; days: number }[] = [
  { value: 'weekly', label: 'Weekly', days: 7 },
  { value: 'monthly', label: 'Monthly', days: 30 },
  { value: 'yearly', label: 'Yearly', days: 365 },
];

const weightSchema = z.object({
  weightKg: z.coerce.number().min(30, 'Weight must be 30–300 kg').max(300, 'Weight must be 30–300 kg'),
});

type WeightForm = z.infer<typeof weightSchema>;

export default function ProgressPage() {
  const { profile, meals, water, weights, addWeight, totalsForDate, updateProfile } = useApp();
  const { colors } = useChartTheme();
  const { addToast } = useToast();
  const [range, setRange] = useState<Range>('monthly');
  const [weightModalOpen, setWeightModalOpen] = useState(false);

  const days = RANGES.find((r) => r.value === range)?.days ?? 30;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WeightForm>({
    resolver: zodResolver(weightSchema),
    defaultValues: { weightKg: profile.weightKg },
  });

  /** Weight entries inside the selected range, as chart points. */
  const weightData: TrendPoint[] = useMemo(() => {
    const cutoff = lastNDays(days)[0];
    return weights
      .filter((w) => w.date >= cutoff)
      .map((w) => ({ label: shortLabel(w.date), value: w.weightKg }));
  }, [weights, days]);

  /** BMI trend derived from the weight history. */
  const bmiData: TrendPoint[] = useMemo(
    () =>
      weightData.map((point) => ({
        label: point.label,
        value: calcBMI(point.value, profile.heightCm),
      })),
    [weightData, profile.heightCm],
  );

  /**
   * Daily series for calories/protein/water. Long ranges only show days
   * with data so the chart stays readable.
   */
  const dailySeries = useMemo(() => {
    const keys = lastNDays(Math.min(days, 90));
    const calories: TrendPoint[] = [];
    const protein: TrendPoint[] = [];
    const hydration: TrendPoint[] = [];
    for (const key of keys) {
      const totals = totalsForDate(key);
      const glasses = water[key] ?? 0;
      if (days > 7 && totals.calories === 0 && glasses === 0) continue;
      const label = shortLabel(key);
      calories.push({ label, value: totals.calories });
      protein.push({ label, value: totals.protein });
      hydration.push({ label, value: glasses });
    }
    return { calories, protein, hydration };
  }, [days, totalsForDate, water]);

  const onLogWeight = handleSubmit((data) => {
    addWeight({ date: todayKey(), weightKg: data.weightKg });
    updateProfile({ weightKg: data.weightKg });
    setWeightModalOpen(false);
    addToast(`Weight logged: ${data.weightKg} kg.`);
  });

  function exportProgress() {
    downloadJson(`nutrilife-progress-${todayKey()}.json`, {
      exportedAt: new Date().toISOString(),
      profile,
      weights,
      meals,
      water,
    });
    addToast('Progress exported as JSON.', 'info');
  }

  type ChartDomain = [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax'];
  const fromDataMin: ChartDomain = ['dataMin', 'auto'];
  const charts: {
    title: string;
    data: TrendPoint[];
    color: string;
    unit: string;
    name: string;
    domain?: ChartDomain;
  }[] = [
    { title: 'Weight (kg)', data: weightData, color: colors.weight, unit: 'kg', name: 'Weight', domain: fromDataMin },
    { title: 'Calories (kcal/day)', data: dailySeries.calories, color: colors.calories, unit: 'kcal', name: 'Calories' },
    { title: 'Protein (g/day)', data: dailySeries.protein, color: colors.protein, unit: 'g', name: 'Protein' },
    { title: 'Water (glasses/day)', data: dailySeries.hydration, color: colors.water, unit: 'glasses', name: 'Water' },
    { title: 'BMI', data: bmiData, color: colors.fat, unit: '', name: 'BMI', domain: fromDataMin },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Progress</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Your journey over time — weight, energy, protein and hydration.
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-ghost" onClick={exportProgress}>
              <Download size={15} aria-hidden="true" /> Export
            </button>
            <button type="button" className="btn-primary" onClick={() => setWeightModalOpen(true)}>
              <Plus size={15} aria-hidden="true" /> Log weight
            </button>
          </div>
        </div>

        {/* Range switch */}
        <div className="inline-flex rounded-full border border-gray-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800" role="tablist" aria-label="Time range">
          {RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              role="tab"
              aria-selected={range === r.value}
              onClick={() => setRange(r.value)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-semibold transition-colors',
                range === r.value
                  ? 'bg-primary-500 text-white shadow-soft'
                  : 'text-gray-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400',
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {charts.map((chart, i) => (
            <motion.section
              key={chart.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn('card p-6', i === 0 && 'lg:col-span-2')}
              aria-labelledby={`chart-${i}`}
            >
              <h3 id={`chart-${i}`} className="mb-4 text-sm font-semibold">
                {chart.title}
              </h3>
              {chart.data.length === 0 ? (
                <p className="py-14 text-center text-sm text-gray-400 dark:text-slate-500">
                  No data in this range yet — start logging to see your trend.
                </p>
              ) : (
                <TrendChart
                  data={chart.data}
                  color={chart.color}
                  unit={chart.unit}
                  name={chart.name}
                  height={i === 0 ? 300 : 240}
                  domain={chart.domain}
                />
              )}
            </motion.section>
          ))}
        </div>
      </div>

      {/* Log weight modal */}
      <Modal open={weightModalOpen} onClose={() => setWeightModalOpen(false)} title="Log today's weight">
        <form onSubmit={onLogWeight} className="space-y-4" noValidate>
          <div>
            <label htmlFor="log-weight" className="label">
              Weight (kg)
            </label>
            <input
              id="log-weight"
              type="number"
              step="0.1"
              className="input text-numeric"
              {...register('weightKg')}
            />
            {errors.weightKg && <p className="mt-1 text-xs text-danger">{errors.weightKg.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setWeightModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save weight
            </button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
}
