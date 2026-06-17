import {
  createSlice,
  PayloadAction,
  ThunkAction,
  UnknownAction,
} from "@reduxjs/toolkit";

import { RootState } from "@/store/store";
import { Food, FoodType, SavedFoodMonth } from "@/types/Types";
import { format } from "date-fns";

type SavedFoodState = {
  currentDate: string; // yyyy-MM-dd
  month: SavedFoodMonth;
  newFoodBarCode?: string;
};

const getEmptyDay = (): FoodType => ({
  breakfast: [],
  lunch: [],
  dinner: [],
});

const emptyDayFallback: FoodType = {
  breakfast: [],
  lunch: [],
  dinner: [],
};

const initialState: SavedFoodState = {
  currentDate: format(new Date(), "yyyy-MM-dd"),
  month: {},
  newFoodBarCode: "",
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
      }>,
    ) => {
      const { date, timeOfDay, food } = action.payload;

      if (!state.month[date]) {
        state.month[date] = getEmptyDay();
      }

      state.month[date][timeOfDay].push(food);
    },
    setNewFoodBarCode: (state, action: PayloadAction<string>) => {
      state.newFoodBarCode = action.payload;
    },
    clearNewFoodBarCode: (state) => {
      state.newFoodBarCode = "";
    },
    removeFromFood: (
      state,
      action: PayloadAction<{
        date: string;
        timeOfDay: keyof FoodType;
        id: number;
      }>,
    ) => {
      const { date, timeOfDay, id } = action.payload;
      if (!state.month[date]) {
        state.month[date] = getEmptyDay();
      }
      state.month[date][timeOfDay] = state.month[date][timeOfDay].filter(
        (foodItem) => foodItem.id !== id,
      );
    },
    EditFood: (
      state,
      action: PayloadAction<{
        date: string;
        timeOfDay: keyof FoodType;
        id: number;
        updatedFood: Food;
      }>,
    ) => {
      const { date, timeOfDay, id, updatedFood } = action.payload;

      if (!state.month[date]) {
        state.month[date] = getEmptyDay();
      }

      // Replace old item value directly using its index reference
      const foodArray = state.month[date][timeOfDay];
      const targetIndex = foodArray.findIndex((foodItem) => foodItem.id === id);

      if (targetIndex !== -1) {
        foodArray[targetIndex] = updatedFood;
      }
    },
  },
});

export const {
  setCurrentDate,
  setSavedFoodMonth,
  addFoodForDate,
  removeFromFood,
  setNewFoodBarCode,
  clearNewFoodBarCode,
  EditFood,
} = savedFoodSlice.actions;

export const editAndPersistFood = (
  payload: {
    date: string;
    timeOfDay: keyof FoodType;
    id: number;
    updatedFood: Food;
  },
  saveFn: (state: any) => Promise<void>,
): ThunkAction<Promise<void>, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(EditFood(payload));
    const updatedState = getState().savedFood.month[payload.date];

    await saveFn(updatedState);
  };
};

export const selectSavedFoodByDate = (
  state: RootState,
  date: string,
): FoodType => state.savedFood.month[date] ?? emptyDayFallback;

export default savedFoodSlice.reducer;
