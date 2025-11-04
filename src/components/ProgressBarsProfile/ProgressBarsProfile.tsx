"use client";

import { DailyIntakeOptions } from "@/lib/queriesOptions/DailyIntakeOptions";
import { foodType } from "@/types/foodTypes";
import { Progress } from "@nextui-org/react";
import { useSuspenseQuery } from "@tanstack/react-query";
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

const timeOfDay: timeOfDay[] = ["breakfast", "lunch", "dinner"];

function calculateRecommendedMacros(weight: number, height: number) {
  const calories = (10 * weight + 6.25 * height - 5 * 25 + 5) * 1.2;

  const base = {
    calories: Math.round(calories),
    fat: calories * 0.2,
    protein: Number(Math.round(1.2 * weight).toFixed(2)),
    fiber: 38,
    salt: 2.3,
  };

  return {
    ...base,
    carbohydrates: Number(
      Math.round((calories - base.protein + base.fat) / 4).toFixed(2)
    ),
    fat: Number((base.fat / 9).toFixed(2)),
    sugar: Number(((calories * 0.1) / 4).toFixed(2)),
  };
}

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

  for (const slot of timeOfDay) {
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
    ? format(props.date as Date, "dd.MMM.yyyy")
    : null;

  const { data } = useSession();
  const user = data?.user;
  const { data: savedFood } = useSuspenseQuery(
    DailyIntakeOptions(user?.id!, formattedDate!)
  );

  useEffect(() => {
    if (!user?.weight || !user?.height) return;

    const rec = calculateRecommendedMacros(user.weight, user.height);
    const cons = calculateConsumedMacros(savedFood);

    setRecommendedDailyMacros(rec);
    setCalculatedMacros(cons);
  }, [user?.weight, user?.height, savedFood, formattedDate]);

  return (
    <div className="flex flex-col min-w-96">
      <div className="flex flex-row  min-w-96">
        <Progress
          label="Protein"
          showValueLabel
          valueLabel={
            calculatedMacros?.protein +
            "/" +
            recommendedDailyMacros?.protein +
            " g"
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
          className="max-w-md m-2 text-xs"
        />
        <Progress
          label="Fat"
          showValueLabel
          value={calculatedMacros?.fat}
          valueLabel={
            calculatedMacros?.fat + "/" + recommendedDailyMacros?.fat + " g"
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
          className="max-w-md m-2"
        />
      </div>
      <div className="flex flex-row">
        <Progress
          label="Sugar"
          showValueLabel
          value={calculatedMacros?.sugar}
          maxValue={recommendedDailyMacros?.sugar}
          valueLabel={
            calculatedMacros?.sugar + "/" + recommendedDailyMacros?.sugar + " g"
          }
          size="sm"
          color={
            calculatedMacros &&
            recommendedDailyMacros &&
            calculatedMacros?.sugar > recommendedDailyMacros?.sugar
              ? "danger"
              : "primary"
          }
          className="max-w-md m-2"
        />
        <Progress
          label="Carbohy..."
          showValueLabel
          valueLabel={
            calculatedMacros?.carbohydrates +
            "/" +
            recommendedDailyMacros?.carbohydrates +
            " g"
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
          className="max-w-md m-2"
        />
      </div>
      <div className="flex flex-row">
        <Progress
          label="Fiber"
          showValueLabel
          value={calculatedMacros?.fiber}
          valueLabel={
            calculatedMacros?.fiber + "/" + recommendedDailyMacros?.fiber + " g"
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
          className="max-w-md m-2"
        />
        <Progress
          label="Salt"
          showValueLabel
          valueLabel={
            calculatedMacros?.salt + "/" + recommendedDailyMacros?.salt + " g"
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
          className="max-w-md m-2"
        />
      </div>
      <Progress
        label="Calories"
        showValueLabel
        valueLabel={
          calculatedMacros?.calories +
          "/" +
          recommendedDailyMacros?.calories +
          " Kcal"
        }
        size="sm"
        value={calculatedMacros?.calories}
        maxValue={recommendedDailyMacros?.calories}
        color={
          calculatedMacros &&
          recommendedDailyMacros &&
          calculatedMacros?.calories > recommendedDailyMacros?.calories
            ? "danger"
            : "primary"
        }
        className="max-w-80 m-2 self-center"
      />
    </div>
  );
};

export default ProgressBarsProfile;
