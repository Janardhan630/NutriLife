import { SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { cn } from '@/utils/cn';
import type { Difficulty } from '@/types';

export type SortOption = 'popular' | 'calories-asc' | 'calories-desc' | 'time-asc';

export interface RecipeFilters {
  difficulty: Difficulty | 'All';
  maxTime: number;
  maxCalories: number;
  sort: SortOption;
}

export const DEFAULT_FILTERS: RecipeFilters = {
  difficulty: 'All',
  maxTime: 60,
  maxCalories: 800,
  sort: 'popular',
};

const SORT_LABELS: Record<SortOption, string> = {
  popular: 'Most popular',
  'calories-asc': 'Calories: low → high',
  'calories-desc': 'Calories: high → low',
  'time-asc': 'Quickest first',
};

interface FilterPanelProps {
  filters: RecipeFilters;
  onChange: (filters: RecipeFilters) => void;
}

/** Dropdown panel with difficulty, time, calorie and sort controls. */
export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(panelRef, () => setOpen(false));

  const isDirty =
    filters.difficulty !== 'All' ||
    filters.maxTime !== DEFAULT_FILTERS.maxTime ||
    filters.maxCalories !== DEFAULT_FILTERS.maxCalories ||
    filters.sort !== 'popular';

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn('btn-ghost', isDirty && 'border-primary-400 text-primary-600 dark:text-primary-400')}
      >
        <SlidersHorizontal size={16} />
        Filters
        {isDirty && <span className="h-2 w-2 rounded-full bg-primary-500" aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="card absolute right-0 top-14 z-30 w-[300px] space-y-5 p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Filter recipes</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="rounded-full p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
              >
                <X size={15} />
              </button>
            </div>

            <div>
              <span className="label">Difficulty</span>
              <div className="flex gap-1.5">
                {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onChange({ ...filters, difficulty: d })}
                    aria-pressed={filters.difficulty === d}
                    className={cn(
                      'chip transition-colors',
                      filters.difficulty === d
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300',
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="filter-time" className="label flex justify-between">
                Max cooking time
                <span className="text-numeric font-semibold text-primary-600 dark:text-primary-400">
                  {filters.maxTime} min
                </span>
              </label>
              <input
                id="filter-time"
                type="range"
                min={10}
                max={60}
                step={5}
                value={filters.maxTime}
                onChange={(e) => onChange({ ...filters, maxTime: Number(e.target.value) })}
                className="w-full accent-primary-500"
              />
            </div>

            <div>
              <label htmlFor="filter-cal" className="label flex justify-between">
                Max calories
                <span className="text-numeric font-semibold text-primary-600 dark:text-primary-400">
                  {filters.maxCalories} kcal
                </span>
              </label>
              <input
                id="filter-cal"
                type="range"
                min={100}
                max={800}
                step={50}
                value={filters.maxCalories}
                onChange={(e) => onChange({ ...filters, maxCalories: Number(e.target.value) })}
                className="w-full accent-primary-500"
              />
            </div>

            <div>
              <label htmlFor="filter-sort" className="label">
                Sort by
              </label>
              <select
                id="filter-sort"
                value={filters.sort}
                onChange={(e) => onChange({ ...filters, sort: e.target.value as SortOption })}
                className="input"
              >
                {Object.entries(SORT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {isDirty && (
              <button
                type="button"
                onClick={() => onChange(DEFAULT_FILTERS)}
                className="w-full text-center text-xs font-semibold text-gray-500 underline-offset-2 hover:underline dark:text-slate-400"
              >
                Reset all filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
