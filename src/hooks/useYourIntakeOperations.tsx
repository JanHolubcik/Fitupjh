"use client";
import {
  addFoodForDate,
  editAndPersistFood,
  removeFromFood,
  setCurrentDate,
} from "@/features/savedFoodslice/yourIntakeSlice";

import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { selectSavedFoodByDate } from "@/features/savedFoodslice/yourIntakeSlice";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { toast } from "react-toastify";
import { Food } from "@/types/Types";

type timeOfDay = "breakfast" | "lunch" | "dinner";

const useYourIntakeOperations = () => {
  const { status, data } = useSession();
  const dispatch = useDispatch();

  const currentDate = useSelector(
    (state: RootState) => state.savedFood.currentDate,
  );
  const savedFood = useSelector((state: RootState) =>
    selectSavedFoodByDate(state, format(currentDate, "yyyy-MM-dd")),
  );

  const saveFood = async (
    foodToSave?: typeof savedFood,
    isLastItem: boolean = false,
  ) => {
    if (status !== "authenticated" || !data?.user?.id) return;

    const food = foodToSave || savedFood;

    const hasAnyFood =
      food.breakfast.length > 0 ||
      food.lunch.length > 0 ||
      food.dinner.length > 0;
    if (!hasAnyFood && !isLastItem) return;

    try {
      await fetch("/api/saveFood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: format(currentDate, "yyyy-MM-dd"),
          savedFood: food,
          userID: data.user.id,
        }),
        credentials: "include",
      });
    } catch (err) {
      console.error("Error saving food:", err);
    }
  };

  const addToFoodObject = async (food: Food, timeOfDay: timeOfDay) => {
    const date = format(currentDate, "yyyy-MM-dd");
    const {
      name,
      calories,
      amount,
      fat,
      protein,
      sugar,
      carbohydrates: carbs,
      fiber,
      salt,
      imgUrl,
    } = food;
    const uniqueId = Date.now();
    const saveFoodObject = {
      ...savedFood,
      [timeOfDay]: [
        ...savedFood[timeOfDay],
        {
          id: uniqueId,
          name,
          calories,
          amount,
          fat,
          protein,
          sugar,
          carbohydrates: carbs,
          fiber,
          salt,
          imgUrl,
        },
      ],
    };
    dispatch(
      addFoodForDate({
        date,
        timeOfDay,
        food: {
          id: uniqueId,
          name,
          calories,
          amount,
          fat,
          protein,
          sugar,
          carbohydrates: carbs,
          fiber,
          salt,
          imgUrl,
        },
      }),
    );

    // Save immediately after adding
    const res = saveFood(saveFoodObject);

    toast.promise(
      res,
      {
        pending: "Sending request...",
        success: "Food was added!",
        error: "There was an error while adding new intake.",
      },
      {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      },
    );
  };

  const addToFood = async (
    calories: number,
    name: string,
    timeOfDay: timeOfDay,
    amount: string,
    fat: number,
    protein: number,
    sugar: number,
    carbs: number,
    fiber: number,
    salt: number,
    imgUrl: string,
  ) => {
    const date = format(currentDate, "yyyy-MM-dd");
    const uniqueId = Date.now();
    const saveFoodObject = {
      ...savedFood,
      [timeOfDay]: [
        ...savedFood[timeOfDay],
        {
          id: uniqueId,
          name,
          calories,
          amount,
          fat,
          protein,
          sugar,
          carbohydrates: carbs,
          fiber,
          salt,
          imgUrl,
        },
      ],
    };
    dispatch(
      addFoodForDate({
        date,
        timeOfDay,
        food: {
          id: uniqueId,
          name,
          calories,
          amount,
          fat,
          protein,
          sugar,
          carbohydrates: carbs,
          fiber,
          salt,
          imgUrl,
        },
      }),
    );

    // Save immediately after adding
    const res = saveFood(saveFoodObject);

    toast.promise(
      res,
      {
        pending: "Sending request...",
        success: "Food was added!",
        error: "There was an error while adding new intake.",
      },
      {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      },
    );
  };

  const removeFromSavedFood = async (id: number, timeOfDay: timeOfDay) => {
    dispatch(
      removeFromFood({
        date: format(currentDate, "yyyy-MM-dd"),
        timeOfDay,
        id,
      }),
    );

    // Save immediately after removing
    const updatedFood = {
      ...savedFood,
      [timeOfDay]: savedFood[timeOfDay].filter((f) => f.id !== id),
    };

    const isLastItem =
      updatedFood.breakfast.length === 0 &&
      updatedFood.lunch.length === 0 &&
      updatedFood.dinner.length === 0;
    await saveFood(updatedFood, isLastItem);
  };

  const setNewDateAndGetFood = (date: Date) => {
    dispatch(setCurrentDate(format(date, "yyyy-MM-dd")));
  };

  const updateFood = async (updatedFood: Food, timeOfDay: timeOfDay) => {
    const date = format(currentDate, "yyyy-MM-dd");

    await (dispatch as AppDispatch)(
      editAndPersistFood(
        {
          date,
          timeOfDay,
          id: updatedFood.id,
          updatedFood,
        },
        saveFood,
      ),
    );
  };

  return {
    currentDate,
    savedFood,
    setNewDateAndGetFood,
    removeFromSavedFood,
    addToFood,
    addToFoodObject,
    updateFood,
  };
};

export default useYourIntakeOperations;
