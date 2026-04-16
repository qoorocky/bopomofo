type SymbolStatus = 'new' | 'learning' | 'mastered';

const DAY_MS = 24 * 60 * 60 * 1000;

export function getIntervalDays(reviewCount: number, status: SymbolStatus): number {
  if (status === 'mastered') return 14;
  if (reviewCount === 0) return 0;
  if (reviewCount === 1) return 1;
  if (reviewCount === 2) return 3;
  return 7;
}

/**
 * Returns the Unix timestamp (ms) when the symbol is next due.
 * Returns 0 if the symbol has never been reviewed (always due).
 */
export function getNextDueAt(
  lastReviewedAt: number | undefined,
  reviewCount: number,
  status: SymbolStatus,
): number {
  if (!lastReviewedAt) return 0;
  const interval = getIntervalDays(reviewCount, status);
  return lastReviewedAt + interval * DAY_MS;
}

export function isDueNow(dueAt: number, now = Date.now()): boolean {
  return dueAt <= now;
}

interface ReviewSnapshot {
  lastReviewedAt: Record<string, number>;
  reviewCount: Record<string, number>;
  symbolStatus: Record<string, SymbolStatus>;
}

/**
 * Returns ids of symbols due for review today, sorted by dueAt asc then id asc.
 */
export function getDueSymbolIds(
  allIds: string[],
  snapshot: ReviewSnapshot,
  now = Date.now(),
): string[] {
  const { lastReviewedAt, reviewCount, symbolStatus } = snapshot;

  return allIds
    .map((id) => {
      const status = symbolStatus[id] ?? 'new';
      const count = reviewCount[id] ?? 0;
      const lastAt = lastReviewedAt[id];
      const dueAt = getNextDueAt(lastAt, count, status);
      return { id, dueAt, count };
    })
    // Skip symbols never reviewed — they belong in 開始學習, not daily review
    .filter(({ count, dueAt }) => count > 0 && isDueNow(dueAt, now))
    .sort((a, b) => a.dueAt - b.dueAt || a.id.localeCompare(b.id))
    .map(({ id }) => id);
}
