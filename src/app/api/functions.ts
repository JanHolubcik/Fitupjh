import { getToken, JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ApolloServer, BaseContext, ContextFunction } from "@apollo/server";
import { NextApiRequest, NextApiResponse } from "next";

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
        token = verified.payload as any;
      } catch (error) {
        throw new Error("Invalid or expired token");
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

type HandlerRequest = NextApiRequest | NextRequest | Request;
interface Options<Req extends HandlerRequest, Context extends BaseContext> {
  context?: ContextFunction<
    [Req, Req extends NextApiRequest ? NextApiResponse : undefined],
    Context
  >;
}
declare function startServerAndCreateNextHandlerCustom<
  Req extends HandlerRequest = NextApiRequest,
  Context extends BaseContext = object,
>(
  server: ApolloServer<Context>,
  options?: Options<Req, Context>,
): {
  <HandlerReq extends NextApiRequest>(
    req: HandlerReq,
    res: NextApiResponse,
  ): NextResponse<unknown>;
  <HandlerReq extends NextRequest | Request>(
    req: HandlerReq,
    res?: undefined,
  ): NextResponse<Response>;
};
export { startServerAndCreateNextHandlerCustom };
