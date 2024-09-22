"use server";

import { getFood } from "../food-db";

export const findInDatabase = async (searchValue: string) => {
  const food = await getFood(searchValue).then((response) => {
    return response;
  });

  return food;
};
