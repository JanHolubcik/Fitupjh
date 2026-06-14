import { FoodClass } from "@/models/Food";
import { activityLevel } from "@/models/users";

export type ReturnTypeFood =
  | (FoodClass & { originalName?: string })[]
  | undefined;

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
  originalName?: string;
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

export const ACTIVITY_MULTIPLIERS: Record<activityLevel, number> = {
  sedatory: 1.2,
  lightlyActive: 1.375,
  mediumActive: 1.55,
  highlyActive: 1.725,
};

export const GOAL_MULTIPLIERS: Record<string, number> = {
  loseWeight: 0.85,
  gainWeight: 1.0,
  maintainWeight: 1.15,
};

export type SavedFoodMonth = Record<string, FoodType>;

export const timeOfDay = ["breakfast", "lunch", "dinner"] as const;
//as const freezes the array so i cannot push anything to it

export type timeOfDayNumber = (typeof timeOfDay)[number];
//type timeOfDay = "breakfast" | "lunch" | "dinner";
