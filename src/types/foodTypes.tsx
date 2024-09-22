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
}[];
