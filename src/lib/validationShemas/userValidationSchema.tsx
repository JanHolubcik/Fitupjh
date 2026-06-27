import { z } from "zod";

export const updateUserSchema = z.object({
  weight: z.coerce
    .number()
    .min(50, "validation.weightMin")
    .max(300, "validation.weightMax")
    .optional(),
  weightGoal: z.coerce
    .number()
    .min(50, "validation.weightGoalMin")
    .max(300, "validation.weightGoalMax")
    .optional(),
  height: z.coerce
    .number()
    .min(50, "validation.heightMin")
    .max(300, "validation.heightMax")
    .optional(),
  activityLevel: z
    .enum([
      "sedentary",
      "sedatory",
      "lightlyActive",
      "mediumActive",
      "highlyActive",
    ])
    .optional(),
  goal: z
    .enum(["loseWeight", "lose weight", "maintainWeight", "gainWeight"])
    .optional(),
  manualOverride: z.boolean().optional(),
  targetCalories: z.coerce.number().min(0).optional(),
  targetProtein: z.coerce.number().min(0).optional(),
  targetCarbs: z.coerce.number().min(0).optional(),
  targetFat: z.coerce.number().min(0).optional(),
  targetSugar: z.coerce.number().min(0).optional(),
});

export const onboardingSchema = z.object({
  goal: z.enum(["loseWeight", "maintainWeight", "gainWeight"]),
  weight: z.coerce.number().min(50).max(300),
  height: z.coerce.number().min(50).max(300),
  activityLevel: z.enum([
    "sedentary",
    "lightlyActive",
    "mediumActive",
    "highlyActive",
  ]),
});
