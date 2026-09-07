import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { checkForSavedWaterMonth } from "@/lib/mongo/water-db";
import type { Session, User } from "better-auth";

vi.mock("../functions", () => ({
  withAuth: vi.fn(
    (
      req: NextRequest,
      handler: (
        req: NextRequest,
        authData: { user: User; session: Session },
      ) => Promise<NextResponse>,
    ) => {
      return handler(req, {
        user: { id: "test-user-id" } as User,
        session: { id: "test-session-id" } as Session,
      });
    },
  ),
}));

vi.mock("@/lib/mongo/water-db", () => ({
  checkForSavedWaterMonth: vi.fn(),
}));

describe("GET /api/lastMonthWater", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 with month water data when valid date range provided", async () => {
    const mockWaterMonth = {
      "2026-06-01": [
        {
          id: "1",
          amount: 250,
        },
      ],
      "2026-06-02": [],
    };

    vi.mocked(checkForSavedWaterMonth).mockResolvedValue(mockWaterMonth);

    const req = new NextRequest(
      "http://localhost/api/lastMonthWater?dateFrom=2026-06-01&dateTo=2026-06-02",
    );
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { success: boolean; data: typeof mockWaterMonth };
    expect(body.success).toBe(true);
    expect(body.data).toEqual(mockWaterMonth);
    expect(checkForSavedWaterMonth).toHaveBeenCalledWith(
      "2026-06-01",
      "2026-06-02",
      "test-user-id",
    );
  });

  it("should return 400 when dateFrom is missing", async () => {
    const req = new NextRequest(
      "http://localhost/api/lastMonthWater?dateTo=2026-06-02",
    );
    const res = await GET(req);

    expect(res.status).toBe(400);
    expect(checkForSavedWaterMonth).not.toHaveBeenCalled();
  });

  it("should return 400 when dateTo is missing", async () => {
    const req = new NextRequest(
      "http://localhost/api/lastMonthWater?dateFrom=2026-06-01",
    );
    const res = await GET(req);

    expect(res.status).toBe(400);
    expect(checkForSavedWaterMonth).not.toHaveBeenCalled();
  });
});
