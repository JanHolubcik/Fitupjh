"use client";
import { useCallback } from "react";
import { format, subDays } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/utils/toast";
import { useT } from "next-i18next/client";

import { useCurrentDate } from "@/hooks/useDashboardState";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { SaveFoodOptions } from "@/lib/queriesOptions/SaveFoodOptions";
import { Food, FoodType, TimeOfDay } from "@/types/Types";
import { authClient } from "@/lib/auth-client";

const emptyDayFallback: FoodType = {
  breakfast: [],
  lunch: [],
  dinner: [],
};

const useYourIntakeOperations = () => {
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();
  const { t } = useT("dashboard");

  const saveFoodMutation = useMutation(SaveFoodOptions());

  const [currentDate, setCurrentDateState] = useCurrentDate();
  const dateString = format(currentDate, "yyyy-MM-dd");

  const dateTo = format(new Date(), "yyyy-MM-dd");
  const dateFrom = format(subDays(new Date(), 30), "yyyy-MM-dd");

  const { data: savedFoodMonth = {} } = useQuery(LastMonthFoodOptions(dateFrom, dateTo));
  const savedFood = savedFoodMonth[dateString] ?? emptyDayFallback;

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

      const queryKey = LastMonthFoodOptions(dateFrom, dateTo).queryKey;
      queryClient.setQueryData(queryKey, (oldData: Record<string, FoodType> | undefined) => {
        const data = oldData ? { ...oldData } : {};
        if (!data[dateString]) {
          data[dateString] = { breakfast: [], lunch: [], dinner: [] };
        }
        data[dateString] = {
          ...data[dateString],
          [timeOfDay]: [...data[dateString][timeOfDay], newFoodItem],
        };
        return data;
      });

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
    [savedFood, dateString, dateFrom, dateTo, queryClient, saveFood, t],
  );

  const removeFromSavedFood = useCallback(
    async (id: number, timeOfDay: TimeOfDay) => {
      const queryKey = LastMonthFoodOptions(dateFrom, dateTo).queryKey;
      queryClient.setQueryData(queryKey, (oldData: Record<string, FoodType> | undefined) => {
        const data = oldData ? { ...oldData } : {};
        if (!data[dateString]) {
          data[dateString] = { breakfast: [], lunch: [], dinner: [] };
        }
        data[dateString] = {
          ...data[dateString],
          [timeOfDay]: data[dateString][timeOfDay].filter((f) => f.id !== id),
        };
        return data;
      });

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
    [dateString, dateFrom, dateTo, queryClient, savedFood, saveFood, t],
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

      const queryKey = LastMonthFoodOptions(dateFrom, dateTo).queryKey;
      queryClient.setQueryData(queryKey, (oldData: Record<string, FoodType> | undefined) => {
        const data = oldData ? { ...oldData } : {};
        if (!data[dateString]) {
          data[dateString] = { breakfast: [], lunch: [], dinner: [] };
        }
        data[dateString] = {
          ...data[dateString],
          [timeOfDay]: data[dateString][timeOfDay].map((f) =>
            f.id === foodItem.id ? updatedFoodItem : f,
          ),
        };
        return data;
      });

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
    [dateString, dateFrom, dateTo, queryClient, savedFood, saveFood, t],
  );

  const setNewDateAndGetFood = useCallback(
    (date: Date) => {
      setCurrentDateState(format(date, "yyyy-MM-dd"));
    },
    [setCurrentDateState],
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

