import { useEffect, useState } from 'react';
import { readStorage, writeStorage } from '@/utils/storage';

/**
 * useState that persists to localStorage (namespaced under the app prefix).
 * Reads once lazily on mount, writes on every change. Accepts a lazy
 * initializer so expensive seed data is only built on first visit.
 */
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const sentinel = Symbol('missing');
    const stored = readStorage<T | typeof sentinel>(key, sentinel);
    if (stored !== sentinel) return stored as T;
    return initialValue instanceof Function ? initialValue() : initialValue;
  });

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
