import { getToken, JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
export const validateToken = async (req: NextRequest) => {
  let token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const tokenString = authHeader.substring(7);

      try {
        const secret = new TextEncoder().encode(
          process.env.NEXTAUTH_SECRET || "",
        );
        const verified = await jwtVerify(tokenString, secret);
        token = verified.payload as JWT;
      } catch (error) {
        throw new Error("Invalid or expired token" + error);
      }
    }
  }

  if (!token) {
    throw new Error("Unauthorized - Please login first");
  }

  return token;
};
/**
 *
 * @param req
 * @param handler
 * @returns
 */
export const withAuth = async (
  req: NextRequest,
  handler: (req: NextRequest, token: JWT) => Promise<NextResponse>,
) => {
  try {
    const token = await validateToken(req);
    return await handler(req, token);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 },
    );
  }
};

/**
 * Converts response into NextResponse to fit validation with JWT token.
 * @param server
 * @returns
 */
export const createApolloHandler = (server: ApolloServer) => {
  const handler = startServerAndCreateNextHandler(server);
  return async (req: NextRequest): Promise<NextResponse> => {
    const response = await handler(req);

    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
  };
};
