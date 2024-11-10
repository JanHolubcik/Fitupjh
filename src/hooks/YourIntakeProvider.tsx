import { saveFood } from "@/lib/YourIntake/saveFoodToDatabase-db";
import { getSavedFood } from "@/lib/YourIntake/search-db";
import { foodType } from "@/types/foodTypes";
import { useDisclosure } from "@nextui-org/react";
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

const YourIntakeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { status, data } = useSession();
  const currentDate = useRef(new Date());

  const isLast = useRef(false);
  const [savedFood, setSavedFood] = useState<foodType>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useLayoutEffect(() => {
    if (data?.user?.id) {
      const formattedDate = format(currentDate.current, "dd.MMM.yyyy");
      const fetchFood = async () => {
        const dataD: foodType = await fetch(
          `/api/saveFood?date=${formattedDate}&user_id=${data?.user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then(async (res) => {
          if (res.ok) {
            return await res.json();
            console.log(data);
          }
        });
        setSavedFood(dataD);
      };
      fetchFood();
    }
    /*
      getSavedFood(
        format(currentDate.current, "dd.MMM.yyyy"),
        data?.user?.id
      ).then((res) => {
        if (res.savedFood) {
          setSavedFood(res.savedFood);
        }
      });*/
  }, [data]);

  useEffect(() => {
    if (
      savedFood.breakfast.length > 0 ||
      savedFood.dinner.length > 0 ||
      savedFood.lunch.length > 0 ||
      isLast.current
    ) {
      // Send data to the database only if the foods array is not empty
      const sendDataToDB = async () => {
        try {
          if (status !== "unauthenticated" && data?.user?.id) {
            const userID =  data?.user?.id;
            const date =  format(currentDate.current, "dd.MMM.yyyy");
            const res = await fetch("/api/saveFood", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ date, savedFood,  userID}),
            });
        
           //const response = await res.json();
        
          
            saveFood(
              format(currentDate.current, "dd.MMM.yyyy"),
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
    console.log(savedFood);
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
    const formattedDate = format(currentDate.current, "dd.MMM.yyyy");
    if (data?.user?.id) {
      const fetchFood = async () => {
        const dataD: foodType = await fetch(
          `/api/saveFood?date=${formattedDate}&user_id=${data?.user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then(async (res) => {
          if (res.ok) {
            return await res.json();
          }
        });
        setSavedFood(dataD);
      };
      fetchFood();
    }
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
