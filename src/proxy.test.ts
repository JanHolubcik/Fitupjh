import { describe, it, expect, vi, beforeEach } from "vitest";
import { proxy } from "./proxy";
import { NextRequest, NextResponse } from "next/server";

const { mocks } = vi.hoisted(() => ({
  mocks: {
    mockGetSession: vi.fn(),
    mockI18nProxy: vi.fn(),
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: (...args: [Record<string, string | undefined> | undefined]) =>
        mocks.mockGetSession(...args),
    },
  },
}));

vi.mock("next-i18next/proxy", () => ({
  createProxy: () => mocks.mockI18nProxy,
}));

describe("Proxy Route Middleware (regex routes)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (
    urlStr: string,
    headers: Record<string, string> = {},
  ) => {
    return new NextRequest(urlStr, {
      headers: new Headers(headers),
    });
  };

  it("should redirect unauthenticated users from protected routes (e.g., /dashboard) to /login", async () => {
    mocks.mockGetSession.mockResolvedValue(null);

    const req = createRequest("http://localhost/dashboard");
    const response = await proxy(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toContain("/login");
  });

  it("should redirect unauthenticated users from localized protected routes (e.g., /en/dashboard) to /login", async () => {
    mocks.mockGetSession.mockResolvedValue(null);

    const req = createRequest("http://localhost/en/dashboard");
    const response = await proxy(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toContain("/login");
  });

  it("should redirect authenticated users from login page to /dashboard", async () => {
    mocks.mockGetSession.mockResolvedValue({
      user: { id: "user-123", weight: 80, height: 180 },
    });

    const req = createRequest("http://localhost/login");
    const response = await proxy(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toContain("/dashboard");
  });

  it("should redirect authenticated users with incomplete onboarding to /onboarding", async () => {
    // User exists but has no weight/height set
    mocks.mockGetSession.mockResolvedValue({
      user: { id: "user-123", weight: null, height: null },
    });

    const req = createRequest("http://localhost/dashboard");
    const response = await proxy(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toContain("/onboarding");
  });

  it("should redirect authenticated users accessing root (/) to /dashboard if onboarding is complete", async () => {
    mocks.mockGetSession.mockResolvedValue({
      user: { id: "user-123", weight: 80, height: 180 },
    });

    const req = createRequest("http://localhost/");
    const response = await proxy(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toContain("/dashboard");
  });

  it("should redirect authenticated users accessing root (/) to /onboarding if onboarding is incomplete", async () => {
    mocks.mockGetSession.mockResolvedValue({
      user: { id: "user-123", weight: null, height: null },
    });

    const req = createRequest("http://localhost/");
    const response = await proxy(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toContain("/onboarding");
  });

  it("should forward public, unauthenticated routes to the i18n proxy", async () => {
    mocks.mockI18nProxy.mockResolvedValue(new NextResponse("i18n-proxied"));

    const req = createRequest("http://localhost/some-public-route");
    const response = await proxy(req);

    expect(mocks.mockI18nProxy).toHaveBeenCalledWith(req);
    const text = await response.text();
    expect(text).toBe("i18n-proxied");
  });
});
