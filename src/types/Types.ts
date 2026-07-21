export type FoodClass = {
  _id?: string;
  id?: string;
  name: string;
  localizedNames?: Record<string, string>;
  calories_per_100g: number;
  fat: number;
  protein: number;
  sugar: number;
  carbohydrates: number;
  fiber: number;
  salt: number;
  ProductWeight?: number;
  QRcode?: string;
  imgUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ActivityClass = {
  _id: string;
  id?: string;
  name: string;
  localizedNames?: Record<string, string>;
  metValue: number;
  category?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SavedFoodClass = {
  _id?: string;
  day: string;
  savedFood?: FoodType;
  user_id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LoggedActivityType = {
  id: string | number;
  activity: string;
  durationMinutes: number;
  caloriesBurned: number;
};


export type ApiResponse<T = never> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type FoodInput = {
  name: string;
  calories_per_100g: number;
  fat: number;
  protein: number;
  sugar: number;
  carbohydrates: number;
  fiber: number;
  salt: number;
  barcode?: string;
  imgUrl?: string;
  ProductWeight?: number;
};


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

export const GOAL_MULTIPLIERS: Record<string, number> = {
  loseWeight: 0.85,
  gainWeight: 1.0,
  maintainWeight: 1.15,
};

export type activityLevel =
  | "sedatory"
  | "sedentary"
  | "lightlyActive"
  | "mediumActive"
  | "highlyActive";

export const ACTIVITY_MULTIPLIERS: Record<activityLevel, number> = {
  sedatory: 1.2,
  sedentary: 1.2,
  lightlyActive: 1.375,
  mediumActive: 1.55,
  highlyActive: 1.725,
};

export type SavedFoodMonth = Record<string, FoodType>;

export const timeOfDay = ["breakfast", "lunch", "dinner"] as const;
//as const freezes the array so i cannot push anything to it

export type TimeOfDay = (typeof timeOfDay)[number];
export type timeOfDayNumber = TimeOfDay;

export type AIFoodAnalysis = {
  isFood: boolean;
  error?: string;
  name?: string;
  calories_per_100g?: number;
  calories?: number;
  fat?: number;
  protein?: number;
  sugar?: number;
  carbohydrates?: number;
  fiber?: number;
  salt?: number;
  ProductWeight?: number;
  imgUrl?: string;
};

