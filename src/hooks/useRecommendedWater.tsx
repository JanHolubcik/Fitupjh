"use client";

import { authClient } from "@/lib/auth-client";
import { calculateRecommendedWater } from "@/app/[lng]/constants/FunctionsHelper";

export type RecommendedWaterResult = {
  recommendedWater: number;
  age: number;
  gender: string;
  weight?: number;
};

const useRecommendedWater = (): RecommendedWaterResult => {
  const { data } = authClient.useSession();
  const user = data?.user;

  const currentYear = new Date().getFullYear();
  const age = user?.yearOfBirth
    ? user.yearOfBirth > 1900
      ? currentYear - user.yearOfBirth
      : user.yearOfBirth
    : 25;

  const gender = user?.gender || "male";
  const weight = typeof user?.weight === "number" ? user.weight : undefined;
  const yearOfBirth =
    typeof user?.yearOfBirth === "number" ? user.yearOfBirth : undefined;

  const recommendedWater = calculateRecommendedWater(
    yearOfBirth,
    gender,
    weight,
  );

  return {
    recommendedWater,
    age,
    gender,
    weight,
  };
};

export default useRecommendedWater;
