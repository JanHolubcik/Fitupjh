"use client";
import { format } from "date-fns";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { FoodItem } from "@/components/ProgressBarsProfile/ProgressBarsProfile";
import Chart from "./Chart";
import { useMemo } from "react";
import { macros } from "@/types/Types";

const calculateRecommendedMacros = (
  weight: number = 70,
  height: number = 60
): macros => {
  const calories = (10 * weight + 6.25 * height - 5 * 25 + 5) * 1.2; // BMR × sedentary activity

  const macros = {
    calories: Math.round(calories),
    fat: calories * 0.2,
    protein: Math.round(1.2 * weight),
    fiber: 38,
    salt: 2.3,
  };

  return {
    ...macros,
    carbohydrates: Math.round((calories - macros.protein + macros.fat) / 4),
    fat: Math.round(macros.fat / 9),
    sugar: Math.round((calories * 0.1) / 4),
  };
};

const useRecommendedMacros = () => {
  const date = format(new Date(), "yyyy-MM-dd");
  const { data } = useSession();

  const { data: savedFood } = useSuspenseQuery(
    LastMonthFoodOptions(data?.user?.id!, "", date.toString())
  );
  const isArray = Array.isArray(savedFood);
  const isEmpty = !isArray || savedFood.length === 0;

  const sortedFood = isEmpty
    ? []
    : [...savedFood].sort(
        (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
      );

  const labels = isEmpty
    ? []
    : sortedFood.map((item) => format(item.day, "dd-MM-yyyy"));

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
  const dataCarbohydrates = isEmpty
    ? []
    : dataMacros.map((m) => m.carbohydrates);

  const macroDatasets = {
    protein: dataProtein,
    fat: dataFat,
    calories: dataCalories,
    sugar: dataSugar,
    carbohydrates: dataCarbohydrates,
  };

  return {
    macroDatasets,
    dataMacros: isEmpty ? [] : dataMacros,
    labels,
    RecommendedMacros,
  };
};

export default useRecommendedMacros;
