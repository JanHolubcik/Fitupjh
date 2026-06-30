import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, GET } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { addNewFood, getFood } from "@/lib/mongo/food-db";
import type { Session, User } from "better-auth";

// Mock withAuth to bypass auth and rate limiting
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
  addNewFood: vi.fn(),
  getFood: vi.fn(),
}));

type FoodTestInput = Record<
  string,
  string | number | boolean | null | undefined
>;

describe("POST /api/food", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: FoodTestInput) => {
    return new NextRequest("http://localhost/api/food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  it("should return 201 and the created food on success", async () => {
    const validFood: FoodTestInput = {
      name: "Apple",
      calories_per_100g: 52,
      protein: 0.3,
      fat: 0.2,
      sugar: 10,
      carbohydrates: 14,
      fiber: 2.4,
      salt: 0.1,
    };

    const createdFood = { ...validFood, id: "mocked-id" };
    vi.mocked(addNewFood).mockResolvedValue({
      success: true,
      data: createdFood,
    });

    const req = createRequest(validFood);
    const response = await POST(req);

    expect(response.status).toBe(201);
    const body = (await response.json()) as {
      success: boolean;
      data: typeof createdFood;
    };
    expect(body).toEqual({ success: true, data: createdFood });
    expect(addNewFood).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Apple",
        calories_per_100g: 52,
      }),
    );
  });

  it("should return 400 when validation fails (e.g. name too short)", async () => {
    const invalidFood: FoodTestInput = {
      name: "A",
      calories_per_100g: 52,
      protein: 1,
    };

    const req = createRequest(invalidFood);
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toContain("Food name must be at least 2 characters");
    expect(addNewFood).not.toHaveBeenCalled();
  });

  it("should return 400 when validation fails due to negative numbers", async () => {
    const invalidFood: FoodTestInput = {
      name: "Apple",
      calories_per_100g: -5, // Negative calories
      protein: -1, // Negative protein
      fat: 0,
    };

    const req = createRequest(invalidFood);
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.success).toBe(false);

    // Check that both calories and protein triggered validation errors
    expect(body.error).toContain("Calories must be greater than 0");
    expect(body.error).toContain("Too small: expected number to be >=0");
    expect(addNewFood).not.toHaveBeenCalled();
  });

  it("should return 400 when database insertion fails (e.g. duplicate food)", async () => {
    const validFood: FoodTestInput = {
      name: "Apple",
      calories_per_100g: 52,
      protein: 1,
    };

    vi.mocked(addNewFood).mockResolvedValue({
      success: false,
      error: "This food item already exists.",
    });

    const req = createRequest(validFood);
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body).toEqual({
      success: false,
      error: "This food item already exists.",
    });
  });

  it("should return 500 when database throws an error", async () => {
    const validFood: FoodTestInput = {
      name: "Apple",
      calories_per_100g: 52,
      protein: 1,
    };

    vi.mocked(addNewFood).mockRejectedValue(new Error("DB Connection Lost"));

    const req = createRequest(validFood);
    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = (await response.json()) as { success: false; error: string };
    expect(body).toEqual({
      success: false,
      error: "There was an error while sending data to db",
    });
  });

  it("should return 201 when optional/defaulted fields are omitted (undefined)", async () => {
    const foodOmittedFields: FoodTestInput = {
      name: "Apple",
      calories_per_100g: 52,
      protein: 1,
    };

    const expectedCreatedFood = {
      ...foodOmittedFields,
      fat: 0,
      sugar: 0,
      carbohydrates: 0,
      fiber: 0,
      salt: 0,
      id: "mocked-id",
    };

    vi.mocked(addNewFood).mockResolvedValue({ success: true, data: expectedCreatedFood });

    const req = createRequest(foodOmittedFields);
    const response = await POST(req);

    expect(response.status).toBe(201);
    const body = (await response.json()) as { success: boolean; data: typeof expectedCreatedFood };
    expect(body.success).toBe(true);
    expect(body.data).toEqual(expectedCreatedFood);
  });

  it("should return 400 when required fields are omitted (undefined) in the request", async () => {
    const foodMissingRequired: FoodTestInput = {
      protein: 1,
    };

    const req = createRequest(foodMissingRequired);
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toContain("received undefined");
    expect(body.error).toContain("received NaN");
  });
});

describe("GET /api/food", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 and foods on success with default query parameters", async () => {
    const mockFoods = [{ id: 1, name: "Apple", calories_per_100g: 52 }];
    vi.mocked(getFood).mockResolvedValue({ food: mockFoods as never });

    const req = new NextRequest("http://localhost/api/food");
    const response = await GET(req);

    expect(response.status).toBe(200);
    const body = (await response.json()) as { success: true; data: typeof mockFoods };
    expect(body).toEqual({ success: true, data: mockFoods });
    expect(getFood).toHaveBeenCalledWith("", "en");
  });

  it("should return 200 and search results when custom query parameters are provided", async () => {
    const mockFoods = [{ id: 2, name: "Jablko", calories_per_100g: 52 }];
    vi.mocked(getFood).mockResolvedValue({ food: mockFoods as never });

    const req = new NextRequest("http://localhost/api/food?searchTerm=Apple&currentLocale=sk");
    const response = await GET(req);

    expect(response.status).toBe(200);
    const body = (await response.json()) as { success: true; data: typeof mockFoods };
    expect(body).toEqual({ success: true, data: mockFoods });
    expect(getFood).toHaveBeenCalledWith("Apple", "sk");
  });

  it("should safely handle and pass special regex characters to the database helper", async () => {
    vi.mocked(getFood).mockResolvedValue({ food: [] });

    // Query containing all regex special characters
    const specialCharsPattern = ".*+?^${}()|[]\\";
    const req = new NextRequest(`http://localhost/api/food?searchTerm=${encodeURIComponent(specialCharsPattern)}`);
    const response = await GET(req);

    expect(response.status).toBe(200);
    expect(getFood).toHaveBeenCalledWith(specialCharsPattern, "en");
  });

  it("should return 500 when database search fails", async () => {
    vi.mocked(getFood).mockRejectedValue(new Error("Database connection timed out"));

    const req = new NextRequest("http://localhost/api/food?searchTerm=Apple");
    const response = await GET(req);

    expect(response.status).toBe(500);
    const body = (await response.json()) as { success: false; error: string };
    expect(body).toEqual({
      success: false,
      error: "There was an error while sending data to db",
    });
  });
});
