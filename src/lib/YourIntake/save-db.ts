"use server";

import { FoodType } from "@/types/Types";
import { saveFoodInDay } from "../food-db";
import mongoose from "mongoose";

export const saveFood = async (
  date: string,
  food: FoodType,
  _id: mongoose.Types.ObjectId | string,
) => {
  await saveFoodInDay(date, food, _id).then((response) => {
    return response;
  });
};
