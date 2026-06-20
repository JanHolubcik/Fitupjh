"use client";
import { useCallback } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@/utils/toast";
import { useT } from "next-i18next/client";

import {
  addFoodForDate,
  removeFromFood,
  setCurrentDate,
  selectSavedFoodByDate,
  EditFood,
} from "@/features/DashboardSlice/DashboardSlice";
import { SaveFoodOptions } from "@/lib/queriesOptions/SaveFoodOptions";
import { Food, TimeOfDay } from "@/types/Types";
import { authClient } from "@/lib/auth-client";

const useYourIntakeOperations = () => {
  const { data } = authClient.useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useT("dashboard");

  const saveFoodMutation = useMutation(SaveFoodOptions());

  const currentDate = useSelector(
    (state: RootState) => state.savedFood.currentDate,
  );
  const dateString = format(currentDate, "yyyy-MM-dd");

  const savedFood = useSelector((state: RootState) =>
    selectSavedFoodByDate(state, dateString),
  );

  const saveFood = useCallback(
    async (foodToSave?: typeof savedFood, isLastItem: boolean = false) => {
      if (!data) return;

      const food = foodToSave || savedFood;
      const hasAnyFood =
        food.breakfast.length > 0 ||
        food.lunch.length > 0 ||
        food.dinner.length > 0;

      if (!hasAnyFood && !isLastItem) return;

      try {
        await saveFoodMutation.mutateAsync({
          date: dateString,
          savedFood: food,
          userID: data.user.id,
        });
      } catch (err) {
        console.error("Error saving food:", err);
        throw err;
      }
    },
    [data, savedFood, dateString, saveFoodMutation],
  );

  const addToFoodObject = useCallback(
    async (food: Food, timeOfDay: TimeOfDay) => {
      const uniqueId = Date.now();
      const coefficient = Number(food.amount) / 100;

      const newFoodItem = {
        id: uniqueId,
        name: food.name,
        calories: food.calories * coefficient,
        amount: food.amount,
        fat: food.fat * coefficient,
        protein: food.protein * coefficient,
        sugar: food.sugar * coefficient,
        carbohydrates: food.carbohydrates * coefficient,
        fiber: food.fiber * coefficient,
        salt: food.salt * coefficient,
        imgUrl: food.imgUrl,
        originalName: food.originalName || "",
      };

      const saveFoodObject = {
        ...savedFood,
        [timeOfDay]: [...savedFood[timeOfDay], newFoodItem],
      };

      dispatch(
        addFoodForDate({ date: dateString, timeOfDay, food: newFoodItem }),
      );

      const res = saveFood(saveFoodObject);

      showToast.promise(
        res,
        {
          pending: t("toast.pending"),
          success: t("toast.success"),
          error: t("toast.error"),
        },
      );
    },
    [savedFood, dateString, dispatch, saveFood, t],
  );

  const removeFromSavedFood = useCallback(
    async (id: number, timeOfDay: TimeOfDay) => {
      // Update Redux
      dispatch(removeFromFood({ date: dateString, timeOfDay, id }));

      // Update Backend
      const updatedFood = {
        ...savedFood,
        [timeOfDay]: savedFood[timeOfDay].filter((f) => f.id !== id),
      };

      const isLastItem =
        updatedFood.breakfast.length === 0 &&
        updatedFood.lunch.length === 0 &&
        updatedFood.dinner.length === 0;

      const res = saveFood(updatedFood, isLastItem);

      showToast.promise(
        res,
        {
          pending: t("toast.pending"),
          success: t("toast.removed"),
          error: t("toast.error"),
        },
      );
    },
    [dispatch, dateString, savedFood, saveFood, t],
  );

  const updateFood = useCallback(
    async (foodItem: Food, newGrams: number, timeOfDay: TimeOfDay) => {
      const initialGrams = parseFloat(foodItem.amount) || 100;
      const ratio = newGrams / (initialGrams || 1);

      const updatedFoodItem: Food = {
        ...foodItem,
        amount: `${newGrams}`,
        calories: Math.round(foodItem.calories * ratio),
        protein: Number(foodItem.protein * ratio),
        carbohydrates: Number(foodItem.carbohydrates * ratio),
        fat: Number(foodItem.fat * ratio),
        sugar: Number(foodItem.sugar * ratio),
        fiber: Number(foodItem.fiber * ratio),
        salt: Number(foodItem.salt * ratio),
      };

      dispatch(
        EditFood({
          date: dateString,
          timeOfDay,
          id: foodItem.id,
          updatedFood: updatedFoodItem,
        }),
      );

      const updatedTimeOfDayArray = savedFood[timeOfDay].map((f) =>
        f.id === foodItem.id ? updatedFoodItem : f,
      );

      const fullUpdatedObject = {
        ...savedFood,
        [timeOfDay]: updatedTimeOfDayArray,
      };

      const res = saveFood(fullUpdatedObject);

      showToast.promise(
        res,
        {
          pending: t("toast.pending"),
          success: t("toast.updated"),
          error: t("toast.error"),
        },
      );
    },
    [dispatch, dateString, savedFood, saveFood, t],
  );

  const setNewDateAndGetFood = useCallback(
    (date: Date) => {
      dispatch(setCurrentDate(format(date, "yyyy-MM-dd")));
    },
    [dispatch],
  );

  return {
    currentDate,
    savedFood,
    setNewDateAndGetFood,
    removeFromSavedFood,
    addToFoodObject,
    updateFood,
  };
};

export default useYourIntakeOperations;
