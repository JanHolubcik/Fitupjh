export type foodType = {
  breakfast: food;
  lunch: food;
  dinner: food;
};

export type food = {
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
}[];

export type macros = {
  calories: number;
  fat: number;
  protein: number;
  sugar: number;
  carbohydrates: number;
  fiber: number;
  salt: number;
};
