import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import type { LoggedMeal } from '@/types';

interface MealCardProps {
  meal: LoggedMeal;
  onEdit: (meal: LoggedMeal) => void;
  onDelete: (meal: LoggedMeal) => void;
}

/** A single logged meal row in the tracker, with edit/delete actions. */
export default function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-900/40"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{meal.name}</p>
        <p className="text-numeric text-xs text-gray-500 dark:text-slate-400">
          {meal.calories} kcal · P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g
        </p>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => onEdit(meal)}
          aria-label={`Edit ${meal.name}`}
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/10 dark:hover:text-primary-400"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(meal)}
          aria-label={`Delete ${meal.name}`}
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  );
}
