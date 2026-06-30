// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useTodayMacros from "./useTodayMacros";
import { FoodType, LoggedActivityType } from "@/types/Types";

const { mocks } = vi.hoisted(() => ({
  mocks: {
    mockUseYourIntakeOperations: vi.fn(),
    mockUseActivityOperations: vi.fn(),
    mockUseSession: vi.fn(),
  },
}));

vi.mock("@/hooks/useYourIntakeOperations", () => ({
  default: () => mocks.mockUseYourIntakeOperations(),
}));

vi.mock("@/hooks/useActivityOperations", () => ({
  default: () => mocks.mockUseActivityOperations(),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => mocks.mockUseSession(),
  },
}));

describe("useTodayMacros", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return default zeroed macros when user session is not available", () => {
    mocks.mockUseSession.mockReturnValue({ data: null });
    mocks.mockUseYourIntakeOperations.mockReturnValue({ savedFood: null });
    mocks.mockUseActivityOperations.mockReturnValue({ savedActivities: null });

    const { result } = renderHook(() => useTodayMacros());

    expect(result.current.recommendedMacros).toEqual({
      calories: 0,
      fat: 0,
      protein: 0,
      sugar: 0,
      carbohydrates: 0,
      fiber: 0,
      salt: 0,
    });
    expect(result.current.calculatedMacros).toEqual({
      calories: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      protein: 0,
      salt: 0,
      sugar: 0,
    });
    expect(result.current.burnedCalories).toBe(0);
  });

  it("should calculate recommended macros based on user profile when session is active", () => {
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
    mocks.mockUseYourIntakeOperations.mockReturnValue({ savedFood: null });
    mocks.mockUseActivityOperations.mockReturnValue({ savedActivities: [] });

    const { result } = renderHook(() => useTodayMacros());

    // Recommended macros should be calculated and non-zero
    expect(result.current.recommendedMacros.calories).toBeGreaterThan(0);
    expect(result.current.recommendedMacros.protein).toBe(96); // 1.2 * 80
    expect(result.current.calculatedMacros.calories).toBe(0);
    expect(result.current.burnedCalories).toBe(0);
  });

  it("should calculate consumed macros when food is logged", () => {
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

    const mockSavedFood: FoodType = {
      breakfast: [
        {
          id: 1,
          name: "Oatmeal",
          calories: 150,
          protein: 5,
          fat: 3,
          carbohydrates: 27,
          fiber: 4,
          salt: 0.1,
          sugar: 1,
          amount: "100",
        },
      ],
      lunch: [
        {
          id: 2,
          name: "Chicken Salad",
          calories: 350,
          protein: 30,
          fat: 15,
          carbohydrates: 10,
          fiber: 3,
          salt: 0.5,
          sugar: 2,
          amount: "100",
        },
      ],
      dinner: [],
    };

    mocks.mockUseYourIntakeOperations.mockReturnValue({ savedFood: mockSavedFood });
    mocks.mockUseActivityOperations.mockReturnValue({ savedActivities: [] });

    const { result } = renderHook(() => useTodayMacros());

    expect(result.current.calculatedMacros).toEqual({
      calories: 500, // 150 + 350
      protein: 35, // 5 + 30
      fat: 18, // 3 + 15
      carbohydrates: 37, // 27 + 10
      fiber: 7, // 4 + 3
      salt: 0.6, // 0.1 + 0.5
      sugar: 3, // 1 + 2
    });
  });

  it("should adjust recommended macros when activities are logged", () => {
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
    mocks.mockUseYourIntakeOperations.mockReturnValue({ savedFood: null });

    const mockActivities: LoggedActivityType[] = [
      { id: "1", activity: "Running", durationMinutes: 30, caloriesBurned: 300 },
      { id: "2", activity: "Swimming", durationMinutes: 30, caloriesBurned: 200 },
    ];
    mocks.mockUseActivityOperations.mockReturnValue({ savedActivities: mockActivities });

    const { result } = renderHook(() => useTodayMacros());

    expect(result.current.burnedCalories).toBe(500); // 300 + 200
    // Recommended calories should be baseline + 500
    const baselineRecommended = result.current.recommendedMacros;
    expect(baselineRecommended.calories).toBeGreaterThan(500);
  });
});
