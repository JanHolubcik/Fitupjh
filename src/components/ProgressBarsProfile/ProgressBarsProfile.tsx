"use client";

import { calculateRecommendedMacros } from "@/app/constants/FunctionsHelper";
import { GET_FOOD } from "@/app/graphql/queries";
import { FoodType } from "@/types/Types";
import { useQuery } from "@apollo/client/react";
import { Progress } from "@nextui-org/react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type ValuePiece = Date | null;

type Value = {
  date: ValuePiece | [ValuePiece, ValuePiece];
};

export type FoodItem = {
  calories: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  protein: number;
  salt: number;
  sugar: number;
};

type MacroKey =
  | "calories"
  | "carbohydrates"
  | "fat"
  | "fiber"
  | "protein"
  | "salt"
  | "sugar";

type macros = {
  calories: number;
  fat: number;
  protein: number;
  sugar: number;
  carbohydrates: number;
  fiber: number;
  salt: number;
};
type timeOfDay = "breakfast" | "lunch" | "dinner";

const timeOfDayArray: timeOfDay[] = ["breakfast", "lunch", "dinner"];

type GetFoodVars = {
  date: string;
  userId: string;
};

type GetFoodData = {
  getFood: FoodType;
};

type MacroTotals = Record<MacroKey, number>;

export function calculateConsumedMacros(fetchedData: foodType): MacroTotals {
  const totals: MacroTotals = {
    calories: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    protein: 0,
    salt: 0,
    sugar: 0,
  };

  for (const slot of timeOfDayArray) {
    for (const item of fetchedData[slot]) {
      (Object.keys(totals) as MacroKey[]).forEach((macro) => {
        totals[macro] += item[macro];
      });
    }
  }

  (Object.keys(totals) as MacroKey[]).forEach((macro) => {
    totals[macro] = Number(totals[macro].toFixed(2));
  });

  return totals;
}

