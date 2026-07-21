"use client";

import { calculateRecommendedMacros } from "../app/[lng]/constants/FunctionsHelper";

import { SavedFoodClass } from "@/lib/mongo/models/SavedFood";
import {
  ACTIVITY_MULTIPLIERS,
  GOAL_MULTIPLIERS,
  Food,
  FoodType,
  SavedFoodMonth,
} from "@/types/Types";

import { authClient } from "@/lib/auth-client";
import { format, parseISO, subDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";

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
  const { data } = authClient.useSession();

  const dateTo = format(new Date(), "yyyy-MM-dd");
  const dateFrom = format(subDays(new Date(), 30), "yyyy-MM-dd");

  const { data: savedFoodMonth = {} } = useQuery(LastMonthFoodOptions(dateFrom, dateTo));

  const savedFood = transformReduxToApi(savedFoodMonth);

  const isArray = Array.isArray(savedFood);
  const isEmpty = !isArray || savedFood.length === 0;

  // Sort all days chronologically (keys are yyyy-MM-dd strings, so lexicographic sort works)
  const allSorted = [...savedFood].sort((a, b) => a.day.localeCompare(b.day));

  // Calculate calories per day so we can detect "empty" days
  const getTotalCalories = (entry: (typeof allSorted)[number]): number => {
    const meals = ["breakfast", "lunch", "dinner"] as const;
    return meals.reduce((sum, meal) => {
      return (
        sum +
        (entry.savedFood[meal]?.reduce(
          (s: number, f: Food) => s + f.calories,
          0,
        ) ?? 0)
      );
    }, 0);
  };

  // Find the first index that has at least some calories logged
  const firstNonZeroIdx = allSorted.findIndex(
    (entry) => getTotalCalories(entry) > 0,
  );

  const activeWindow =
    firstNonZeroIdx === -1 ? [] : allSorted.slice(firstNonZeroIdx);

  // Keep only the last 10 entries from the active window
  const sortedFood = activeWindow.slice(-10);

  const labels = isEmpty
    ? []
    : sortedFood.map((item) => format(parseISO(item.day), "d.M"));


  const activityKey = (data?.user?.activityLevel ||
    "lightlyActive") as keyof typeof ACTIVITY_MULTIPLIERS;
  const goalKey = (data?.user?.goal ||
    "maintainWeight") as keyof typeof GOAL_MULTIPLIERS;

  const RecommendedMacros = data?.user
    ? calculateRecommendedMacros(
        data?.user?.weight ? data?.user?.weight : 0,
        data?.user?.height ? data?.user?.height : 0,
        ACTIVITY_MULTIPLIERS[activityKey],
        GOAL_MULTIPLIERS[goalKey],
        data?.user?.yearOfBirth ?? undefined,
        data?.user?.gender ?? undefined,
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
