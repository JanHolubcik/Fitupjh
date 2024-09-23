"use server";

import { checkForSavedFood, getFood } from "../food-db";

export const findInDatabase = async (searchValue: string) => {
  const food = await getFood(searchValue).then((response) => {
    return response;
  });

  return food;
};

export const getSavedFood = async (date: string) => {
  const food = await checkForSavedFood(date).then((response) => {
    return response;
  });

  return food;
};
