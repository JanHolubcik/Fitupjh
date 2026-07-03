import { z } from "zod";

export const FoodItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "validation.nameRequired"),
  originalName: z.string().optional(),
  calories: z.number().min(0, "validation.caloriesMin"),
  amount: z.string().min(1, "validation.amountRequired"),
  fat: z.number().min(0, "validation.fatMin"),
  protein: z.number().min(0, "validation.proteinMin"),
  sugar: z.number().min(0, "validation.sugarMin"),
  carbohydrates: z.number().min(0, "validation.carbohydratesMin"),
  fiber: z.number().min(0, "validation.fiberMin"),
  salt: z.number().min(0, "validation.saltMin"),
  imgUrl: z.string().optional(),
});

export const SaveFoodSchema = z.object({
  date: z.string().refine(
    (val) => {
      const dateParsed = Date.parse(val);
      return !isNaN(dateParsed);
    },
    { message: "validation.dateInvalid" }
  ),
  savedFood: z.object({
    breakfast: z.array(FoodItemSchema),
    lunch: z.array(FoodItemSchema),
    dinner: z.array(FoodItemSchema),
  }),
});

export type SaveFoodInput = z.infer<typeof SaveFoodSchema>;
export type FoodItemInput = z.infer<typeof FoodItemSchema>;
