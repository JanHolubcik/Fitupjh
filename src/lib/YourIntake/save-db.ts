"use server";

import { foodType } from "@/types/Types";
import { saveFoodInDay } from "../food-db";
import mongoose from "mongoose";

export const saveFood = async (
  date: string,
  food: foodType,
  _id: mongoose.Types.ObjectId | string
) => {
  await saveFoodInDay(date, food, _id).then((response) => {
    return response;
  });
};
