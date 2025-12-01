"use client";
import { DailyIntakeOptions } from "@/lib/queriesOptions/DailyIntakeOptions";
import { saveFood } from "@/lib/YourIntake/save-db";
import { getSavedFood } from "@/lib/YourIntake/search-db";
import { foodType } from "@/types/Types";
import { useDisclosure } from "@nextui-org/react";
import {
  hydrate,
  QueryClient,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import {
  createContext,
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export const YourIntakeContext = createContext<YourIntakeType | null>(null);
type timeOfDay = "breakfast" | "lunch" | "dinner";

type YourIntakeType = {
  currentDate: MutableRefObject<Date>;
  savedFood: foodType;
  setNewDateAndGetFood: (date: Date) => void;
  removeFromSavedFood: (id: number, timeOfDay: timeOfDay) => void;
  addToFood: (
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
  ) => void;
};

const YourIntakeProvider: React.FC<{
  children: React.ReactNode;
  date: string;
  userID: string;
}> = ({ children, date, userID }) => {
  const { status, data } = useSession();
  const currentDate = useRef(new Date());

  const isLast = useRef(false);
  const { data: initialSavedFood } = useSuspenseQuery(
    DailyIntakeOptions(userID, date)
  );

  const [savedFood, setSavedFood] = useState<foodType>(
    initialSavedFood || { breakfast: [], lunch: [], dinner: [] }
  );

  const fetchFoodMutation = useMutation({
    mutationFn: async (date: Date): Promise<foodType> => {
      if (!data?.user?.id) throw new Error("No user ID");

      const formattedDate = format(date, "yyyy-MM-dd");

      const res = await fetch(
        `/api/saveFood?date=${formattedDate}&user_id=${data.user.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch food");
      return res.json();
    },
    onSuccess: (dataD) => {
      setSavedFood(dataD);
    },
  });

  useEffect(() => {
    if (
      savedFood.breakfast.length > 0 ||
      savedFood.dinner.length > 0 ||
      savedFood.lunch.length > 0 ||
      isLast.current
    ) {
      const sendDataToDB = async () => {
        try {
          if (status !== "unauthenticated" && data?.user?.id) {
            const userID = data?.user?.id;
            const date = format(currentDate.current, "yyyy.mm.dd");
            const res = await fetch("/api/saveFood", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ date, savedFood, userID }),
            });

            saveFood(
              format(currentDate.current, "yyyy-MM-dd"),
              savedFood,
              data?.user?.id
            );
          }
        } catch (error) {
          console.error("Error sending data to the database:", error);
        }
      };
      sendDataToDB();
      isLast.current = false;
    }
  }, [
    data?.user?.id,
    savedFood,
    savedFood.breakfast,
    savedFood.dinner,
    savedFood.lunch,
    status,
  ]);

  const removeFromSavedFood = (id: number, timeOfDay: timeOfDay) => {
    setSavedFood((prevState) => {
      const updatedMeal = prevState[timeOfDay].filter(
        (foodItem) => foodItem.id !== id
      );

      if (updatedMeal.length === 0) {
        isLast.current = true;
      }
      return {
        ...prevState,
        [timeOfDay]: updatedMeal,
      };
    });
  };

  const setNewDateAndGetFood = (date: Date) => {
    currentDate.current = date;
    fetchFoodMutation.mutate(date);
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
    setSavedFood((prevState) => {
      const newTimeOfTheDay = [
        ...prevState[timeOfDay],
        {
          id: prevState[timeOfDay].length,
          name: name,
          calories: calculatedCalories,
          amount: valueGrams,
          fat: fat,
          protein: protein,
          sugar: sugar,
          carbohydrates: carbohydrates,
          fiber: fiber,
          salt: salt,
        },
      ];

      return {
        ...prevState,
        [timeOfDay]: newTimeOfTheDay,
      };
    });
  };

  return (
    <YourIntakeContext.Provider
      value={{
        currentDate,
        savedFood,
        setNewDateAndGetFood,
        removeFromSavedFood,
        addToFood,
      }}
    >
      {children}
    </YourIntakeContext.Provider>
  );
};
export default YourIntakeProvider;
