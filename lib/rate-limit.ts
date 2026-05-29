/**
 * Rate limiter using Upstash Redis.
 * Protects /api/ai/* routes from abuse and quota exhaustion.
 * Falls back to no-op if Upstash is not configured (dev mode).
 */

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

let rateLimiter: { limit: (identifier: string) => Promise<RateLimitResult> } | null = null;

async function getRateLimiter() {
  if (rateLimiter) return rateLimiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("⚠️  Upstash Redis not configured — rate limiting disabled");
    // Return a no-op limiter for development
    rateLimiter = {
      limit: async () => ({
        success: true,
        limit: 10,
        remaining: 10,
        reset: Date.now() + 60000,
      }),
    };
    return rateLimiter;
  }

  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({ url, token });

    rateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per minute
      analytics: true,
      prefix: "ai-resume-builder",
    });

    return rateLimiter;
  } catch {
    console.warn("⚠️  Failed to initialize Upstash — rate limiting disabled");
    rateLimiter = {
      limit: async () => ({
        success: true,
        limit: 10,
        remaining: 10,
        reset: Date.now() + 60000,
      }),
    };
    return rateLimiter;
  }
}

/**
 * Check rate limit for a given identifier (usually userId or IP).
 * Returns { success, remaining, reset } or throws if limit exceeded.
 */
export async function checkRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  const limiter = await getRateLimiter();
  return limiter.limit(identifier);
}
