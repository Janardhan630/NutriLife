import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Sparkles, Star } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import RecipeCard from '@/components/RecipeCard';
import { recipes } from '@/data/recipes';
import { dietPlans } from '@/data/dietPlans';
import { nutritionTips } from '@/data/tips';
import { testimonials } from '@/data/testimonials';
import { cn } from '@/utils/cn';

const FLOATING_FOODS = [
  { emoji: '🥑', className: 'left-[6%] top-[12%] text-5xl', delay: 0 },
  { emoji: '🍓', className: 'right-[10%] top-[8%] text-4xl', delay: 1.2 },
  { emoji: '🥦', className: 'left-[12%] bottom-[16%] text-4xl', delay: 0.6 },
  { emoji: '🍊', className: 'right-[6%] bottom-[24%] text-5xl', delay: 1.8 },
  { emoji: '🫐', className: 'left-[42%] top-[6%] text-3xl', delay: 2.4 },
];

const sectionReveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const featuredRecipes = recipes.slice(0, 3);
  const featuredPlans = dietPlans.slice(0, 4);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    navigate(query.trim() ? `/recipes?q=${encodeURIComponent(query.trim())}` : '/recipes');
  }

  return (
    <PageTransition>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-[#F8FAFC] to-[#F8FAFC] dark:from-primary-500/10 dark:via-[#0F172A] dark:to-[#0F172A]">
        {FLOATING_FOODS.map((food) => (
          <motion.span
            key={food.emoji}
            aria-hidden="true"
            className={cn('pointer-events-none absolute select-none opacity-70', food.className)}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: food.delay }}
          >
            {food.emoji}
          </motion.span>
        ))}

        <div className="mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="chip mx-auto mb-6 bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400"
          >
            <Sparkles size={13} aria-hidden="true" />
            Your personal nutrition companion
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-6xl"
          >
            Eat smart. <span className="text-primary-600 dark:text-primary-400">Live well.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base text-gray-500 dark:text-slate-400 sm:text-lg"
          >
            Discover healthy recipes, track every meal, stay hydrated and watch your progress —
            all in one beautifully simple app.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={onSearch}
            className="glass mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full p-2 shadow-soft-lg"
            role="search"
          >
            <Search size={18} className="ml-3 shrink-0 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search healthy recipes…"
              aria-label="Search healthy recipes"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden"
            />
            <button type="submit" className="btn-primary shrink-0 !px-5">
              Search
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/dashboard" className="btn-primary">
              Start tracking free <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/calculator" className="btn-ghost">
              Calculate my calories
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Featured diet plans ─────────────────────────────── */}
      <motion.section {...sectionReveal} className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured diet plans</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Expert-designed plans for every goal.
            </p>
          </div>
          <Link
            to="/diet-plans"
            className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400 sm:flex"
          >
            View all <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Link to={`/diet-plans/${plan.id}`} className="card block h-full overflow-hidden">
                <div
                  className={cn(
                    'flex h-24 items-center justify-center bg-gradient-to-br text-5xl',
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
                  <p className="text-numeric mt-3 text-xs font-semibold text-primary-600 dark:text-primary-400">
                    {plan.calories} kcal/day · {plan.duration}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Featured recipes ────────────────────────────────── */}
      <motion.section {...sectionReveal} className="bg-white py-16 dark:bg-slate-800/40">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Popular recipes</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Fresh, fast and full of flavor.
              </p>
            </div>
            <Link
              to="/recipes"
              className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400 sm:flex"
            >
              Browse all <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRecipes.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={i} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Nutrition tips ──────────────────────────────────── */}
      <motion.section {...sectionReveal} className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">Small habits, big results</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {nutritionTips.map((tip, i) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card p-6"
            >
              <span className="text-3xl" aria-hidden="true">
                {tip.emoji}
              </span>
              <h3 className="mb-1.5 mt-3 font-semibold">{tip.title}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">{tip.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <motion.section {...sectionReveal} className="bg-white py-16 dark:bg-slate-800/40">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">Loved by healthy eaters</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card flex flex-col p-6"
              >
                <div
                  className="mb-3 flex gap-0.5 text-accent dark:text-accent-dark"
                  aria-label={`Rated ${t.rating} out of 5`}
                >
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={15}
                      fill={s < Math.round(t.rating) ? 'currentColor' : 'none'}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="flex-1 text-sm text-gray-600 dark:text-slate-300">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-xl dark:bg-primary-500/20">
                    {t.avatar}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <motion.section {...sectionReveal} className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-primary-500 to-emerald-600 p-10 text-center text-white shadow-soft-lg sm:p-16">
          <span className="pointer-events-none absolute -left-6 -top-6 text-8xl opacity-20" aria-hidden="true">
            🥗
          </span>
          <span className="pointer-events-none absolute -bottom-8 -right-4 text-8xl opacity-20" aria-hidden="true">
            🍎
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to transform your health?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/85 sm:text-base">
            Join thousands building healthier habits with NutriLife. Free forever, no credit card
            required.
          </p>
          <Link
            to="/dashboard"
            className="btn mt-8 bg-white text-primary-700 shadow-soft-lg hover:scale-105"
          >
            Get started now <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </motion.section>
    </PageTransition>
  );
}
