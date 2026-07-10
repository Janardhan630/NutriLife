import { useEffect, useMemo, useState } from 'react';

/**
 * Client-side pagination over an already-filtered list.
 * Resets to page 1 whenever the list length changes (filters applied).
 */
export function usePagination<T>(items: T[], perPage: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  useEffect(() => {
    setPage(1);
  }, [items.length]);

  const pageItems = useMemo(
    () => items.slice((page - 1) * perPage, page * perPage),
    [items, page, perPage],
  );

  return { page, setPage, totalPages, pageItems };
}
