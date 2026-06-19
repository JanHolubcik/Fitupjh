import {
  calculateActivities,
  calculateCaloriesSum,
} from "@/app/[lng]/constants/FunctionsHelper";
import { LoggedActivityType } from "@/features/DashboardSlice/DashboardSlice";
import { authClient } from "@/lib/auth-client";

import {
  ACTIVITY_MULTIPLIERS,
  GOAL_MULTIPLIERS,
  FoodType,
} from "@/types/Types";

import { useMemo } from "react";

const useCalculateRecommendedCalories = (
  savedFood: FoodType | null,
  savedActivities: LoggedActivityType[],
) => {
  const { data } = authClient.useSession();
  const user = data?.user;

  const activityKey = (user?.activityLevel ||
    "lightlyActive") as keyof typeof ACTIVITY_MULTIPLIERS;
  const goalKey = (user?.goal ||
    "maintainWeight") as keyof typeof GOAL_MULTIPLIERS;
  const recommendedCaloriesValue = useMemo(() => {
    if (user?.weight && user.height) {
      const bmr = 10 * user.weight + 6.25 * user.height - 5 * 25 + 5;
      const multiplier = ACTIVITY_MULTIPLIERS[activityKey] || 1.2;
      const tdee = bmr * multiplier;
      return Math.round(tdee * GOAL_MULTIPLIERS[goalKey]);
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
    return (
      calculateCaloriesSum(savedFood) - calculateActivities(savedActivities)
    );
  }, [savedFood, savedActivities]);
  return { recommendedCaloriesValue, caloriesSum };
};

export default useCalculateRecommendedCalories;

