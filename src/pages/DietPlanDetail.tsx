import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Ban, CalendarDays, CheckCircle2, Flame } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import MacroDonut from '@/components/charts/MacroDonut';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { getDietPlanById } from '@/services/api';
import { cn } from '@/utils/cn';
import type { DietPlan } from '@/types';

export default function DietPlanDetail() {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const { updateProfile } = useApp();
  const { addToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDietPlanById(id ?? '')
      .then((data) => {
        if (!cancelled) setPlan(data ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <EmptyState
        emoji="🔍"
        title="Plan not found"
        message="This diet plan may have been removed or the link is wrong."
        action={
          <Link to="/diet-plans" className="btn-primary">
            Browse plans
          </Link>
        }
      />
    );
  }

  function adoptPlan() {
    if (!plan) return;
    updateProfile({ calorieGoal: plan.calories, dietPreference: plan.name });
    addToast(`"${plan.name}" is now your active plan — calorie goal set to ${plan.calories} kcal.`);
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <Link
          to="/diet-plans"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
        >
          <ArrowLeft size={16} aria-hidden="true" /> All plans
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'relative overflow-hidden rounded-card bg-gradient-to-br p-8 text-white shadow-soft-lg sm:p-10',
            plan.gradient,
          )}
        >
          <span className="pointer-events-none absolute -right-4 -top-6 text-9xl opacity-25" aria-hidden="true">
            {plan.emoji}
          </span>
          <h2 className="text-3xl font-bold">{plan.name}</h2>
          <p className="mt-2 max-w-lg text-sm text-white/90">{plan.tagline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur">
              <Flame size={15} aria-hidden="true" />
              <span className="text-numeric">{plan.calories}</span> kcal/day
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur">
              <CalendarDays size={15} aria-hidden="true" />
              {plan.duration}
            </span>
          </div>
          <button
            type="button"
            onClick={adoptPlan}
            className="btn mt-6 bg-white text-gray-800 shadow-soft hover:scale-105"
          >
            Make this my plan
          </button>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Daily meals */}
          <section className="card p-6" aria-labelledby="plan-meals">
            <h3 id="plan-meals" className="mb-4 font-semibold">
              A typical day
            </h3>
            <div className="space-y-4">
              {plan.meals.map((meal, i) => (
                <motion.div
                  key={meal.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-slate-700/60 dark:bg-slate-900/40"
                >
                  <p className="mb-1.5 text-sm font-semibold text-primary-700 dark:text-primary-400">
                    {meal.name}
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-slate-300">
                    {meal.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            {/* Macro split */}
            <section className="card p-6" aria-labelledby="plan-macros">
              <h3 id="plan-macros" className="mb-4 font-semibold">
                Macro split
              </h3>
              <MacroDonut
                protein={plan.macros.protein}
                carbs={plan.macros.carbs}
                fat={plan.macros.fat}
                unit="%"
                size={170}
                centerLabel={{ value: `${plan.calories}`, caption: 'kcal/day' }}
              />
            </section>

            {/* Benefits */}
            <section className="card p-6" aria-labelledby="plan-benefits">
              <h3 id="plan-benefits" className="mb-4 font-semibold">
                Benefits
              </h3>
              <ul className="space-y-2.5">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-primary-500"
                      aria-hidden="true"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>

            {/* Foods to avoid */}
            <section className="card p-6" aria-labelledby="plan-avoid">
              <h3 id="plan-avoid" className="mb-4 font-semibold">
                Foods to avoid
              </h3>
              <ul className="space-y-2.5">
                {plan.avoid.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Ban size={17} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
