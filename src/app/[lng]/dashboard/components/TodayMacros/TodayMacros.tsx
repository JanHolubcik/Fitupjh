import {
  calculateRecommendedMacros,
  capitalizeFirstLetter,
  useIsSm,
} from "@/app/[lng]/constants/FunctionsHelper";
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
import {
  MACRO_TAILWIND_THEME,
  MacroArray,
} from "@/app/[lng]/constants/MacrosHelper";
import { useT } from "next-i18next/client";

type props = {
  savedFood: FoodType;
};

export const TodayMacros = ({ savedFood }: props) => {
  const { data } = useSession();
  const isSm = useIsSm();
  const { t } = useT("dashboard");
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
    <Card className="w-full sm:max-w-4xl mx-auto flex flex-col gap-4 ">
      <CardBody className="grid  md:grid-cols-2 grid-cols-1  gap-2">
        {MacroArray.map((macro) => (
          <MacroProgressBar
            key={macro}
            label={t(`macros.${macro}`, {
              defaultValue: capitalizeFirstLetter(macro),
            })}
            current={calculatedMacros[macro as keyof typeof calculatedMacros]}
            target={recommendedMacros[macro as keyof typeof recommendedMacros]}
            unit={
              macro === "calories" ? t("todayMacros.kcal") : t("todayMacros.g")
            }
            colorName={
              MACRO_TAILWIND_THEME[macro as keyof typeof MACRO_TAILWIND_THEME]
                .color
            }
          />
        ))}
      </CardBody>
    </Card>
  );
};
