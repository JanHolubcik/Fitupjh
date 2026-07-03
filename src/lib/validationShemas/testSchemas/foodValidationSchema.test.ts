import { describe, it, expect } from "vitest";
import { FoodSchema } from "../foodValidationSchema";

describe("FoodSchema Validation", () => {
  it("should validate a valid food input successfully", () => {
    const validFood = {
      name: "Apple",
      calories_per_100g: 52,
      fat: 0.2,
      protein: 0.3,
      sugar: 10,
      carbohydrates: 14,
      fiber: 2.4,
      salt: 0.1,
      barcode: "123456789",
      imgUrl: "https://example.com/apple.jpg",
      ProductWeight: 150,
    };

    const result = FoodSchema.safeParse(validFood);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Apple");
      expect(result.data.calories_per_100g).toBe(52);
    }
  });

  it("should fail validation when name is too short", () => {
    const invalidFood = {
      name: "A",
      calories_per_100g: 52,
      protein: 1,
    };

    const result = FoodSchema.safeParse(invalidFood);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("name"));
      expect(issue?.message).toBe("validation.nameMinLength");
    }
  });

  it("should fail validation when calories are less than or equal to 0", () => {
    const invalidFood = {
      name: "Apple",
      calories_per_100g: 0,
      protein: 1,
    };

    const result = FoodSchema.safeParse(invalidFood);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) =>
        i.path.includes("calories_per_100g"),
      );
      expect(issue?.message).toBe("validation.caloriesGtZero");
    }
  });

  it("should fail validation when all nutrients are zero (refine block)", () => {
    const invalidFood = {
      name: "Water",
      calories_per_100g: 1,
      fat: 0,
      protein: 0,
      sugar: 0,
      carbohydrates: 0,
      fiber: 0,
      salt: 0,
    };

    const result = FoodSchema.safeParse(invalidFood);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(
        (i) => i.message === "validation.macroAtLeastOne",
      );
      expect(issue).toBeDefined();
    }
  });

  it("should succeed validation when at least one nutrient is greater than zero", () => {
    const validFood = {
      name: "Egg White",
      calories_per_100g: 52,
      fat: 0,
      protein: 11,
      sugar: 0,
      carbohydrates: 0,
      fiber: 0,
      salt: 0,
    };

    const result = FoodSchema.safeParse(validFood);
    expect(result.success).toBe(true);
  });

  it("should handle undefined values for optional/defaulted fields", () => {
    const foodWithUndefined = {
      name: "Apple",
      calories_per_100g: 52,
      protein: 1, // at least one nutrient must be > 0
      fat: undefined, // has .default(0)
      sugar: undefined, // has .default(0)
      carbohydrates: undefined, // has .default(0)
      fiber: undefined, // has .default(0)
      salt: undefined, // has .default(0)
      barcode: undefined, // has .optional()
      imgUrl: undefined, // has .optional()
      ProductWeight: undefined, // has .optional()
    };

    const result = FoodSchema.safeParse(foodWithUndefined);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fat).toBe(0); // defaulted to 0
      expect(result.data.sugar).toBe(0); // defaulted to 0
      expect(result.data.barcode).toBeUndefined(); // optional
    }
  });

  it("should fail validation when required fields are undefined", () => {
    const foodWithUndefinedRequired = {
      name: undefined, // required
      calories_per_100g: undefined, // required
      protein: 1,
    };

    const result = FoodSchema.safeParse(foodWithUndefinedRequired);
    expect(result.success).toBe(false);
    if (!result.success) {
      const hasNameError = result.error.issues.some((i) => i.path.includes("name"));
      const hasCaloriesError = result.error.issues.some((i) => i.path.includes("calories_per_100g"));
      expect(hasNameError).toBe(true);
      expect(hasCaloriesError).toBe(true);
    }
  });
});
