"use server";

import { foodType } from "@/types/foodTypes";
import { getFood, saveFoodInDay } from "../food-db";

export const saveFood = async (date: string, food: foodType) => {
  
  await saveFoodInDay(date, food).then((response) => {
    
    return response;
  });
};
