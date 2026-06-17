"use client";
import { format } from "date-fns";

import { calculateRecommendedMacros } from "../app/[lng]/constants/FunctionsHelper";

import { SavedFoodClass } from "@/lib/mongo/models/SavedFood";
import { Food, FoodType, SavedFoodMonth } from "@/types/Types";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { authClient } from "@/lib/auth-client";
const calculateAverage = (array: number[]) => {
  if (array.length === 0) return 0;

  const total = array.reduce((sum, value) => {
    return sum + value;
  }, 0);

  return total / array.length;
};

export type SavedFoodEntry = {
  day: string;
  savedFood: FoodType;
};
type ClientSavedFood = Omit<SavedFoodClass, "user_id">;

function transformReduxToApi(month: SavedFoodMonth): ClientSavedFood[] {
  return Object.entries(month).map(([dateKey, foodType]) => ({
    day: dateKey,
    savedFood: foodType,
  }));
}

const useMacros = () => {
  const date = format(new Date(), "yyyy-MM-dd");
  const { data } = authClient.useSession();

  const reduxSavedFood = useSelector((state: RootState) => state.savedFood);

  const savedFood = transformReduxToApi(reduxSavedFood.month);

  const isArray = Array.isArray(savedFood);
  const isEmpty = !isArray || savedFood.length === 0;

  const sortedFood = savedFood;

  const labels = isEmpty
    ? []
    : sortedFood.map((item) => {
        const dateObj = item.day;
        // "EEE" outputs Mon, Tue, Wed...
        // "dd-MM" outputs 30-04, 01-05...
        return dateObj;
      });

  const RecommendedMacros = data?.user
    ? calculateRecommendedMacros(
        data?.user?.weight ? data?.user?.weight : 0,
        data?.user?.height ? data?.user?.height : 0,
      )
    : {
        calories: 0,
        fat: 0,
        protein: 0,
        sugar: 0,
        carbohydrates: 0,
        fiber: 0,
        salt: 0,
      };

  const dataMacros = isEmpty
    ? []
    : sortedFood.map((item) => {
        const meals = ["breakfast", "lunch", "dinner"] as const;
        const total = {
          calories: 0,
          fat: 0,
          protein: 0,
          sugar: 0,
          carbohydrates: 0,
          fiber: 0,
          salt: 0,
        };
        meals.forEach((meal) => {
          item.savedFood[meal]?.forEach((food: Food) => {
            total.calories += food.calories;
            total.fat += food.fat;
            total.protein += food.protein;
            total.sugar += food.sugar;
            total.carbohydrates += food.carbohydrates;
            total.fiber += food.fiber;
            total.salt += food.salt;
          });
        });
        return total;
      });

  const dataProtein = isEmpty ? [] : dataMacros.map((m) => m.protein);
  const dataFat = isEmpty ? [] : dataMacros.map((m) => m.fat);
  const dataCalories = isEmpty ? [] : dataMacros.map((m) => m.calories);
  const dataSugar = isEmpty ? [] : dataMacros.map((m) => m.sugar);
  const dataFiber = isEmpty ? [] : dataMacros.map((m) => m.fiber);
  const dataCarbohydrates = isEmpty
    ? []
    : dataMacros.map((m) => m.carbohydrates);

  const CurrentDailyIntake = {
    calories: calculateAverage(dataCalories),
    protein: calculateAverage(dataProtein),
    fat: calculateAverage(dataFat),
    sugar: calculateAverage(dataSugar),
    carbohydrates: calculateAverage(dataCarbohydrates),
    fiber: calculateAverage(dataFiber),
  };

  const macroDatasets = {
    protein: dataProtein,
    fat: dataFat,
    calories: dataCalories,
    sugar: dataSugar,
    carbohydrates: dataCarbohydrates,
    fiber: dataFiber,
  };

  return {
    macroDatasets,
    CurrentDailyIntake,
    dataMacros: isEmpty ? [] : dataMacros,
    labels,
    RecommendedMacros,
  };
};

export default useMacros;
