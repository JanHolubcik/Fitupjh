"use client";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";

import { Progress } from "@nextui-org/react";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Food = {
  timeOfDay: "breakfast" | "lunch" | "dinner";
};

type ValuePiece = Date | null;

type Value = {
  date: ValuePiece | [ValuePiece, ValuePiece];
};

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

const timeOfDay = ["breakfast", "lunch", "dinner"];

const calculateRecommendedMacros = (weight: number, height: number): macros => {
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

const ProgressBars = () => {
  const { savedFood } = useYourIntakeOperations();

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

  const { data } = useSession();
  useEffect(() => {
    if (data?.user?.id) {
      if (data) {
        const weight = data.user?.weight;
        const height = data.user?.height;
        if (weight && height) {
          const calories = (10 * weight + 6.25 * height - 5 * 25 + 5) * 1.2;
          const macros = {
            calories: Math.round(calories), //for now age is fixed to 25 and calories are calculated for men and sedentary lifestyle
            fat: calories * 0.2,
            protein: Number(Math.round(1.2 * weight).toFixed(2)),
            fiber: 38,
            salt: 2.3,
          } as macros;
          //set remaining macros to g
          setRecommendedDailyMacros(calculateRecommendedMacros(weight, height));
          if (data && savedFood) {
            setCalculatedMacros(() => {
              if (savedFood) {
                const savedMacros = {
                  calories: 0,
                  carbohydrates: 0,
                  fat: 0,
                  fiber: 0,
                  protein: 0,
                  salt: 0,
                  sugar: 0,
                };
                timeOfDay.forEach((value) => {
                  const timeInDaySavedMacro = savedFood[
                    value as timeOfDay
                  ].reduce(
                    (acc, item) => {
                      acc.calories += item.calories;
                      acc.carbohydrates += item.carbohydrates;
                      acc.fat += item.fat;
                      acc.fiber += item.fiber;
                      acc.protein += item.protein;
                      acc.salt += item.salt;
                      acc.sugar += item.sugar;
                      return acc;
                    },
                    {
                      calories: 0,
                      carbohydrates: 0,
                      fat: 0,
                      fiber: 0,
                      protein: 0,
                      salt: 0,
                      sugar: 0,
                    }
                  );

                  Object.keys(savedMacros).forEach((key) => {
                    const keyT = key as keyof typeof macros;
                    savedMacros[keyT] += timeInDaySavedMacro[keyT];
                  });
                });
                //savedMacros.calories = Math.round;
                Object.keys(savedMacros).forEach((key) => {
                  const keyT = key as keyof typeof macros;
                  savedMacros[keyT] = Number(savedMacros[keyT].toFixed(2));
                });
                return savedMacros;
              }
              return {
                calories: 0,
                carbohydrates: 0,
                fat: 0,
                fiber: 0,
                protein: 0,
                salt: 0,
                sugar: 0,
              };
            });
          } else
            setCalculatedMacros({
              calories: 0,
              carbohydrates: 0,
              fat: 0,
              fiber: 0,
              protein: 0,
              salt: 0,
              sugar: 0,
            });
        }
      }
    }
  }, [data, savedFood]);

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

export default ProgressBars;
