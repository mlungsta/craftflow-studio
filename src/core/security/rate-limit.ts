const WINDOW_MS = 60_000;
const bucket = new Map<string, number[]>();

export function enforceRateLimit(key: string, limit: number): void {
  const now = Date.now();
  const arr = bucket.get(key) ?? [];
  const fresh = arr.filter((ts) => now - ts < WINDOW_MS);

  if (fresh.length >= limit) {
    throw new Error("RATE_LIMIT_EXCEEDED");
  }

  fresh.push(now);
  bucket.set(key, fresh);
}
