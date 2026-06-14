import { z } from "zod";

export const updateUserSchema = z.object({
  weight: z.coerce.number().min(50).max(300).optional(),
  weightGoal: z.coerce.number().min(50).max(300).optional(),
  height: z.coerce.number().min(50).max(300).optional(),
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
