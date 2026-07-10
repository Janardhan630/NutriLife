import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import Modal from '@/components/Modal';
import MealCard from '@/components/MealCard';
import NutritionBar from '@/components/NutritionBar';
import { useChartTheme } from '@/components/charts/chartTheme';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { MEAL_TYPES } from '@/constants';
import { recipes } from '@/data/recipes';
import { addDays, formatDateKey, isToday, todayKey } from '@/utils/date';
import type { LoggedMeal, MealType } from '@/types';

const mealSchema = z.object({
  name: z.string().min(2, 'Give the meal a name'),
  calories: z.coerce.number().min(0, 'Must be ≥ 0').max(5000, 'That seems too high'),
  protein: z.coerce.number().min(0).max(500),
  carbs: z.coerce.number().min(0).max(500),
  fat: z.coerce.number().min(0).max(500),
});

type MealForm = z.infer<typeof mealSchema>;

const EMPTY_FORM: MealForm = { name: '', calories: 0, protein: 0, carbs: 0, fat: 0 };

export default function MealTracker() {
  const { profile, mealsForDate, totalsForDate, addMeal, updateMeal, deleteMeal } = useApp();
  const { addToast } = useToast();
  const { colors } = useChartTheme();

  const [date, setDate] = useState(todayKey());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<MealType>('breakfast');
  const [editing, setEditing] = useState<LoggedMeal | null>(null);

  const meals = mealsForDate(date);
  const totals = totalsForDate(date);

  const targets = useMemo(
    () => ({
      protein: Math.round((profile.calorieGoal * 0.3) / 4),
      carbs: Math.round((profile.calorieGoal * 0.4) / 4),
      fat: Math.round((profile.calorieGoal * 0.3) / 9),
    }),
    [profile.calorieGoal],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MealForm>({ resolver: zodResolver(mealSchema), defaultValues: EMPTY_FORM });

  // Populate the form when opening for edit
  useEffect(() => {
    if (modalOpen) {
      reset(editing ?? EMPTY_FORM);
    }
  }, [modalOpen, editing, reset]);

  function openAdd(type: MealType) {
    setEditing(null);
    setModalType(type);
    setModalOpen(true);
  }

  function openEdit(meal: LoggedMeal) {
    setEditing(meal);
    setModalType(meal.type);
    setModalOpen(true);
  }

  function onDelete(meal: LoggedMeal) {
    deleteMeal(meal.id);
    addToast(`Deleted "${meal.name}".`, 'info');
  }

  const onSubmit = handleSubmit((data) => {
    if (editing) {
      updateMeal(editing.id, data);
      addToast(`Updated "${data.name}".`);
    } else {
      addMeal({ ...data, date, type: modalType });
      addToast(`Logged "${data.name}" for ${modalType}.`);
    }
    setModalOpen(false);
  });

  /** Prefill the form from a recipe (auto-calculates calories & macros). */
  function applyRecipe(recipeId: string) {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;
    setValue('name', recipe.title);
    setValue('calories', recipe.nutrition.calories);
    setValue('protein', recipe.nutrition.protein);
    setValue('carbs', recipe.nutrition.carbs);
    setValue('fat', recipe.nutrition.fat);
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Date navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Meal Tracker</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Log everything you eat and watch your day add up.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDate((d) => addDays(d, -1))}
              aria-label="Previous day"
              className="btn-ghost !px-3"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-numeric min-w-32 text-center text-sm font-semibold">
              {isToday(date) ? 'Today' : formatDateKey(date)}
            </span>
            <button
              type="button"
              onClick={() => setDate((d) => addDays(d, 1))}
              disabled={isToday(date)}
              aria-label="Next day"
              className="btn-ghost !px-3"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Daily summary */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card space-y-4 p-6"
          aria-labelledby="daily-summary"
        >
          <div className="flex items-baseline justify-between">
            <h3 id="daily-summary" className="text-sm font-semibold">
              Daily nutrition summary
            </h3>
            <p className="text-sm">
              <strong className="text-numeric text-lg">{totals.calories}</strong>
              <span className="text-xs text-gray-500 dark:text-slate-400">
                {' '}
                / {profile.calorieGoal} kcal
              </span>
            </p>
          </div>
          <NutritionBar
            label="Calories"
            value={totals.calories}
            target={profile.calorieGoal}
            unit="kcal"
            color={colors.calories}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <NutritionBar label="Protein" value={totals.protein} target={targets.protein} color={colors.protein} />
            <NutritionBar label="Carbs" value={totals.carbs} target={targets.carbs} color={colors.carbs} />
            <NutritionBar label="Fat" value={totals.fat} target={targets.fat} color={colors.fat} />
          </div>
        </motion.section>

        {/* Meal sections */}
        <div className="grid gap-5 md:grid-cols-2">
          {MEAL_TYPES.map((section, i) => {
            const sectionMeals = meals.filter((m) => m.type === section.value);
            const sectionCalories = sectionMeals.reduce((sum, m) => sum + m.calories, 0);
            return (
              <motion.section
                key={section.value}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card p-5"
                aria-labelledby={`section-${section.value}`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 id={`section-${section.value}`} className="flex items-center gap-2 font-semibold">
                    <span aria-hidden="true">{section.emoji}</span> {section.label}
                  </h3>
                  <span className="text-numeric text-xs font-semibold text-gray-500 dark:text-slate-400">
                    {sectionCalories} kcal
                  </span>
                </div>

                <div className="space-y-2">
                  <AnimatePresence initial={false}>
                    {sectionMeals.map((meal) => (
                      <MealCard key={meal.id} meal={meal} onEdit={openEdit} onDelete={onDelete} />
                    ))}
                  </AnimatePresence>
                  {sectionMeals.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-gray-200 py-4 text-center text-xs text-gray-400 dark:border-slate-700 dark:text-slate-500">
                      Nothing logged yet
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openAdd(section.value)}
                  className="btn-ghost mt-3 w-full"
                >
                  <Plus size={15} aria-hidden="true" /> Add {section.label.toLowerCase()}
                </button>
              </motion.section>
            );
          })}
        </div>
      </div>

      {/* Add / edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit meal' : `Add to ${MEAL_TYPES.find((m) => m.value === modalType)?.label}`}
      >
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {!editing && (
            <div>
              <label htmlFor="recipe-prefill" className="label">
                Quick add from a recipe (optional)
              </label>
              <select
                id="recipe-prefill"
                className="input"
                defaultValue=""
                onChange={(e) => e.target.value && applyRecipe(e.target.value)}
              >
                <option value="">Choose a recipe…</option>
                {recipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.nutrition.calories} kcal)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="meal-name" className="label">
              Meal name
            </label>
            <input id="meal-name" className="input" placeholder="e.g. Chicken wrap" {...register('name')} />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { key: 'calories', label: 'Calories (kcal)' },
                { key: 'protein', label: 'Protein (g)' },
                { key: 'carbs', label: 'Carbs (g)' },
                { key: 'fat', label: 'Fat (g)' },
              ] as const
            ).map((field) => (
              <div key={field.key}>
                <label htmlFor={`meal-${field.key}`} className="label">
                  {field.label}
                </label>
                <input
                  id={`meal-${field.key}`}
                  type="number"
                  min={0}
                  step="1"
                  className="input text-numeric"
                  {...register(field.key)}
                />
                {errors[field.key] && (
                  <p className="mt-1 text-xs text-danger">{errors[field.key]?.message}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editing ? 'Save changes' : 'Add meal'}
            </button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
}
