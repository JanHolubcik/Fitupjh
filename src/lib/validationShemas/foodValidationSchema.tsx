import { z } from "zod"

export const FoodSchema = z.object({
  name: z.string().min(2, "Food name must be at least 2 characters"),
  calories_per_100g: z.coerce.number().gt(0, "Calories must be greater than 0"),
  fat: z.coerce.number().min(0).default(0),
  protein: z.coerce.number().min(0).default(0),
  sugar: z.coerce.number().min(0).default(0),
  carbohydrates: z.coerce.number().min(0).default(0),
  fiber: z.coerce.number().min(0).default(0),
  salt: z.coerce.number().min(0).default(0),
}).refine((data) => {
  const macros = [data.protein, data.sugar, data.fat, data.carbohydrates, data.salt, data.fiber];
  return macros.some(val => val > 0);
}, {
  message: "At least one nutrient must be greater than zero",
  path: ["protein"] 
});

export type FoodInput = z.infer<typeof FoodSchema>;