import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "@/features/counter/counterSlice";
import savedFoodReducer from "@/features/savedFoodslice/savedFoodSlice";

/*
Creating a Redux Store per Request
The first change is to move from defining store as a global or module-singleton variable,
 to defining a makeStore function that returns a new store for each request:
*/

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer, // ✅ include your slice here
      savedFood: savedFoodReducer,
    },
  });
};

/* 
Now we have a function, makeStore, 
that we can use to create a store instance per-request while retaining the strong type safety 
(if you choose to use TypeScript) that Redux Toolkit provides. 
We don't have a store variable exported, but we can infer the RootState and AppDispatch types from the return type of makeStore.
*/

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
