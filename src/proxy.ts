import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { createProxy } from "next-i18next/proxy";
import i18nConfig from "./i18n.config";

const i18nProxy = createProxy(i18nConfig);

const notLoggedInProtectedRoutes = ["/dashboard", "/profile"];

const LoggedInProtectedRoutes = ["/login", "/signup"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isNotLoggedInProtected = notLoggedInProtectedRoutes.some(
    (route) =>
      pathname.startsWith(route) ||
      pathname.match(new RegExp(`^/[^/]+${route}`)),
  );

  const isLoggedInProtectedRoutes = LoggedInProtectedRoutes.some(
    (route) =>
      pathname.startsWith(route) ||
      pathname.match(new RegExp(`^/[^/]+${route}`)),
  );

  if (isNotLoggedInProtected) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (isLoggedInProtectedRoutes) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (token) {
      const signInUrl = new URL("/dashboard", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return i18nProxy(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
  ],
};
