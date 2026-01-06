import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { SavedFoodClass } from "@/models/savedFood";
import { foodType } from "@/types/Types";

const initialState: SavedFoodClass[] = [];

const savedFoodSlice = createSlice({
  initialState,
  name: "savedFood",
  reducers: {
    setSavedFoodMonth: (state, action: PayloadAction<SavedFoodClass[]>) => {
      state.length = 0; // empty current array
      console.log("Setting saved food month:", action.payload);
      state.push(...action.payload); // add new items
    },
  },
});

export const { setSavedFoodMonth } = savedFoodSlice.actions;

export const selectSavedFood = (state: { savedFood: SavedFoodClass[] }) =>
  state.savedFood;

export default savedFoodSlice.reducer;
