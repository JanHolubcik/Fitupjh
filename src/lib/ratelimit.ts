import { NextRequest } from "next/server";
import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

// Cache of ratelimiters by their limit and window duration
const limiters = new Map<string, Ratelimit>();

export const getIpAddress = (request: NextRequest): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "127.0.0.1";
};

export const checkRateLimit = async (
  identifier: string,
  limit: number,
  window: Duration = "60 s",
): Promise<RateLimitResult> => {
  const cacheKey = `${limit}-${window}`;
  let limiter = limiters.get(cacheKey);

  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, window),
      analytics: true,
      prefix: `@upstash/ratelimit/${cacheKey}`,
    });
    limiters.set(cacheKey, limiter);
  }

  const {
    success,
    limit: limitVal,
    remaining,
    reset,
  } = await limiter.limit(identifier);

  return {
    success,
    limit: limitVal,
    remaining,
    reset,
  };
};
