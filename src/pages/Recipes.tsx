import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import RecipeCard from '@/components/RecipeCard';
import SearchBar from '@/components/SearchBar';
import FilterPanel, { DEFAULT_FILTERS, type RecipeFilters } from '@/components/FilterPanel';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { RecipeCardSkeleton } from '@/components/Skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { useApp } from '@/context/AppContext';
import { getRecipes } from '@/services/api';
import { RECIPE_CATEGORIES, RECIPES_PER_PAGE } from '@/constants';
import { cn } from '@/utils/cn';
import type { Recipe, RecipeCategory } from '@/types';

type CategoryFilter = RecipeCategory | 'All' | 'Favorites';

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [filters, setFilters] = useState<RecipeFilters>(DEFAULT_FILTERS);
  const { favorites } = useApp();

  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    let cancelled = false;
    getRecipes()
      .then((data) => {
        if (!cancelled) setAllRecipes(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the ?q= param shareable
  useEffect(() => {
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, { replace: true });
  }, [debouncedQuery, setSearchParams]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let list = allRecipes.filter((r) => {
      if (category === 'Favorites' && !favorites.includes(r.id)) return false;
      if (category !== 'All' && category !== 'Favorites' && !r.categories.includes(category)) {
        return false;
      }
      if (filters.difficulty !== 'All' && r.difficulty !== filters.difficulty) return false;
      if (r.cookTime > filters.maxTime) return false;
      if (r.nutrition.calories > filters.maxCalories) return false;
      if (
        q &&
        !r.title.toLowerCase().includes(q) &&
        !r.description.toLowerCase().includes(q) &&
        !r.ingredients.some((ing) => ing.toLowerCase().includes(q))
      ) {
        return false;
      }
      return true;
    });

    switch (filters.sort) {
      case 'calories-asc':
        list = [...list].sort((a, b) => a.nutrition.calories - b.nutrition.calories);
        break;
      case 'calories-desc':
        list = [...list].sort((a, b) => b.nutrition.calories - a.nutrition.calories);
        break;
      case 'time-asc':
        list = [...list].sort((a, b) => a.cookTime - b.cookTime);
        break;
      default:
        list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [allRecipes, debouncedQuery, category, filters, favorites]);

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, RECIPES_PER_PAGE);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Recipes</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {loading ? 'Loading delicious ideas…' : `${filtered.length} healthy recipes to explore.`}
          </p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search recipes or ingredients…"
            className="flex-1"
          />
          <FilterPanel filters={filters} onChange={setFilters} />
        </div>

        {/* Category chips */}
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Recipe categories">
          {(['All', 'Favorites', ...RECIPE_CATEGORIES] as CategoryFilter[]).map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'chip shrink-0 px-4 py-2 transition-all',
                category === cat
                  ? 'bg-primary-500 text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-primary-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
              )}
            >
              {cat === 'Favorites' && <Heart size={12} fill="currentColor" aria-hidden="true" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          <EmptyState
            emoji="🍽️"
            title="No recipes found"
            message={
              category === 'Favorites'
                ? 'You have no favorites yet — tap the heart on any recipe to save it here.'
                : 'Try a different search term or loosen the filters.'
            }
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((recipe, i) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={i} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </PageTransition>
  );
}
