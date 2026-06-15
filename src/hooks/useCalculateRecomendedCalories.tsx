import { calculateCaloriesSum } from "@/app/[lng]/constants/FunctionsHelper";
import { UserInfoOptions } from "@/lib/queriesOptions/UserInfoOptions";

import {
  ACTIVITY_MULTIPLIERS,
  GOAL_MULTIPLIERS,
  FoodType,
} from "@/types/Types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const useCalculateRecommendedCalories = (savedFood: FoodType | null) => {
  const { data } = useSession();
  const { data: user } = useSuspenseQuery(UserInfoOptions());

  const recommendedCaloriesValue = useMemo(() => {
    if (data?.user?.weight && data?.user?.height) {
      const bmr = 10 * user.weight + 6.25 * user.height - 5 * 25 + 5;
      const multiplier = ACTIVITY_MULTIPLIERS[user.activityLevel] || 1.2;
      const tdee = bmr * multiplier;
      return Math.round(tdee * GOAL_MULTIPLIERS[user.goal]);
    } else {
      return 0;
    }
  }, [user?.height, user?.weight]);

  const caloriesSum = useMemo(() => {
    if (!savedFood) return 0;
    if (
      savedFood.breakfast.length === 0 &&
      savedFood.lunch.length === 0 &&
      savedFood.dinner.length === 0
    )
      return 0;
    return calculateCaloriesSum(savedFood);
  }, [savedFood]);
  return { recommendedCaloriesValue, caloriesSum };
};
//
