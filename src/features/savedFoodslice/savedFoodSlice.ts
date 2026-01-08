// features/savedFoodSlice/savedFoodSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";
import { Food, FoodType, foodType, SavedFoodMonth } from "@/types/Types";
import { format } from "date-fns";

type SavedFoodState = {
  currentDate: string; // yyyy-MM-dd
  month: SavedFoodMonth;
};

const emptyDay: FoodType = {
  breakfast: [],
  lunch: [],
  dinner: [],
};

const initialState: SavedFoodState = {
  currentDate: format(new Date(), "yyyy-MM-dd"),
  month: {},
};
const savedFoodSlice = createSlice({
  name: "savedFood",
  initialState,
  reducers: {
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
    },
    setSavedFoodMonth: (_state, action: PayloadAction<SavedFoodMonth>) => {
      return {
        currentDate: format(new Date(), "yyyy-MM-dd"),
        month: action.payload,
      };
    },

    addFoodForDate: (
      state,
      action: PayloadAction<{
        date: string;
        timeOfDay: keyof FoodType;
        food: Food;
      }>
    ) => {
      const { date, timeOfDay, food } = action.payload;

      // ensure date exists
      if (!state.month[date]) {
        state.month[date] = { ...emptyDay };
      }

      state.month[date][timeOfDay].push(food);
    },
    removeFromFood: (
      state,
      action: PayloadAction<{
        date: string;
        timeOfDay: keyof FoodType;
        id: number;
      }>
    ) => {
      const { date, timeOfDay, id } = action.payload;
      if (!state.month[date]) {
        state.month[date] = { ...emptyDay };
      }
      state.month[date][timeOfDay] = state.month[date][timeOfDay].filter(
        (foodItem) => foodItem.id !== id
      );
    },
  },
});

export const {
  setCurrentDate,
  setSavedFoodMonth,
  addFoodForDate,
  removeFromFood,
} = savedFoodSlice.actions;

export const selectSavedFoodByDate = (
  state: RootState,
  date: string
): FoodType => state.savedFood.month[date] ?? emptyDay;

export default savedFoodSlice.reducer;
