import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Flame, Heart, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/cn';
import type { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

/** Recipe grid card with favorite toggle, categories and key stats. */
export default function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const { favorites, toggleFavorite } = useApp();
  const isFavorite = favorites.includes(recipe.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="card group relative overflow-hidden transition-shadow hover:shadow-soft-lg"
    >
      <Link
        to={`/recipes/${recipe.id}`}
        className="block focus-visible:outline-none"
        aria-label={`View recipe: ${recipe.title}`}
      >
        {/* Illustration tile */}
        <div
          className={cn(
            'flex h-40 items-center justify-center bg-gradient-to-br text-7xl transition-transform duration-500 group-hover:scale-[1.03]',
            recipe.gradient,
          )}
          aria-hidden="true"
        >
          <span className="drop-shadow-sm transition-transform duration-500 group-hover:scale-110">
            {recipe.emoji}
          </span>
        </div>

        <div className="p-5">
          <div className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-accent dark:text-accent-dark">
            <Star size={13} fill="currentColor" aria-hidden="true" />
            <span className="text-numeric">{recipe.rating.toFixed(1)}</span>
          </div>
          <h3 className="mb-1 font-semibold leading-snug">{recipe.title}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-slate-400">
            {recipe.description}
          </p>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {recipe.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="chip bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Flame size={14} className="text-accent" aria-hidden="true" />
              <span className="text-numeric">{recipe.nutrition.calories}</span> kcal
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} aria-hidden="true" />
              <span className="text-numeric">{recipe.cookTime}</span> min
            </span>
            <span>{recipe.difficulty}</span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(recipe.id)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={isFavorite}
        className={cn(
          'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-soft backdrop-blur transition-all hover:scale-110 dark:bg-slate-900/70',
          isFavorite ? 'text-danger' : 'text-gray-400 hover:text-danger',
        )}
      >
        <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </motion.article>
  );
}
