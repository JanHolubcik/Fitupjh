import {
  calculateRecommendedMacros,
  capitalizeFirstLetter,
} from "@/app/[lng]/constants/FunctionsHelper";
import {
  ACTIVITY_MULTIPLIERS,
  GOAL_MULTIPLIERS,
  Food,
  macros,
  timeOfDay,
  timeOfDayNumber,
} from "@/types/Types";
import { useMemo } from "react";
import { MacroProgressBar } from "../MacrosProgressBarDashboard/MacrosProgressBarDashboard";
import { CardBody } from "@nextui-org/react";
import {
  MACRO_TAILWIND_THEME,
  MacroArray,
} from "@/app/[lng]/constants/MacrosHelper";
import { useT } from "next-i18next/client";
import { CardUniversal } from "@/components/common";
import { authClient } from "@/lib/auth-client";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { useActivityOperations } from "@/hooks/useActivityOperations";

export const TodayMacros = () => {
  const { savedFood } = useYourIntakeOperations();
  const { savedActivities } = useActivityOperations();
  const { data } = authClient.useSession();
  const user = data?.user;
  const { t } = useT("dashboard");
  const activityKey = (user?.activityLevel ||
    "lightlyActive") as keyof typeof ACTIVITY_MULTIPLIERS;
  const goalKey = (user?.goal ||
    "maintainWeight") as keyof typeof GOAL_MULTIPLIERS;
  const burnedCalories = useMemo(() => {
    return savedActivities
      ? savedActivities.reduce((sum, act) => sum + (act.caloriesBurned || 0), 0)
      : 0;
  }, [savedActivities]);

  const recommendedMacros = useMemo(() => {
    const baseline = user
      ? calculateRecommendedMacros(
          user.weight ? user.weight : 0,
          user.height ? user.height : 0,
          ACTIVITY_MULTIPLIERS[activityKey],
          GOAL_MULTIPLIERS[goalKey],
        )
      : {
          calories: 0,
          fat: 0,
          protein: 0,
          sugar: 0,
          carbohydrates: 0,
          fiber: 0,
          salt: 0,
        };

    if (burnedCalories === 0 || baseline.calories === 0) return baseline;

    const baselineProteinKcal = baseline.protein * 4;
    const baselineCarbsKcal = baseline.carbohydrates * 4;
    const baselineFatKcal = baseline.fat * 9;
    const totalMacroKcal =
      baselineProteinKcal + baselineCarbsKcal + baselineFatKcal;

    if (totalMacroKcal === 0) return baseline; // Safety fallback

    const proteinRatio = baselineProteinKcal / totalMacroKcal;
    const carbsRatio = baselineCarbsKcal / totalMacroKcal;
    const fatRatio = baselineFatKcal / totalMacroKcal;

    return {
      ...baseline,
      calories: Number((baseline.calories + burnedCalories).toFixed(2)),
      protein: Number(
        (baseline.protein + (burnedCalories * proteinRatio) / 4).toFixed(2),
      ),
      carbohydrates: Number(
        (baseline.carbohydrates + (burnedCalories * carbsRatio) / 4).toFixed(2),
      ),
      fat: Number((baseline.fat + (burnedCalories * fatRatio) / 9).toFixed(2)),
    };
  }, [user?.weight, user?.height, activityKey, goalKey, burnedCalories]);

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
      salt: 0,
      sugar: 0,
    };
  }, [savedFood, burnedCalories]);

  return (
    <CardUniversal
      id={"tour-macros"}
      className="w-full h-full sm:max-w-4xl  flex flex-col gap-4 "
    >
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
    </CardUniversal>
  );
};
