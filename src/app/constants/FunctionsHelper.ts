import { foodType, timeOfDay } from "@/types/Types";

//readonly[("breakfast", "lunch", "dinner")];
export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const calculateCaloriesSum = (savedFood: foodType): number => {
  let calorieSum = 0;

  timeOfDay.forEach((value) => {
    calorieSum += savedFood[value].reduce(
      (acc, item) => acc + item.calories,
      0
    );
  });

  return calorieSum;
};
