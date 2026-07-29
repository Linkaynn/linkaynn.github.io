import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let hourlyLimiter = null;
let dailyLimiter = null;

function buildLimiters() {
  if (hourlyLimiter && dailyLimiter) return { hourlyLimiter, dailyLimiter };
  // Accept env vars from either a direct Upstash signup or Vercel
  // Marketplace's Redis integration (also Upstash under the hood, but it
  // names the vars differently when auto-provisioned).
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.REDIS_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.REDIS_TOKEN;
  if (!url || !token) return { hourlyLimiter: null, dailyLimiter: null };
  const redis = new Redis({ url, token });
  hourlyLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    analytics: true,
    prefix: 'jr:contact:hour',
  });
  dailyLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '24 h'),
    analytics: true,
    prefix: 'jr:contact:day',
  });
  return { hourlyLimiter, dailyLimiter };
}

/**
 * Returns { ok: true } on success or { ok: false, retryAfter: seconds }
 * if the caller has hit either window. When Upstash credentials are not
 * configured, returns { ok: true, skipped: true } so local dev still works.
 * If the Redis backend is unreachable at runtime (hibernated store, timeout,
 * etc.) it also fails open with { ok: true, skipped: true } rather than
 * bringing the whole contact form down with a 500.
 */
export async function checkContactLimit(ip) {
  const { hourlyLimiter, dailyLimiter } = buildLimiters();
  if (!hourlyLimiter || !dailyLimiter) return { ok: true, skipped: true };
  const key = ip || 'anonymous';
  try {
    const [hourly, daily] = await Promise.all([
      hourlyLimiter.limit(`h:${key}`),
      dailyLimiter.limit(`d:${key}`),
    ]);
    if (!hourly.success) {
      return { ok: false, retryAfter: Math.ceil((hourly.reset - Date.now()) / 1000), window: 'hourly' };
    }
    if (!daily.success) {
      return { ok: false, retryAfter: Math.ceil((daily.reset - Date.now()) / 1000), window: 'daily' };
    }
    return { ok: true };
  } catch (err) {
    // The credentials are present but the Redis call failed (e.g. the Upstash
    // store was hibernated after inactivity). Fail open so a rate-limit
    // backend outage never blocks a legitimate contact submission.
    console.error('[ratelimit] contact limiter check failed, failing open', err);
    return { ok: true, skipped: true };
  }
}
