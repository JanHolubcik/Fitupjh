import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createProxy } from "next-i18next/proxy";
import i18nConfig from "./i18n.config";
import { auth } from "@/lib/auth"; // Import your Better Auth instance

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

  if (!isNotLoggedInProtected && !isLoggedInProtectedRoutes) {
    return i18nProxy(req);
  }

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const isAuthenticated = !!session?.user;

  if (isNotLoggedInProtected && !isAuthenticated) {
    const signInUrl = new URL("/login", req.url);

    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isLoggedInProtectedRoutes && isAuthenticated) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (session && !session.user.weight) {
    const onboarding = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboarding);
  }

  return i18nProxy(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
  ],
};
