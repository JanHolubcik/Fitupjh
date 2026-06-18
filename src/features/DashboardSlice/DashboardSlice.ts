import {
  createSlice,
  PayloadAction,
  ThunkAction,
  UnknownAction,
} from "@reduxjs/toolkit";

import { RootState } from "@/store/store";
import { Food, FoodType, SavedFoodMonth } from "@/types/Types";
import { format } from "date-fns";

export type LoggedActivityType = {
  id: string | number;
  activity: string;
  durationMinutes: number;
  caloriesBurned: number;
};

type SavedFoodState = {
  currentDate: string; // yyyy-MM-dd
  month: SavedFoodMonth;
  newFoodBarCode?: string;
  activityMonth: Record<string, LoggedActivityType[]>;
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

const emptyActivityFallback: LoggedActivityType[] = [];

const initialState: SavedFoodState = {
  currentDate: format(new Date(), "yyyy-MM-dd"),
  month: {},
  newFoodBarCode: "",
  activityMonth: {},
};

const savedFoodSlice = createSlice({
  name: "savedFood",
  initialState,
  reducers: {
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
    },
    setSavedFoodMonth: (state, action: PayloadAction<SavedFoodMonth>) => {
      state.currentDate = format(new Date(), "yyyy-MM-dd");
      state.month = action.payload;
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

      const foodArray = state.month[date][timeOfDay];
      const targetIndex = foodArray.findIndex((foodItem) => foodItem.id === id);

      if (targetIndex !== -1) {
        foodArray[targetIndex] = updatedFood;
      }
    },

    setSavedActivityMonth: (
      state,
      action: PayloadAction<Record<string, LoggedActivityType[]>>,
    ) => {
      state.activityMonth = action.payload;
    },
    addActivityForDate: (
      state,
      action: PayloadAction<{
        date: string;
        activity: LoggedActivityType;
      }>,
    ) => {
      const { date, activity } = action.payload;

      if (!state.activityMonth[date]) {
        state.activityMonth[date] = [];
      }

      state.activityMonth[date].push(activity);
    },
    removeActivity: (
      state,
      action: PayloadAction<{
        date: string;
        id: string | number;
      }>,
    ) => {
      const { date, id } = action.payload;
      if (!state.activityMonth[date]) {
        state.activityMonth[date] = [];
      }

      state.activityMonth[date] = state.activityMonth[date].filter(
        (activityItem) => activityItem.id !== id,
      );
    },
    editActivity: (
      state,
      action: PayloadAction<{
        date: string;
        id: string | number;
        updatedActivity: LoggedActivityType;
      }>,
    ) => {
      const { date, id, updatedActivity } = action.payload;

      if (!state.activityMonth[date]) {
        state.activityMonth[date] = [];
      }

      const activityArray = state.activityMonth[date];
      const targetIndex = activityArray.findIndex((item) => item.id === id);

      if (targetIndex !== -1) {
        activityArray[targetIndex] = updatedActivity;
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
  setSavedActivityMonth,
  addActivityForDate,
  removeActivity,
  editActivity,
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

export const editAndPersistActivity = (
  payload: {
    date: string;
    id: string | number;
    updatedActivity: LoggedActivityType;
  },
  saveFn: (state: any) => Promise<void>,
): ThunkAction<Promise<void>, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(editActivity(payload));
    const updatedState = getState().savedFood.activityMonth[payload.date];

    await saveFn(updatedState);
  };
};

export const selectSavedFoodByDate = (
  state: RootState,
  date: string,
): FoodType => state.savedFood.month[date] ?? emptyDayFallback;

export const selectSavedActivitiesByDate = (
  state: RootState,
  date: string,
): LoggedActivityType[] =>
  state.savedFood.activityMonth[date] ?? emptyActivityFallback;

export default savedFoodSlice.reducer;
