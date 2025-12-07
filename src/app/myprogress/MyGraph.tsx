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
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
          selectedMacro={selectedMacro}
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
            {capitalizeFirstLetter(macro)}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default MyGraph;
