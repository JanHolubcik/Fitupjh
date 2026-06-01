import { calculateRecommendedMacros } from "@/app/constants/FunctionsHelper";
import {
  Food,
  FoodType,
  macros,
  timeOfDay,
  timeOfDayNumber,
} from "@/types/Types";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { MacroProgressBar } from "../MacrosProgressBarDashboard/MacrosProgressBarDashboard";
import { Card, CardBody } from "@nextui-org/react";

type props = {
  savedFood: FoodType;
};

const macroConfig = [
  {
    key: "calories",
    label: "Calories",
    unit: "kcal",
    color: "warning" as const,
  },
  { key: "protein", label: "Protein", unit: "g", color: "success" as const },
  {
    key: "carbohydrates",
    label: "Carbs",
    unit: "g",
    color: "secondary" as const,
  },
  { key: "fat", label: "Fat", unit: "g", color: "danger" as const },
  { key: "fiber", label: "Fiber", unit: "g", color: "primary" as const },
  { key: "sugar", label: "Sugar", unit: "g", color: "default" as const },
];

export const TodayMacros = ({ savedFood }: props) => {
  const { data } = useSession();

  const recommendedMacros = useMemo(
    () =>
      data?.user
        ? calculateRecommendedMacros(data?.user?.weight, data?.user?.height)
        : {
            calories: 0,
            fat: 0,
            protein: 0,
            sugar: 0,
            carbohydrates: 0,
            fiber: 0,
            salt: 0,
          },
    [data?.user?.weight, data?.user?.height],
  );
  const calculatedMacros = useMemo(() => {
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
        const timeInDaySavedMacro: macros = savedFood[
          value as timeOfDayNumber
        ].reduce(
          (acc: macros, item: Food) => {
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
          },
        );

        Object.keys(savedMacros).forEach((key) => {
          const keyT = key as keyof macros;
          savedMacros[keyT] += timeInDaySavedMacro[keyT];
        });
      });
      //savedMacros.calories = Math.round;
      Object.keys(savedMacros).forEach((key) => {
        const keyT = key as keyof macros;
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

      sugar: 0,
    };
  }, [data?.user?.weight, data?.user?.height, savedFood]);

  return (
    <Card className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <CardBody className="grid  grid-cols-2 gap-2">
        {macroConfig.map((macro) => (
          <MacroProgressBar
            key={macro.key}
            label={macro.label}
            current={
              calculatedMacros[macro.key as keyof typeof calculatedMacros]
            }
            target={
              recommendedMacros[macro.key as keyof typeof recommendedMacros]
            }
            unit={macro.unit}
            colorName={macro.color}
          />
        ))}
      </CardBody>
    </Card>
  );
};
