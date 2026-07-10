import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Flame } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Skeleton } from '@/components/Skeleton';
import { getDietPlans } from '@/services/api';
import { cn } from '@/utils/cn';
import type { DietPlan } from '@/types';

export default function DietPlans() {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getDietPlans()
      .then((data) => {
        if (!cancelled) setPlans(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Diet Plans</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Structured, expert-designed plans — pick one that fits your goal and lifestyle.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/diet-plans/${plan.id}`}
                  className="card group block h-full overflow-hidden transition-shadow hover:shadow-soft-lg"
                >
                  <div
                    className={cn(
                      'flex h-28 items-center justify-center bg-gradient-to-br text-6xl transition-transform duration-500 group-hover:scale-[1.03]',
                      plan.gradient,
                    )}
                    aria-hidden="true"
                  >
                    {plan.emoji}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-slate-400">
                      {plan.tagline}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Flame size={13} className="text-accent" aria-hidden="true" />
                        <span className="text-numeric">{plan.calories}</span> kcal/day
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} aria-hidden="true" />
                        {plan.duration}
                      </span>
                    </div>
                    <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:underline dark:text-primary-400">
                      View plan <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
