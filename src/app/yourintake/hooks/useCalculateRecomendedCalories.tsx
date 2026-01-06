import { calculateCaloriesSum } from "@/app/constants/FunctionsHelper";
import { foodType } from "@/types/Types";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const useCalculateRecommendedCalories = (savedFood: foodType) => {
  const { data } = useSession();
  const recommendedCaloriesValue = useMemo(() => {
    if (data?.user?.weight && data?.user?.height) {
      return (
        (10 * data?.user?.weight + 6.25 * data?.user?.height - 5 * 25 + 5) * 1.2
      );
    } else {
      return 0;
    }
  }, [data?.user?.height, data?.user?.weight]);
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
