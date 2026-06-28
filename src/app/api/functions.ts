import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/ratelimit";

import type { Session, User } from "better-auth";

const validate = async (req: NextRequest) => {
  const authData = await auth.api.getSession({
    headers: req.headers,
  });

  if (!authData || !authData.user) {
    throw new Error("Unauthorized - Please login first");
  }

  return authData;
};

/**
 *  Function that checks if user has valid session and applies rate limiting
 * @param req
 * @param handler
 * @param limit Optional custom rate limit (requests per minute). Defaults to 60.
 * @returns
 */
export const withAuth = async (
  req: NextRequest,
  handler: (
    req: NextRequest,
    authData: { user: User; session: Session },
  ) => Promise<NextResponse>,
  limit: number = 60,
) => {
  try {
    const authData = await validate(req);

    // Apply rate limiting based on the user's ID and the specific API path
    const rateLimitId = `${authData.user.id}:${req.nextUrl.pathname}`;
    const { success } = await checkRateLimit(rateLimitId, limit);
    if (!success) {
      return ApiError("Too many requests. Please try again later.", 429);
    }

    return await handler(req, authData);
  } catch (error) {
    logger.warn("Authentication failed in API route", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    return ApiError("Unauthorized", 401);
  }
};
