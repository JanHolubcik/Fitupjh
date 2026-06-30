import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  calculateRecommendedMacros,
  adjustMacrosWithBurnedCalories,
  calculateCaloriesSum,
  calculateActivities,
  getTimeOfDay,
  capitalizeFirstLetter,
} from "./FunctionsHelper";
import { FoodType, LoggedActivityType } from "@/types/Types";

describe("FunctionsHelper", () => {
  describe("capitalizeFirstLetter", () => {
    it("should capitalize the first letter of a string", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
      expect(capitalizeFirstLetter("world")).toBe("World");
      expect(capitalizeFirstLetter("a")).toBe("A");
    });
  });

  describe("calculateRecommendedMacros", () => {
    it("should calculate correct baseline macros with default parameters", () => {
      const result = calculateRecommendedMacros();
      expect(result.calories).toBeGreaterThan(0);
      expect(result.protein).toBe(84); // 1.2 * 70
      expect(result.fiber).toBe(38);
      expect(result.salt).toBe(2.3);
      expect(result.fat).toBeDefined();
      expect(result.carbohydrates).toBeDefined();
      expect(result.sugar).toBeDefined();
    });

    it("should calculate different macros for different weights and heights", () => {
      const result1 = calculateRecommendedMacros(60, 160, 1.2, 1);
      const result2 = calculateRecommendedMacros(90, 190, 1.2, 1);

      expect(result2.calories).toBeGreaterThan(result1.calories);
      expect(result2.protein).toBeGreaterThan(result1.protein);
    });

    it("should adjust macros based on lifestyle and goal coefficients", () => {
      const sedentaryMaintain = calculateRecommendedMacros(80, 180, 1.2, 1);
      const activeLose = calculateRecommendedMacros(80, 180, 1.55, 0.85);

      // Active but losing weight might have different calorie target
      expect(sedentaryMaintain.calories).not.toBe(activeLose.calories);
    });
  });

  describe("adjustMacrosWithBurnedCalories", () => {
    const baseline = {
      calories: 2000,
      protein: 100,
      carbohydrates: 250,
      fat: 60,
      fiber: 38,
      salt: 2.3,
      sugar: 50,
    };

    it("should return baseline macros when burned calories is 0", () => {
      const result = adjustMacrosWithBurnedCalories(baseline, 0);
      expect(result).toEqual(baseline);
    });

    it("should return baseline macros when baseline calories is 0", () => {
      const zeroBaseline = { ...baseline, calories: 0 };
      const result = adjustMacrosWithBurnedCalories(zeroBaseline, 500);
      expect(result).toEqual(zeroBaseline);
    });

    it("should proportionally increase calories, protein, carbs, and fat", () => {
      // With 500 burned calories, targets should increase
      const result = adjustMacrosWithBurnedCalories(baseline, 500);

      expect(result.calories).toBe(2500);
      expect(result.protein).toBeGreaterThan(baseline.protein);
      expect(result.carbohydrates).toBeGreaterThan(baseline.carbohydrates);
      expect(result.fat).toBeGreaterThan(baseline.fat);

      // Fiber, salt, sugar should remain unchanged
      expect(result.fiber).toBe(baseline.fiber);
      expect(result.salt).toBe(baseline.salt);
      expect(result.sugar).toBe(baseline.sugar);
    });
  });

  describe("calculateCaloriesSum", () => {
    it("should sum calories correctly across all meals", () => {
      const mockSavedFood: FoodType = {
        breakfast: [
          {
            id: 1,
            name: "Apple",
            calories: 95,
            protein: 0.5,
            fat: 0.3,
            carbohydrates: 25,
            fiber: 4.4,
            salt: 0,
            sugar: 19,
            amount: "100",
          },
        ],
        lunch: [
          {
            id: 2,
            name: "Chicken Breast",
            calories: 165,
            protein: 31,
            fat: 3.6,
            carbohydrates: 0,
            fiber: 0,
            salt: 0.2,
            sugar: 0,
            amount: "100",
          },
        ],
        dinner: [],
      };

      const sum = calculateCaloriesSum(mockSavedFood);
      expect(sum).toBe(260); // 95 + 165
    });

    it("should return 0 when all meals are empty", () => {
      const mockSavedFood: FoodType = {
        breakfast: [],
        lunch: [],
        dinner: [],
      };
      expect(calculateCaloriesSum(mockSavedFood)).toBe(0);
    });
  });

  describe("calculateActivities", () => {
    it("should sum burned calories from all activities", () => {
      const activities: LoggedActivityType[] = [
        { id: "1", activity: "Running", durationMinutes: 30, caloriesBurned: 300 },
        { id: "2", activity: "Walking", durationMinutes: 20, caloriesBurned: 100 },
      ];

      expect(calculateActivities(activities)).toBe(400);
    });

    it("should return 0 when activities array is empty", () => {
      expect(calculateActivities([])).toBe(0);
    });
  });

  describe("getTimeOfDay", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return breakfast between 0:00 and 7:59", () => {
      vi.setSystemTime(new Date("2026-06-30T04:00:00"));
      expect(getTimeOfDay()).toBe("breakfast");
    });

    it("should return lunch between 8:00 and 15:59", () => {
      vi.setSystemTime(new Date("2026-06-30T12:00:00"));
      expect(getTimeOfDay()).toBe("lunch");
    });

    it("should return dinner between 16:00 and 23:59", () => {
      vi.setSystemTime(new Date("2026-06-30T20:00:00"));
      expect(getTimeOfDay()).toBe("dinner");
    });
  });
});
