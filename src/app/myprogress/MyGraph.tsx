"use client";
import { format } from "date-fns";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { FoodItem } from "@/components/ProgressBarsProfile/ProgressBarsProfile";
import Chart from "./Chart";
import { useMemo, useState } from "react";
import { macros } from "@/types/Types";
import useRecommendedMacros from "./useRecomendedMacros";
import { Button, ButtonGroup } from "@nextui-org/react";

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
  const { labels, macroDatasets, RecommendedMacros } = useRecommendedMacros();
  const [selectedMacro, setSelectedMacro] =
    useState<keyof typeof macroDatasets>("protein");

  if (labels.length === 0) {
    return <p>No data available to display the graph.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Chart
          labels={labels}
          dataValues={macroDatasets[selectedMacro]}
          recommendedValue={RecommendedMacros[selectedMacro]}
        />
      </div>
      <ButtonGroup>
        {Object.keys(macroDatasets).map((macro) => (
          <Button
            key={macro}
            color={macro === selectedMacro ? "primary" : "default"}
            onPress={() =>
              setSelectedMacro(macro as keyof typeof macroDatasets)
            }
          >
            {macro}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default MyGraph;
