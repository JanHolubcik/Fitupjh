import { describe, it, expect, vi, beforeEach } from "vitest";
import { withAuth } from "./functions";
import { NextRequest, NextResponse } from "next/server";

const { mocks } = vi.hoisted(() => ({
  mocks: {
    mockGetSession: vi.fn(),
    mockCheckRateLimit: vi.fn(),
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

vi.mock("@/lib/ratelimit", () => ({
  checkRateLimit: (id: string, limit: number) =>
    mocks.mockCheckRateLimit(id, limit),
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("withAuth API Wrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (path: string = "/api/test") => {
    return new NextRequest(`http://localhost${path}`);
  };

  it("should return 401 Unauthorized when session is missing", async () => {
    mocks.mockGetSession.mockResolvedValue(null);

    const handler = vi.fn().mockResolvedValue(new NextResponse("success"));
    const req = createRequest();
    const response = await withAuth(req, handler);

    expect(response.status).toBe(401);
    const body = (await response.json()) as { success: false; error: string };
    expect(body).toEqual({ success: false, error: "Unauthorized" });
    expect(handler).not.toHaveBeenCalled();
  });

  it("should return 429 Too Many Requests when rate limit is exceeded", async () => {
    mocks.mockGetSession.mockResolvedValue({
      user: { id: "user-123" },
      session: { id: "session-123" },
    });
    mocks.mockCheckRateLimit.mockResolvedValue({ success: false });

    const handler = vi.fn().mockResolvedValue(new NextResponse("success"));
    const req = createRequest();
    const response = await withAuth(req, handler);

    expect(response.status).toBe(429);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toContain("Too many requests");
    expect(handler).not.toHaveBeenCalled();
    expect(mocks.mockCheckRateLimit).toHaveBeenCalledWith(
      "user-123:/api/test",
      60,
    );
  });

  it("should call the handler and return its response when authenticated and within rate limit", async () => {
    const mockUser = { id: "user-123" };
    const mockSession = { id: "session-123" };

    mocks.mockGetSession.mockResolvedValue({
      user: mockUser,
      session: mockSession,
    });
    mocks.mockCheckRateLimit.mockResolvedValue({ success: true });

    const handler = vi
      .fn()
      .mockResolvedValue(new NextResponse("handler-response", { status: 200 }));
    const req = createRequest();
    const response = await withAuth(req, handler, 30);

    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe("handler-response");
    expect(handler).toHaveBeenCalledWith(req, {
      user: mockUser,
      session: mockSession,
    });
    expect(mocks.mockCheckRateLimit).toHaveBeenCalledWith(
      "user-123:/api/test",
      30,
    );
  });
});
