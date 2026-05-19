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