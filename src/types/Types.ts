import { FoodClass } from "@/models/Food";

export type ReturnTypeFood = FoodClass[] | undefined;

export type macros = {
  calories: number;
  fat: number;
  protein: number;
  sugar: number;
  carbohydrates: number;
  fiber: number;
  salt: number;
};

export type macrosCapital = {
  CALORIES: number;
  FAT: number;
  PROTEIN: number;
  SUGAR: number;
  CARBOHYDRATES: number;
  FIBER: number;
  SALT: number;
};

export type Food = {
  id: number;
  name: string;
  calories: number;
  amount: string;
  fat: number;
  protein: number;
  sugar: number;
  carbohydrates: number;
  fiber: number;
  salt: number;
  imgUrl?: string;
};

export type FoodType = {
  breakfast: Food[];
  lunch: Food[];
  dinner: Food[];
};

export type SavedFoodMonth = Record<string, FoodType>;

export const timeOfDay = ["breakfast", "lunch", "dinner"] as const;
//as const freezes the array so i cannot push anything to it

export type timeOfDayNumber = (typeof timeOfDay)[number];
//type timeOfDay = "breakfast" | "lunch" | "dinner";
