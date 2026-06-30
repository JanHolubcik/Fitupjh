import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { saveActivitiesInDay } from "@/lib/mongo/activity-db";
import type { Session, User } from "better-auth";

// Mock withAuth to bypass auth
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

// Mock the database function
vi.mock("@/lib/mongo/activity-db", () => ({
  saveActivitiesInDay: vi.fn(),
  checkForSavedActivities: vi.fn(),
}));

type TestLoggedActivity = {
  id?: string | number | null;
  activity?: string | null;
  durationMinutes?: number | null;
  caloriesBurned?: number | null;
};

type TestSaveActivityInput = {
  date?: string | null;
  activities?: TestLoggedActivity[] | null;
};

describe("POST /api/savedActivity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: TestSaveActivityInput) => {
    return new NextRequest("http://localhost/api/savedActivity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  it("should return 201 when saving valid activities data", async () => {
    const validPayload: TestSaveActivityInput = {
      date: "2026-06-30",
      activities: [
        {
          id: 1,
          activity: "Running",
          durationMinutes: 30,
          caloriesBurned: 300,
        },
      ],
    };

    vi.mocked(saveActivitiesInDay).mockResolvedValue({} as never);

    const req = createRequest(validPayload);
    const response = await POST(req);

    expect(response.status).toBe(201);
    const body = (await response.json()) as { success: boolean; data: string };
    expect(body).toEqual({ success: true, data: "Successfully saved to db" });
    expect(saveActivitiesInDay).toHaveBeenCalledWith(
      "2026-06-30",
      expect.arrayContaining([
        expect.objectContaining({ activity: "Running" }),
      ]),
      "test-user-id"
    );
  });

  it("should return 201 when removing values (empty activities array)", async () => {
    const emptyPayload: TestSaveActivityInput = {
      date: "2026-06-30",
      activities: [],
    };

    vi.mocked(saveActivitiesInDay).mockResolvedValue({} as never);

    const req = createRequest(emptyPayload);
    const response = await POST(req);

    expect(response.status).toBe(201);
    expect(saveActivitiesInDay).toHaveBeenCalledWith(
      "2026-06-30",
      [],
      "test-user-id"
    );
  });

  it("should return 400 when activity metrics contain negative values", async () => {
    const invalidPayload: TestSaveActivityInput = {
      date: "2026-06-30",
      activities: [
        {
          id: 1,
          activity: "Running",
          durationMinutes: -10, // Negative duration
          caloriesBurned: -100, // Negative calories
        },
      ],
    };

    const req = createRequest(invalidPayload);
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toContain("Duration must be at least 0");
    expect(body.error).toContain("Calories burned must be at least 0");
    expect(saveActivitiesInDay).not.toHaveBeenCalled();
  });

  it("should return 400 when required fields are null", async () => {
    const invalidPayload: TestSaveActivityInput = {
      date: "2026-06-30",
      activities: [
        {
          id: null, // Should be string or number
          activity: null, // Should be string
          durationMinutes: null, // Should be number
          caloriesBurned: 300,
        },
      ],
    };

    const req = createRequest(invalidPayload);
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toContain("expected string, received null");
    expect(body.error).toContain("expected number, received null");
    expect(saveActivitiesInDay).not.toHaveBeenCalled();
  });

  it("should return 400 when required fields are missing (undefined)", async () => {
    const invalidPayload: TestSaveActivityInput = {
      date: "2026-06-30",
      activities: [
        {
          // id is missing
          // activity is missing
          durationMinutes: 30,
          caloriesBurned: 300,
        },
      ],
    };

    const req = createRequest(invalidPayload);
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toContain("expected string, received undefined");
    expect(saveActivitiesInDay).not.toHaveBeenCalled();
  });

  it("should return 400 when date format is invalid", async () => {
    const invalidPayload: TestSaveActivityInput = {
      date: "2026/06/30", // Invalid format (should be yyyy-MM-dd)
      activities: [],
    };

    const req = createRequest(invalidPayload);
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toContain("Invalid date format");
    expect(saveActivitiesInDay).not.toHaveBeenCalled();
  });
});
