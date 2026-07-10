/** Date helpers — all keys are local-time `yyyy-MM-dd` strings. */

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDays(key: string, days: number): string {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** "Mon, Jan 5" style label. */
export function formatDateKey(key: string): string {
  return fromDateKey(key).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Short axis label like "Jan 5". */
export function shortLabel(key: string): string {
  return fromDateKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Last `n` day keys ending today (oldest first). */
export function lastNDays(n: number): string[] {
  const keys: string[] = [];
  const today = todayKey();
  for (let i = n - 1; i >= 0; i--) keys.push(addDays(today, -i));
  return keys;
}

export function isToday(key: string): boolean {
  return key === todayKey();
}
