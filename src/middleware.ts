import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const loggedInRoutes = ["/yourintake", "/profile", "/myprogress"];

  const loggedOutRoutes = ["/login", "/register"];

  if (loggedInRoutes.includes(req.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (loggedOutRoutes.includes(req.nextUrl.pathname) && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/yourintake", "/profile", "/myprogress", "/login", "/register"],
};
