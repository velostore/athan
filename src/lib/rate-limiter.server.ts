import process from "node:process";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const CLEAN_INTERVAL = 60_000;
const WINDOW_MS = 60_000;

let lastClean = Date.now();

function clean() {
  const now = Date.now();
  if (now - lastClean < CLEAN_INTERVAL) return;
  lastClean = now;
  for (const [key, b] of buckets) {
    if (now > b.resetAt) buckets.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  maxRequests: number = parseInt(process.env.RATE_LIMIT_MAX ?? "60", 10),
): { allowed: boolean; remaining: number; resetAt: number } {
  clean();

  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + WINDOW_MS };
  }

  bucket.count++;

  if (bucket.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  return { allowed: true, remaining: maxRequests - bucket.count, resetAt: bucket.resetAt };
}
