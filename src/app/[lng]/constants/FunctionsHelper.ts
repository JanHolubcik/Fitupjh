import { FoodType, timeOfDay } from "@/types/Types";
import { macros } from "@/types/Types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
//readonly[("breakfast", "lunch", "dinner")];
export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const calculateCaloriesSum = (savedFood: FoodType): number => {
  let calorieSum = 0;

  timeOfDay.forEach((value) => {
    calorieSum += savedFood[value].reduce(
      (acc, item) => acc + item.calories,
      0,
    );
  });

  return calorieSum;
};

export const getTimeOfDay = () => {
  const now = new Date();
  const hour = now.getHours();

  switch (true) {
    case hour >= 0 && hour < 8:
      return "breakfast";

    case hour >= 8 && hour < 16:
      return "lunch";

    case hour >= 16 && hour < 24:
      return "dinner";

    default:
      return "lunch";
  }
};

export const calculateRecommendedMacros = (
  weight: number = 70,
  height: number = 60,
): macros => {
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

export const useDebounce = <T>(
  value: T,
  delay: number,
  setLoading: Dispatch<SetStateAction<boolean>>,
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setLoading(false);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, setLoading]);

  return debouncedValue;
};

export const useIsSm = () => {
  const [isSm, setIsSm] = useState(false);

  useEffect(() => {
    // 640px is Tailwind's standard 'sm' breakpoint
    const media = window.matchMedia("(min-width: 640px)");

    setIsSm(media.matches);

    const listener = (e: any) => setIsSm(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return isSm;
};

export const useIsMd = () => {
  const [isMd, setIsMd] = useState(false);

  useEffect(() => {
    // 768px is Tailwind's standard 'md' breakpoint
    const media = window.matchMedia("(min-width: 768px)");

    setIsMd(media.matches);

    const listener = (e: any) => setIsMd(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return isMd;
};
