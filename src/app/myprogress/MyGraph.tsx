"use client";
import { format } from "date-fns";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { FoodItem } from "@/components/ProgressBarsProfile/ProgressBarsProfile";
import Chart from "./Chart";
import { useMemo } from "react";
import { macros } from "@/types/Types";

type SavedFood = {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
};

type FoodLog = {
  _id: string;
  day: string;
  savedFood: SavedFood;
  user_id: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
};
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

const MyGraph = () => {
  const date = format(new Date(), "yyyy-MM-dd");
  const { data } = useSession();

  const { data: savedFood } = useSuspenseQuery(
    LastMonthFoodOptions(data?.user?.id!, "", date.toString())
  );
  const sortedFood = [...savedFood].sort(
    (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
  );
  const labels = sortedFood.map((item) => format(item.day, "dd-MM-yyyy"));

  const RecomendedMacros = data?.user
    ? calculateRecommendedMacros(data?.user?.weight, data?.user?.height)
    : {
        calories: 0,
        fat: 0,
        protein: 0,
        fiber: 0,
        salt: 0,
      };
  const dataValues = useMemo(
    () =>
      sortedFood.map((item) => {
        const breakfastProtein =
          item.savedFood.breakfast?.reduce(
            (total, food) => total + food.protein,
            0
          ) || 0;
        const lunchProtein =
          item.savedFood.lunch?.reduce(
            (total, food) => total + food.protein,
            0
          ) || 0;
        const dinnerProtein =
          item.savedFood.dinner?.reduce(
            (total, food) => total + food.protein,
            0
          ) || 0;

        return breakfastProtein + lunchProtein + dinnerProtein;
      }),
    [sortedFood]
  );

  return (
    <div>
      <Chart
        labels={labels}
        dataValues={dataValues}
        recommendedValue={RecomendedMacros.protein}
      />
    </div>
  );
};

export default MyGraph;