const ProgressBarsProfile = (props: Value) => {
  const [calculatedMacros, setCalculatedMacros] = useState<macros>({
    calories: 0,
    fat: 0,
    protein: 0,
    sugar: 0,
    carbohydrates: 0,
    fiber: 0,
    salt: 0,
  });
  const [recommendedDailyMacros, setRecommendedDailyMacros] = useState<macros>({
    calories: 0,
    fat: 0,
    protein: 0,
    sugar: 0,
    carbohydrates: 0,
    fiber: 0,
    salt: 0,
  });

  const formattedDate = props.date
    ? format(props.date as Date, "yyyy-MM-dd")
    : null;

  const { data } = useSession();
  const user = data?.user;
  const { data: savedFood } = useQuery<GetFoodData, GetFoodVars>(GET_FOOD, {
    variables: { date: formattedDate || "", userId: user?.id! },
    skip: !formattedDate || !user?.id,
  });

  useEffect(() => {
    if (!user?.weight || !user?.height) return;
    if (!savedFood) return;
    const rec = calculateRecommendedMacros(user.weight, user.height);
    const cons = calculateConsumedMacros(savedFood.getFood);

    setRecommendedDailyMacros(rec);
    setCalculatedMacros(cons);
  }, [user?.weight, user?.height, savedFood, formattedDate]);

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="w-full bg-default-50 rounded-2xl p-4">
        <Progress
          label="Calories"
          showValueLabel
          valueLabel={
            <span className="font-semibold text-foreground">
              {calculatedMacros?.calories} <span className="text-default-400 font-normal text-small">/ {recommendedDailyMacros?.calories} Kcal</span>
            </span>
          }
          size="md"
          value={calculatedMacros?.calories}
          maxValue={recommendedDailyMacros?.calories}
          color={
            calculatedMacros &&
            recommendedDailyMacros &&
            calculatedMacros?.calories > recommendedDailyMacros?.calories
              ? "danger"
              : "primary"
          }
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 w-full">
        <Progress
          label={<span className="font-medium text-default-600">Protein</span>}
          showValueLabel
          valueLabel={
            <span className="text-small">
              <span className="font-semibold">{calculatedMacros?.protein}</span> <span className="text-default-400">/ {recommendedDailyMacros?.protein} g</span>
            </span>
          }
          color={
            calculatedMacros &&
            recommendedDailyMacros &&
            calculatedMacros?.protein > recommendedDailyMacros?.protein
              ? "danger"
              : "primary"
          }
          size="sm"
          value={calculatedMacros?.protein}
          maxValue={recommendedDailyMacros?.protein}
          className="w-full"
        />
        <Progress
          label={<span className="font-medium text-default-600">Fat</span>}
          showValueLabel
          value={calculatedMacros?.fat}
          valueLabel={
            <span className="text-small">
              <span className="font-semibold">{calculatedMacros?.fat}</span> <span className="text-default-400">/ {recommendedDailyMacros?.fat} g</span>
            </span>
          }
          maxValue={recommendedDailyMacros?.fat}
          color={
            calculatedMacros &&
            recommendedDailyMacros &&
            calculatedMacros?.fat > recommendedDailyMacros?.fat
              ? "danger"
              : "primary"
          }
          size="sm"
          className="w-full"
        />
        <Progress
          label={<span className="font-medium text-default-600">Sugar</span>}
          showValueLabel
          value={calculatedMacros?.sugar}
          maxValue={recommendedDailyMacros?.sugar}
          valueLabel={
            <span className="text-small">
              <span className="font-semibold">{calculatedMacros?.sugar}</span> <span className="text-default-400">/ {recommendedDailyMacros?.sugar} g</span>
            </span>
          }
          size="sm"
          color={
            calculatedMacros &&
            recommendedDailyMacros &&
            calculatedMacros?.sugar > recommendedDailyMacros?.sugar
              ? "danger"
              : "primary"
          }
          className="w-full"
        />
        <Progress
          label={<span className="font-medium text-default-600">Carbs</span>}
          showValueLabel
          valueLabel={
            <span className="text-small">
              <span className="font-semibold">{calculatedMacros?.carbohydrates}</span> <span className="text-default-400">/ {recommendedDailyMacros?.carbohydrates} g</span>
            </span>
          }
          size="sm"
          color={
            calculatedMacros &&
            recommendedDailyMacros &&
            calculatedMacros?.carbohydrates >
              recommendedDailyMacros?.carbohydrates
              ? "danger"
              : "primary"
          }
          value={calculatedMacros?.carbohydrates ?? 0}
          maxValue={recommendedDailyMacros?.carbohydrates}
          className="w-full"
        />
        <Progress
          label={<span className="font-medium text-default-600">Fiber</span>}
          showValueLabel
          value={calculatedMacros?.fiber}
          valueLabel={
            <span className="text-small">
              <span className="font-semibold">{calculatedMacros?.fiber}</span> <span className="text-default-400">/ {recommendedDailyMacros?.fiber} g</span>
            </span>
          }
          size="sm"
          maxValue={recommendedDailyMacros?.fiber}
          color={
            calculatedMacros &&
            recommendedDailyMacros &&
            calculatedMacros?.fiber > recommendedDailyMacros?.fiber
              ? "danger"
              : "primary"
          }
          className="w-full"
        />
        <Progress
          label={<span className="font-medium text-default-600">Salt</span>}
          showValueLabel
          valueLabel={
            <span className="text-small">
              <span className="font-semibold">{calculatedMacros?.salt}</span> <span className="text-default-400">/ {recommendedDailyMacros?.salt} g</span>
            </span>
          }
          size="sm"
          value={calculatedMacros?.salt}
          maxValue={recommendedDailyMacros?.salt}
          color={
            calculatedMacros &&
            recommendedDailyMacros &&
            calculatedMacros?.salt > recommendedDailyMacros?.salt
              ? "danger"
              : "primary"
          }
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ProgressBarsProfile;
