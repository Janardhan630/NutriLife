import { cn } from '@/utils/cn';

/** Generic shimmering placeholder block. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden="true" />;
}

/** Placeholder matching the RecipeCard layout. */
export function RecipeCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Full-page loading fallback used by lazy routes. */
export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6" role="status" aria-label="Loading page">
      <Skeleton className="h-9 w-56" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
