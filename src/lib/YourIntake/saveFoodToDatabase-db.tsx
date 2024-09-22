"use server";

import { foodType } from "@/types/foodTypes";
import { getFood, saveFoodInDay } from "../food-db";

export const saveFoodToDatabase = async (date: Date, food: foodType) => {
  debugger;
  await saveFoodInDay(date, food).then((response) => {
    debugger;
    return response;
  });
};
