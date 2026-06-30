import { z } from "zod";

export const FoodItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  originalName: z.string().optional(),
  calories: z.number().min(0, "Calories must be at least 0"),
  amount: z.string().min(1, "Amount is required"),
  fat: z.number().min(0, "Fat must be at least 0"),
  protein: z.number().min(0, "Protein must be at least 0"),
  sugar: z.number().min(0, "Sugar must be at least 0"),
  carbohydrates: z.number().min(0, "Carbohydrates must be at least 0"),
  fiber: z.number().min(0, "Fiber must be at least 0"),
  salt: z.number().min(0, "Salt must be at least 0"),
  imgUrl: z.string().optional(),
});

export const SaveFoodSchema = z.object({
  date: z.string().refine(
    (val) => {
      const dateParsed = Date.parse(val);
      return !isNaN(dateParsed);
    },
    { message: "Invalid date format" }
  ),
  savedFood: z.object({
    breakfast: z.array(FoodItemSchema),
    lunch: z.array(FoodItemSchema),
    dinner: z.array(FoodItemSchema),
  }),
});

export type SaveFoodInput = z.infer<typeof SaveFoodSchema>;
export type FoodItemInput = z.infer<typeof FoodItemSchema>;
