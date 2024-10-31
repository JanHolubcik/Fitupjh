"use server";

import { checkForSavedFood, getFood } from "../food-db";
import { getUser, updateUser } from "../user-db";

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

export const getSavedUser = async () => {
  const user = await getUser().then((response) => {
    return response;
  });

  return user;
};

export const getUpdateUser = async (
  height: number,
  weight: number,
  goal: string
) => {
  const user = await updateUser(height, weight, goal).then((response) => {
    return response;
  });

  return user;
};
