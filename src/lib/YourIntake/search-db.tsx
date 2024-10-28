"use server";

import { checkForSavedFood, getFood } from "../food-db";

export const findInDatabase = async (searchValue: string, user_id: string) => {
  const food = await getFood(searchValue).then((response) => {
    return response;
  });

  return food;
};

export const getSavedFood = async (date: string, user_id: string) => {
  const food = await checkForSavedFood(date, user_id).then((response) => {
    return response;
  });

  return food;
};
