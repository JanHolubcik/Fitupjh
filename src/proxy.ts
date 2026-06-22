import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createProxy } from "next-i18next/proxy";
import i18nConfig from "./i18n.config";
import { auth } from "@/lib/auth";

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

  const isRootPath =
    pathname === "/" || /^\/[a-zA-Z]{2}(-[a-zA-Z]{2})?(\/)?$/.test(pathname);

  if (!isNotLoggedInProtected && !isLoggedInProtectedRoutes && !isRootPath) {
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

  if (isRootPath && isAuthenticated) {
    if (!session.user.weight && !session.user.height) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (session && !session.user.weight && !session.user.height) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  return i18nProxy(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|sw.js|site.webmanifest).*)",
  ],
};
