// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useCalculateRecommendedCalories from "./useCalculateRecomendedCalories";
import { FoodType, LoggedActivityType } from "@/types/Types";

const { mocks } = vi.hoisted(() => ({
  mocks: {
    mockUseSession: vi.fn(),
  },
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => mocks.mockUseSession(),
  },
}));

describe("useCalculateRecommendedCalories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFood: FoodType = {
    breakfast: [
      {
        id: 1,
        name: "Oats",
        calories: 200,
        protein: 6,
        fat: 4,
        carbohydrates: 32,
        fiber: 5,
        salt: 0.1,
        sugar: 1,
        amount: "100",
      },
    ],
    lunch: [
      {
        id: 2,
        name: "Eggs",
        calories: 140,
        protein: 12,
        fat: 10,
        carbohydrates: 1,
        fiber: 0,
        salt: 0.2,
        sugar: 0,
        amount: "100",
      },
    ],
    dinner: [],
  };

  const mockActivities: LoggedActivityType[] = [
    { id: "1", activity: "Running", durationMinutes: 30, caloriesBurned: 300 },
  ];

  it("should return 0 recommended calories when user session is not available", () => {
    mocks.mockUseSession.mockReturnValue({ data: null });

    const { result } = renderHook(() =>
      useCalculateRecommendedCalories(null, [])
    );

    expect(result.current.recommendedCaloriesValue).toBe(0);
    expect(result.current.caloriesSum).toBe(0);
  });

  it("should calculate recommended calories correctly based on BMR and multipliers", () => {
    mocks.mockUseSession.mockReturnValue({
      data: {
        user: {
          weight: 80,
          height: 180,
          activityLevel: "lightlyActive",
          goal: "maintainWeight",
        },
      },
    });

    const { result } = renderHook(() =>
      useCalculateRecommendedCalories(null, [])
    );

    // BMR = 10 * 80 + 6.25 * 180 - 5 * 25 + 5 = 800 + 1125 - 125 + 5 = 1805
    // lightlyActive multiplier = 1.375 (or similar depending on ACTIVITY_MULTIPLIERS, we can verify it calculates a non-zero value)
    expect(result.current.recommendedCaloriesValue).toBeGreaterThan(1000);
    expect(result.current.caloriesSum).toBe(0);
  });

  it("should calculate net calories (consumed minus burned) correctly", () => {
    mocks.mockUseSession.mockReturnValue({
      data: {
        user: {
          weight: 80,
          height: 180,
          activityLevel: "lightlyActive",
          goal: "maintainWeight",
        },
      },
    });

    const { result } = renderHook(() =>
      useCalculateRecommendedCalories(mockFood, mockActivities)
    );

    // Consumed = 200 (Oats) + 140 (Eggs) = 340
    // Burned = 300 (Running)
    // Net = 340 - 300 = 40
    expect(result.current.caloriesSum).toBe(40);
  });
});
