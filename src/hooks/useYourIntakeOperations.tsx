"use client";
import {
  addFoodForDate,
  removeFromFood,
  setCurrentDate,
} from "@/features/savedFoodslice/savedFoodSlice";

import { foodType } from "@/types/Types";

import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { selectSavedFoodByDate } from "@/features/savedFoodslice/savedFoodSlice";

import { createContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useLoadSavedFood from "./useLoadSavedFood";

type timeOfDay = "breakfast" | "lunch" | "dinner";

const useYourIntakeOperations = () => {
  const { status, data } = useSession();

  //const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();
  const isLast = useRef(false);
  const currentDate = useSelector(
    (state: RootState) => state.savedFood.currentDate
  );
  const savedFood = useSelector((state: RootState) =>
    selectSavedFoodByDate(state, format(currentDate, "yyyy-MM-dd"))
  );

  useEffect(() => {
    const sendDataToDB = async () => {
      try {
        if (status !== "unauthenticated" && data?.user?.id) {
          const userID = data?.user?.id;
          const date = format(currentDate, "yyyy-MM-dd");
          const res = await fetch("/api/saveFood", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ date, savedFood, userID }),
          });
        }
      } catch (error) {
        console.error("Error sending data to the database:", error);
      }
    };
    sendDataToDB();
    isLast.current = false;
  }, [
    data?.user?.id,
    savedFood,
    savedFood.breakfast,
    savedFood.dinner,
    savedFood.lunch,
    status,
  ]);

  const removeFromSavedFood = (id: number, timeOfDay: timeOfDay) => {
    dispatch(
      removeFromFood({
        date: format(currentDate, "yyyy-MM-dd"),
        timeOfDay,
        id,
      })
    );
  };

  const setNewDateAndGetFood = (date: Date) => {
    dispatch(setCurrentDate(format(date, "yyyy-MM-dd")));
  };

  const addToFood = (
    calculatedCalories: number,
    name: string,
    timeOfDay: "breakfast" | "lunch" | "dinner",
    valueGrams: string,
    fat: number,
    protein: number,
    sugar: number,
    carbohydrates: number,
    fiber: number,
    salt: number
  ) => {
    const date = format(currentDate, "yyyy-MM-dd");

    dispatch(
      addFoodForDate({
        date,
        timeOfDay,
        food: {
          id: Date.now(), // ✅ stable unique id
          name,
          calories: calculatedCalories,
          amount: valueGrams,
          fat,
          protein,
          sugar,
          carbohydrates,
          fiber,
          salt,
        },
      })
    );
  };

  return {
    currentDate,
    savedFood,
    setNewDateAndGetFood,
    removeFromSavedFood,
    addToFood,
  };
};
export default useYourIntakeOperations;
