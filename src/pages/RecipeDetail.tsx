import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Flame, Gauge, Heart, Plus, Star, Users } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import MacroDonut from '@/components/charts/MacroDonut';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { getRecipeById } from '@/services/api';
import { MEAL_TYPES } from '@/constants';
import { todayKey } from '@/utils/date';
import { cn } from '@/utils/cn';
import type { MealType, Recipe } from '@/types';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const { favorites, toggleFavorite, addMeal } = useApp();
  const { addToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getRecipeById(id ?? '')
      .then((data) => {
        if (!cancelled) setRecipe(data ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  function logAs(type: MealType) {
    if (!recipe) return;
    addMeal({
      date: todayKey(),
      type,
      name: recipe.title,
      recipeId: recipe.id,
      ...recipe.nutrition,
    });
    setLogModalOpen(false);
    addToast(`Added "${recipe.title}" to today's ${type}.`);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-8 w-2/3" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <EmptyState
        emoji="🔍"
        title="Recipe not found"
        message="This recipe may have been removed or the link is wrong."
        action={
          <Link to="/recipes" className="btn-primary">
            Browse recipes
          </Link>
        }
      />
    );
  }

  const isFavorite = favorites.includes(recipe.id);

  function toggleIngredient(index: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <Link
          to="/recipes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to recipes
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'relative flex h-56 items-center justify-center rounded-card bg-gradient-to-br text-9xl shadow-soft',
            recipe.gradient,
          )}
        >
          <span className="drop-shadow" aria-hidden="true">
            {recipe.emoji}
          </span>
          <button
            type="button"
            onClick={() => toggleFavorite(recipe.id)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
            className={cn(
              'absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 shadow-soft backdrop-blur transition-all hover:scale-110 dark:bg-slate-900/70',
              isFavorite ? 'text-danger' : 'text-gray-400',
            )}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </motion.div>

        {/* Title + meta */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-accent dark:text-accent-dark">
              <Star size={15} fill="currentColor" aria-hidden="true" />
              <span className="text-numeric">{recipe.rating.toFixed(1)}</span>
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">{recipe.title}</h2>
            <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-slate-400">
              {recipe.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {recipe.categories.map((cat) => (
                <span
                  key={cat}
                  className="chip bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <button type="button" className="btn-primary" onClick={() => setLogModalOpen(true)}>
            <Plus size={16} aria-hidden="true" /> Add to meal tracker
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Flame, label: 'Calories', value: `${recipe.nutrition.calories} kcal` },
            { icon: Clock, label: 'Cook time', value: `${recipe.cookTime} min` },
            { icon: Gauge, label: 'Difficulty', value: recipe.difficulty },
            { icon: Users, label: 'Servings', value: `${recipe.servings}` },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card flex items-center gap-3 p-4"
            >
              <stat.icon size={20} className="shrink-0 text-primary-500" aria-hidden="true" />
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-numeric text-sm font-semibold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Ingredients */}
          <section className="card p-6 lg:col-span-2" aria-labelledby="ingredients-heading">
            <h3 id="ingredients-heading" className="mb-4 font-semibold">
              Ingredients
            </h3>
            <ul className="space-y-2.5">
              {recipe.ingredients.map((ing, i) => (
                <li key={ing}>
                  <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={checked.has(i)}
                      onChange={() => toggleIngredient(i)}
                      className="mt-0.5 h-4 w-4 rounded accent-primary-500"
                    />
                    <span
                      className={cn(
                        'transition-colors',
                        checked.has(i) && 'text-gray-400 line-through dark:text-slate-500',
                      )}
                    >
                      {ing}
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <h3 className="mb-4 mt-8 font-semibold">Nutrition per serving</h3>
            <MacroDonut
              protein={recipe.nutrition.protein}
              carbs={recipe.nutrition.carbs}
              fat={recipe.nutrition.fat}
              size={160}
              centerLabel={{ value: `${recipe.nutrition.calories}`, caption: 'kcal' }}
            />
          </section>

          {/* Instructions */}
          <section className="card p-6 lg:col-span-3" aria-labelledby="instructions-heading">
            <h3 id="instructions-heading" className="mb-4 font-semibold">
              Instructions
            </h3>
            <ol className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <motion.li
                  key={step}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex gap-4"
                >
                  <span className="text-numeric flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-500/15 dark:text-primary-400">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                    {step}
                  </p>
                </motion.li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {/* Log-meal modal */}
      <Modal open={logModalOpen} onClose={() => setLogModalOpen(false)} title="Add to today's meals">
        <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
          Which meal should “{recipe.title}” count towards?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {MEAL_TYPES.map((meal) => (
            <button
              key={meal.value}
              type="button"
              onClick={() => logAs(meal.value)}
              className="card flex flex-col items-center gap-2 p-4 transition-all hover:border-primary-400 hover:shadow-soft-lg"
            >
              <span className="text-3xl" aria-hidden="true">
                {meal.emoji}
              </span>
              <span className="text-sm font-semibold">{meal.label}</span>
            </button>
          ))}
        </div>
      </Modal>
    </PageTransition>
  );
}
