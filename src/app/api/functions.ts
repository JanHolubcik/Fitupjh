import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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
 *  Function that checks if user has valid session
 * @param req
 * @param handler
 * @returns
 */
export const withAuth = async (
  req: NextRequest,
  handler: (
    req: NextRequest,
    authData: { user: User; session: Session },
  ) => Promise<NextResponse>,
) => {
  try {
    const authData = await validate(req);
    return await handler(req, authData);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 },
    );
  }
};
