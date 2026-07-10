import { motion } from 'framer-motion';
import { clampRatio } from '@/utils/calculations';

interface NutritionBarProps {
  label: string;
  value: number;
  target: number;
  unit?: string;
  color: string;
}

/** Horizontal macro progress bar with value / target labels. */
export default function NutritionBar({ label, value, target, unit = 'g', color }: NutritionBarProps) {
  const ratio = clampRatio(value, target);

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="flex items-center gap-2 font-medium">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          {label}
        </span>
        <span className="text-numeric text-xs text-gray-500 dark:text-slate-400">
          <strong className="text-sm text-gray-800 dark:text-slate-100">{Math.round(value)}</strong>
          {` / ${Math.round(target)} ${unit}`}
        </span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-gray-200/70 dark:bg-slate-700/70"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={Math.round(value)}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${ratio * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
