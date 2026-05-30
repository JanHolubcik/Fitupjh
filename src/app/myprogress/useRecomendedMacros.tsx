"use client";
import { format } from "date-fns";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  calculateRecommendedMacros,
  capitalizeFirstLetter,
} from "../constants/FunctionsHelper";
import strings from "../../app/constants/CalorieMacrosDescription.json";

import { SavedFoodClass } from "@/models/savedFood";
import { FoodType, SavedFoodMonth } from "@/types/Types";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
const calculateAverage = (array: number[]) => {
  if (array.length === 0) return 0;

  const total = array.reduce((sum, value) => {
    return sum + value;
  }, 0);

  return total / array.length;
};

const DEFICIT_THRESHOLD = 0.75;
const SURPLUS_THRESHOLD = 1.25;

export type SavedFoodEntry = {
  day: string;
  savedFood: FoodType;
};
type ClientSavedFood = Omit<SavedFoodClass, "user_id">;

function transformReduxToApi(month: SavedFoodMonth): ClientSavedFood[] {
  return Object.entries(month).map(([dateKey, foodType]) => ({
    day: new Date(dateKey),
    savedFood: foodType,
  }));
}

const useMacros = () => {
  const date = format(new Date(), "yyyy-MM-dd");
  const { data } = useSession();

  const reduxSavedFood = useSelector((state: RootState) => state.savedFood);
  const hasReduxData = Object.keys(reduxSavedFood.month).length > 0;

  const { data: apiSavedFood, isLoading } = useQuery({
    ...LastMonthFoodOptions(data?.user?.id!, "", date.toString()),
    enabled: !hasReduxData,
  });

  const savedFood = hasReduxData
    ? transformReduxToApi(reduxSavedFood.month)
    : apiSavedFood;
  const isArray = Array.isArray(savedFood);
  const isEmpty = !isArray || savedFood.length === 0;

  const sortedFood = isEmpty
    ? []
    : [...savedFood].sort(
        (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime(),
      );

  const labels = isEmpty
    ? []
    : sortedFood.map((item) => {
        const dateObj = new Date(item.day);
        // "EEE" outputs Mon, Tue, Wed...
        // "dd-MM" outputs 30-04, 01-05...
        return format(dateObj, "dd.MM EEE");
      });

  const RecommendedMacros = data?.user
    ? calculateRecommendedMacros(data?.user?.weight, data?.user?.height)
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
          item.savedFood[meal]?.forEach((food) => {
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

  const getMacroMessage = (macro: keyof typeof CurrentDailyIntake) => {
    const current = CurrentDailyIntake[macro];
    const recommended = RecommendedMacros[macro];

    let keySuffix: "Optional" | "Deficit" | "Surplus";

    if (current < recommended * DEFICIT_THRESHOLD) keySuffix = "Deficit";
    else if (current > recommended * SURPLUS_THRESHOLD) keySuffix = "Surplus";
    else keySuffix = "Optional";

    const jsonKey = `${capitalizeFirstLetter(
      macro,
    )}${keySuffix}` as keyof typeof strings;
    const template = strings[jsonKey];

    return template
      .replace("{X}", current.toFixed(1))
      .replace("{Y}", recommended.toFixed(1));
  };

  return {
    getMacroMessage,
    macroDatasets,
    CurrentDailyIntake,
    dataMacros: isEmpty ? [] : dataMacros,
    labels,
    RecommendedMacros,
    isLoading,
  };
};

export default useMacros;
