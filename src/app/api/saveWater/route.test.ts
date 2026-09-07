import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { checkForSavedWater, saveWaterInDay } from "@/lib/mongo/water-db";
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
  saveWaterInDay: vi.fn(),
  checkForSavedWater: vi.fn(),
}));

type TestWaterEntry = {
  id?: string | number | null;
  amount?: number | null;
};

type TestSaveWaterInput = {
  date?: string | null;
  entries?: TestWaterEntry[] | null;
};

describe("POST /api/saveWater", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createPostRequest = (body: TestSaveWaterInput) => {
    return new NextRequest("http://localhost/api/saveWater", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  it("should return 201 when saving valid water entries", async () => {
    const validPayload: TestSaveWaterInput = {
      date: "2026-06-30",
      entries: [
        {
          id: "1",
          amount: 250,
        },
      ],
    };

    vi.mocked(saveWaterInDay).mockResolvedValue({} as never);

    const req = createPostRequest(validPayload);
    const response = await POST(req);

    expect(response.status).toBe(201);
    const body = (await response.json()) as { success: boolean; data: string };
    expect(body).toEqual({ success: true, data: "Successfully saved to db" });
    expect(saveWaterInDay).toHaveBeenCalledWith(
      "2026-06-30",
      expect.arrayContaining([
        expect.objectContaining({ amount: 250 }),
      ]),
      "test-user-id",
    );
  });

  it("should return 400 when amount is less than or equal to zero", async () => {
    const invalidPayload: TestSaveWaterInput = {
      date: "2026-06-30",
      entries: [
        {
          id: "1",
          amount: 0,
        },
      ],
    };

    const req = createPostRequest(invalidPayload);
    const response = await POST(req);

    expect(response.status).toBe(400);
    expect(saveWaterInDay).not.toHaveBeenCalled();
  });

  it("should return 400 when date format is invalid", async () => {
    const invalidPayload: TestSaveWaterInput = {
      date: "30-06-2026",
      entries: [],
    };

    const req = createPostRequest(invalidPayload);
    const response = await POST(req);

    expect(response.status).toBe(400);
    expect(saveWaterInDay).not.toHaveBeenCalled();
  });
});

describe("GET /api/saveWater", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return water entries for valid date", async () => {
    vi.mocked(checkForSavedWater).mockResolvedValue({
      entries: [
        {
          id: "1",
          amount: 250,
        },
      ],
    });

    const req = new NextRequest(
      "http://localhost/api/saveWater?date=2026-06-30",
    );
    const response = await GET(req);

    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      success: boolean;
      data: TestWaterEntry[];
    };
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(checkForSavedWater).toHaveBeenCalledWith(
      "2026-06-30",
      "test-user-id",
    );
  });

  it("should return 400 when date param is missing", async () => {
    const req = new NextRequest("http://localhost/api/saveWater");
    const response = await GET(req);

    expect(response.status).toBe(400);
    expect(checkForSavedWater).not.toHaveBeenCalled();
  });
});
