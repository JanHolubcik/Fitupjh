import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { saveFoodInDay } from "@/lib/mongo/food-db";
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
vi.mock("@/lib/mongo/food-db", () => ({
  saveFoodInDay: vi.fn(),
  checkForSavedFood: vi.fn(),
}));

type TestFoodItem = {
  id?: number | null;
  name?: string | null;
  originalName?: string | null;
  calories?: number | null;
  amount?: string | null;
  fat?: number | null;
  protein?: number | null;
  sugar?: number | null;
  carbohydrates?: number | null;
  fiber?: number | null;
  salt?: number | null;
  imgUrl?: string | null;
};

type TestSaveFoodInput = {
  date?: string | null;
  savedFood?: {
    breakfast?: TestFoodItem[] | null;
    lunch?: TestFoodItem[] | null;
    dinner?: TestFoodItem[] | null;
  } | null;
};

describe("POST /api/saveFood", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: TestSaveFoodInput) => {
    return new NextRequest("http://localhost/api/saveFood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  it("should return 201 when saving valid food data", async () => {
    const validPayload: TestSaveFoodInput = {
      date: "2026-06-30",
      savedFood: {
        breakfast: [
          {
            id: 1,
            name: "Eggs",
            calories: 155,
            amount: "100g",
            fat: 11,
            protein: 13,
            sugar: 1.1,
            carbohydrates: 1.1,
            fiber: 0,
            salt: 0.3,
          },
        ],
        lunch: [],
        dinner: [],
      },
    };

    vi.mocked(saveFoodInDay).mockResolvedValue({} as never);

    const req = createRequest(validPayload);
    const response = await POST(req);

    expect(response.status).toBe(201);
    const body = (await response.json()) as { success: boolean; data: string };
    expect(body).toEqual({ success: true, data: "Successfully saved to db" });
    expect(saveFoodInDay).toHaveBeenCalledWith(
      "2026-06-30",
      expect.objectContaining({
        breakfast: expect.arrayContaining([
          expect.objectContaining({ name: "Eggs" }),
        ]),
      }),
      "test-user-id"
    );
  });

  it("should return 201 when removing values (empty meal arrays)", async () => {
    const emptyPayload: TestSaveFoodInput = {
      date: "2026-06-30",
      savedFood: {
        breakfast: [],
        lunch: [],
        dinner: [],
      },
    };

    vi.mocked(saveFoodInDay).mockResolvedValue({} as never);

    const req = createRequest(emptyPayload);
    const response = await POST(req);

    expect(response.status).toBe(201);
    expect(saveFoodInDay).toHaveBeenCalledWith(
      "2026-06-30",
      {
        breakfast: [],
        lunch: [],
        dinner: [],
      },
      "test-user-id"
    );
  });

  it("should return 400 when macros contain negative values", async () => {
    const invalidPayload: TestSaveFoodInput = {
      date: "2026-06-30",
      savedFood: {
        breakfast: [
          {
            id: 1,
            name: "Eggs",
            calories: -100, // Negative calories
            amount: "100g",
            fat: -5, // Negative fat
            protein: 13,
            sugar: 0,
            carbohydrates: 0,
            fiber: 0,
            salt: 0,
          },
        ],
        lunch: [],
        dinner: [],
      },
    };

    const req = createRequest(invalidPayload);
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toContain("Calories must be at least 0");
    expect(body.error).toContain("Fat must be at least 0");
    expect(saveFoodInDay).not.toHaveBeenCalled();
  });

  it("should return 400 when required fields are null", async () => {
    const invalidPayload: TestSaveFoodInput = {
      date: "2026-06-30",
      savedFood: {
        breakfast: [
          {
            id: 1,
            name: null, // Should be string
            calories: 155,
            amount: "100g",
            fat: null, // Should be number
            protein: 13,
            sugar: 0,
            carbohydrates: 0,
            fiber: 0,
            salt: 0,
          },
        ],
        lunch: [],
        dinner: [],
      },
    };

    const req = createRequest(invalidPayload);
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toContain("expected string, received null");
    expect(body.error).toContain("expected number, received null");
    expect(saveFoodInDay).not.toHaveBeenCalled();
  });

  it("should return 400 when required fields are missing (undefined)", async () => {
    const invalidPayload: TestSaveFoodInput = {
      date: "2026-06-30",
      savedFood: {
        breakfast: [
          {
            id: 1,
            name: "Eggs",
            // calories is missing (undefined)
            // fat is missing (undefined)
            amount: "100g",
            protein: 13,
            sugar: 0,
            carbohydrates: 0,
            fiber: 0,
            salt: 0,
          },
        ],
        lunch: [],
        dinner: [],
      },
    };

    const req = createRequest(invalidPayload);
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toContain("expected number, received undefined");
    expect(saveFoodInDay).not.toHaveBeenCalled();
  });

  it("should return 400 when date is invalid", async () => {
    const invalidPayload: TestSaveFoodInput = {
      date: "invalid-date-string",
      savedFood: {
        breakfast: [],
        lunch: [],
        dinner: [],
      },
    };

    const req = createRequest(invalidPayload);
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toContain("Invalid date format");
    expect(saveFoodInDay).not.toHaveBeenCalled();
  });
});
